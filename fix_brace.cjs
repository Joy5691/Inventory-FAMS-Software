const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const target = `          return updated;
        });
    });

    setMtvs`;

const replacement = `          return updated;
        });
      } // CLOSE ELSE BLOCK
    });

    setMtvs`;

code = code.replace(target, replacement);
fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("Fixed missing brace");
