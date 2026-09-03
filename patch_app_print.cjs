const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Hide Sidebar during print
if (!code.includes('<Sidebar\\n        activePage')) {
    code = code.replace(/<Sidebar([^>]+)>/, `<div className="print:hidden"><Sidebar$1></div>`);
} else {
    // Actually we can just wrap the Sidebar component inside a print:hidden div, or pass a class. Sidebar doesn't take className so wrapper is safest.
    const sidebarCall = `<Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        activeTab={activePage}
        setActiveTab={setActivePage}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />`;
      
    if (code.includes(sidebarCall)) {
        code = code.replace(sidebarCall, `<div className="print:hidden">\\n        ${sidebarCall.trim()}\\n      </div>`);
    } else {
        console.log('Sidebar call not exact match');
    }
}

// Hide Header during print
const headerCall = `<Header
          onMenuToggle={() => setMobileMenuOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />`;

if (code.includes(headerCall)) {
    code = code.replace(headerCall, `<div className="print:hidden">\\n          ${headerCall.trim()}\\n        </div>`);
} else {
    console.log('Header call not exact match');
}

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched for print');
