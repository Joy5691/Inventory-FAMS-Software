const fs = require('fs');
const content = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');
const handleCreateMRSubmit = content.match(/const handleCreateMRSubmit.*?^  };/ms)[0];
console.log(handleCreateMRSubmit.substring(0, 300));
