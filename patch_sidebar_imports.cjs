const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf-8');

code = code.replace(
  "UserCheck\n} from 'lucide-react';",
  "UserCheck,\n  ChevronLeft,\n  ChevronRight,\n  Maximize,\n  Minimize\n} from 'lucide-react';"
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
