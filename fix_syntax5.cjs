const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');

code = code.replace(/    <\/div>\n  \);\n};\s*$/, `      </div>\n    </div>\n  );\n};\n`);
fs.writeFileSync('src/pages/ProjectsPage.tsx', code, 'utf8');
console.log('Fixed end again');
