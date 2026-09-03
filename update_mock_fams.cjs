const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf8');

// The easiest way is to find "currentLocation": "..." and replace it with the projectName.
// Since projectName is right above it:
// "projectName": "...",
// "currentLocation": "...",

code = code.replace(/"projectName":\s*"([^"]+)",\s*"currentLocation":\s*"[^"]+"/g, '"projectName": "$1",\n    "currentLocation": "$1"');

fs.writeFileSync('src/data/mockData.ts', code);
console.log("Mock assets synced.");
