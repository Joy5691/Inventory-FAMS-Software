const fs = require('fs');
let text = fs.readFileSync('src/data/mockData.ts', 'utf-8');
const bracketIdx = text.indexOf('[', text.indexOf('export const INITIAL_ITEMS'));
let depth = 0; let arrayDepth = 0; let inString = false; let stringChar = '';
let tokens = [];
for (let i = bracketIdx; i < bracketIdx + 1000; i++) {
    if (inString) {
        if (text[i] === '\\') i++;
        else if (text[i] === stringChar) inString = false;
        continue;
    } else if (text[i] === '"' || text[i] === "'" || text[i] === '`') {
        inString = true; stringChar = text[i]; continue;
    }
    
    if (text[i] === '{' || text[i] === '}' || text[i] === '[' || text[i] === ']') {
        tokens.push(text[i]);
    }
}
console.log(tokens.join(''));
