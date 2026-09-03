const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');
code = code.trim();
if(code.endsWith('};')) {
    code = code.replace(/};\s*$/, '\n    </div>\n  );\n};');
    fs.writeFileSync('src/pages/ProjectsPage.tsx', code, 'utf8');
    console.log('Fixed final divs');
}
