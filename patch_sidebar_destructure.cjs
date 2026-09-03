const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf-8');

code = code.replace(
  "export const Sidebar: React.FC<SidebarProps> = ({",
  "export const Sidebar: React.FC<SidebarProps> = ({\n  isCollapsed,\n  setIsCollapsed,"
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
