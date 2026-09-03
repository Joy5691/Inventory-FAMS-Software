const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf-8');

function sliceArray(code, arrayName, maxItems) {
    const startPattern = `export const ${arrayName}`;
    const startIdx = code.indexOf(startPattern);
    if (startIdx === -1) return code;
    
    const arrayStartIdx = code.indexOf('[', startIdx);
    if (arrayStartIdx === -1) return code;
    
    let depth = 0; // depth inside the array
    let objectDepth = 0; // depth inside an object
    let itemsFound = 0;
    
    let endSliceIdx = -1;
    
    // We are looking for depth=1 (the elements of the array), which are objects `{ ... }`.
    for (let i = arrayStartIdx + 1; i < code.length; i++) {
        if (code[i] === '{') {
            objectDepth++;
        } else if (code[i] === '}') {
            objectDepth--;
            if (objectDepth === 0) {
                itemsFound++;
                if (itemsFound === maxItems) {
                    let nextCommaOrEnd = i + 1;
                    while (nextCommaOrEnd < code.length && /\s/.test(code[nextCommaOrEnd])) {
                        nextCommaOrEnd++;
                    }
                    if (code[nextCommaOrEnd] === ',') {
                        nextCommaOrEnd++;
                    }
                    endSliceIdx = nextCommaOrEnd;
                    break;
                }
            }
        } else if (code[i] === '[' && objectDepth === 0) {
           // nested array not handled easily like this unless we track array depth.
           // but these are arrays of objects, so root elements are objects `{ ... }`
        }
    }
    
    if (endSliceIdx === -1) return code;
    
    // Find the end of the array
    let arrayDepth = 1;
    let arrayEndIdx = -1;
    for (let i = arrayStartIdx + 1; i < code.length; i++) {
        if (code[i] === '[') arrayDepth++;
        else if (code[i] === ']') {
            arrayDepth--;
            if (arrayDepth === 0) {
                arrayEndIdx = i;
                break;
            }
        }
    }
    
    if (arrayEndIdx !== -1) {
        // the array end might be followed by `;` or newline.
        code = code.substring(0, endSliceIdx) + '\n]' + code.substring(arrayEndIdx + 1);
    }
    
    return code;
}

code = sliceArray(code, 'INITIAL_ITEMS', 10);
code = sliceArray(code, 'INITIAL_STOCKS', 10);
code = sliceArray(code, 'INITIAL_ASSETS', 10);

fs.writeFileSync('src/data/mockData.ts', code);
console.log("Truncated successfully");
