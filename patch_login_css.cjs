const fs = require('fs');
let code = fs.readFileSync('src/pages/LoginPage.css', 'utf-8');

code = code.replace(/width: 22em;/, 'width: 25em;');
code = code.replace(/height: 30em;/, 'height: 33em;');
code = code.replace(/border-bottom-left-radius: 2em;\s*border-top-right-radius: 2em;/, 'border-radius: 2em;');
code = code.replace(/width: 23em;\s*height: 31em;/, 'width: 26em;\n  height: 34em;');

fs.writeFileSync('src/pages/LoginPage.css', code);
