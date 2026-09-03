const fs = require('fs');
let text = fs.readFileSync('src/data/mockData.ts', 'utf-8');

function emptyArray(name) {
    const startStr = `export const ${name}`;
    const startIdx = text.indexOf(startStr);
    if (startIdx === -1) {
        console.log(`Not found: ${name}`);
        return;
    }
    
    const eqIdx = text.indexOf('=', startIdx);
    const bracketIdx = text.indexOf('[', eqIdx);
    
    let arrayDepth = 0;
    let endOfArray = -1;
    let inString = false;
    let stringChar = '';
    
    for (let i = bracketIdx; i < text.length; i++) {
        if (inString) {
            if (text[i] === '\\') { i++; }
            else if (text[i] === stringChar) { inString = false; }
            continue;
        } else if (text[i] === '"' || text[i] === "'" || text[i] === '`') {
            inString = true;
            stringChar = text[i];
            continue;
        }
        
        if (text[i] === '[') {
            arrayDepth++;
        } else if (text[i] === ']') {
            arrayDepth--;
            if (arrayDepth === 0) {
                endOfArray = i;
                break;
            }
        }
    }
    
    if (endOfArray !== -1) {
        text = text.slice(0, bracketIdx) + '[]' + text.slice(endOfArray + 1);
        console.log(`Emptied ${name}`);
    }
}

const arraysToEmpty = [
    'INITIAL_MRS', 'INITIAL_MARS', 'INITIAL_PRS', 'INITIAL_CS',
    'INITIAL_POS', 'INITIAL_GRNS', 'INITIAL_MIVS', 'INITIAL_MTVS',
    'INITIAL_GATE_PASSES', 'INITIAL_APPROVAL_TASKS', 'INITIAL_AUDIT_LOGS'
];

arraysToEmpty.forEach(emptyArray);

fs.writeFileSync('src/data/mockData.ts', text);
