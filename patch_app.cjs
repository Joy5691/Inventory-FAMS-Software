const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "const [mobileMenuOpen, setMobileMenuOpen] = useState(false);",
  "const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);"
);

code = code.replace(
  "setMobileOpen={setMobileMenuOpen}",
  "setMobileOpen={setMobileMenuOpen}\n        isCollapsed={isSidebarCollapsed}\n        setIsCollapsed={setIsSidebarCollapsed}"
);

fs.writeFileSync('src/App.tsx', code);
