const fs = require('fs');
let code = fs.readFileSync('src/pages/LoginPage.css', 'utf-8');

// 1. Form Dimensions
code = code.replace(/width: 25em;\s*height: 33em;/, 'width: 26em;\n  height: 25em;');
code = code.replace(/width: 26em;\s*height: 34em;/, 'width: 28em;\n  height: 26em;'); // Wider on hover, slightly taller

// 2. Adjust internal areas
code = code.replace(/\.tccl-email-area \{\s*width: 100%;\s*padding-left: 10%;\s*padding-right: 10%;\s*height: 6em;\s*display: flex;\s*justify-content: center;\s*align-items: center;\s*flex-direction: column;\s*margin-top: 1.5em;\s*transition: all 0.25s ease;\s*\}/, 
`.tccl-email-area {
  width: 100%;
  padding-left: 10%;
  padding-right: 10%;
  height: 6em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 0.5em;
  transition: all 0.25s ease;
}`);

code = code.replace(/\.tccl-password-area \{\s*width: 100%;\s*padding-left: 10%;\s*padding-right: 10%;\s*height: 7em;\s*display: flex;\s*justify-content: center;\s*align-items: flex-end;\s*flex-direction: column;\s*transition: all 0.25s ease;\s*\}/,
`.tccl-password-area {
  width: 100%;
  padding-left: 10%;
  padding-right: 10%;
  height: 6em;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
  transition: all 0.25s ease;
}`);

code = code.replace(/\.tccl-footer-area \{\s*margin-top: 0%;\s*padding-top: 0%;\s*width: 100%;\s*padding-left: 10%;\s*padding-right: 10%;\s*height: 8em;\s*display: flex;\s*justify-content: center;\s*align-items: center;\s*flex-direction: column;\s*color: #174A7E;\s*transition: all 0.25s ease;\s*\}/,
`.tccl-footer-area {
  margin-top: 0%;
  padding-top: 0%;
  width: 100%;
  padding-left: 10%;
  padding-right: 10%;
  height: 6em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #174A7E;
  transition: all 0.25s ease;
}`);

// 3. Update background color animations
code = code.replace(/\.tccl-email-area:hover ~ \.tccl-background-color \{\s*height: 5.5em;\s*transform: translateY\(5.5em\);\s*\}/,
`.tccl-email-area:hover ~ .tccl-background-color {
  height: 6em;
  transform: translateY(5.5em);
}`);

code = code.replace(/\.tccl-password-area:hover ~ \.tccl-background-color \{\s*height: 7em;\s*transform: translateY\(11.5em\);\s*\}/,
`.tccl-password-area:hover ~ .tccl-background-color {
  height: 6em;
  transform: translateY(11.5em);
}`);

code = code.replace(/\.tccl-footer-area:hover ~ \.tccl-background-color \{\s*height: 8.5em;\s*transform: translateY\(18.5em\);\s*\}/,
`.tccl-footer-area:hover ~ .tccl-background-color {
  height: 6em;
  transform: translateY(17.5em);
}`);

fs.writeFileSync('src/pages/LoginPage.css', code);
