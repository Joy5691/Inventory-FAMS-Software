const fs = require('fs');
let text = fs.readFileSync('src/data/mockData.ts', 'utf-8');

function trimArray(name, keepCount) {
    const startStr = `export const ${name}`;
    const startIdx = text.indexOf(startStr);
    if (startIdx === -1) return;
    
    const bracketIdx = text.indexOf('[', startIdx);
    
    let depth = 0; // {}
    let arrayDepth = 0; // []
    let count = 0;
    let endOfLastKept = -1;
    let endOfArray = -1;
    let inString = false;
    let stringChar = '';
    
    for (let i = bracketIdx; i < text.length; i++) {
        // string handling
        if (inString) {
            if (text[i] === '\\') {
                i++; // skip escaped char
            } else if (text[i] === stringChar) {
                inString = false;
            }
            continue;
        } else if (text[i] === '"' || text[i] === "'" || text[i] === '`') {
            inString = true;
            stringChar = text[i];
            continue;
        }
        
        if (text[i] === '{') {
            depth++;
        } else if (text[i] === '}') {
            depth--;
            if (depth === 0 && arrayDepth === 1) { // object at top level of array
                count++;
                if (count === keepCount) {
                    let j = i + 1;
                    while (j < text.length && /\s/.test(text[j])) j++;
                    if (text[j] === ',') j++;
                    endOfLastKept = j;
                }
            }
        } else if (text[i] === '[') {
            arrayDepth++;
        } else if (text[i] === ']') {
            arrayDepth--;
            if (arrayDepth === 0) {
                endOfArray = i;
                break;
            }
        }
    }
    
    if (endOfLastKept !== -1 && endOfArray !== -1 && endOfArray > endOfLastKept) {
        text = text.slice(0, endOfLastKept) + '\n];' + text.slice(endOfArray + 2); // assuming `];`
        console.log(`Successfully sliced ${name}`);
    } else {
        console.log(`Failed to slice ${name}: kept=${endOfLastKept}, array=${endOfArray}`);
    }
}

trimArray('INITIAL_ITEMS', 10);
trimArray('INITIAL_STOCKS', 10);
trimArray('INITIAL_ASSETS', 10);

fs.writeFileSync('src/data/mockData.ts', text);
console.log('Done trimming mock data');
