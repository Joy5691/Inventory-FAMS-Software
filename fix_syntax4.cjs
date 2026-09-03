const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');

// replace the end
code = code.replace(/    <\/div>\n  \);\n\n    <\/div>\n  \);\n};\s*$/, `      )}
    </div>
  );
};
`);
fs.writeFileSync('src/pages/ProjectsPage.tsx', code, 'utf8');
console.log('Fixed end');
