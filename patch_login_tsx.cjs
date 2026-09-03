const fs = require('fs');
let code = fs.readFileSync('src/pages/LoginPage.tsx', 'utf-8');

// Add company text below logo
code = code.replace(
  /<div className="mb-8">\s*<Logo showTagline=\{false\} className="scale-125" \/>\s*<\/div>/,
  `<div className="flex flex-col items-center text-center mb-8">
          <div className="mb-6">
            <Logo showTagline={false} className="justify-center scale-125" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
            TECHNIC Construction Company Ltd.
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Enterprise ERP & Asset Portal
          </p>
        </div>`
);

// Remove "Forgot password?"
code = code.replace(/<a>Forgot password\?<\/a>/, '');

// Remove the sign up option
code = code.replace(
  /<div className="tccl-text-inside">\s*<p>Don't have an account\?<\/p>\s*<a className="tccl-link">Sign Up<\/a>\s*<\/div>/,
  ''
);

fs.writeFileSync('src/pages/LoginPage.tsx', code);
