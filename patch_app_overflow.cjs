const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The main layout wrapper
code = code.replace(
    'className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden antialiased selection:bg-blue-600 selection:text-white relative"',
    'className="flex h-screen print:h-auto bg-[#F8FAFC] print:bg-white text-slate-900 font-sans overflow-hidden print:overflow-visible antialiased selection:bg-blue-600 selection:text-white relative"'
);

// Main Content Area wrapper
code = code.replace(
    '<div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">',
    '<div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible relative z-10">'
);

// Main scrollable area
code = code.replace(
    '<main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth z-0">',
    '<main className="flex-1 overflow-y-auto print:overflow-visible p-4 md:p-6 lg:p-8 print:p-0 scroll-smooth z-0">'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx overflow patched');
