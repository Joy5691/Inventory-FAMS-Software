const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf-8');

// Find the start of the corrupted block
const marker = '    "maintenanceSchedule": [';
const corruptedIndex = code.lastIndexOf(marker);
if (corruptedIndex !== -1) {
  // Truncate the file at this index
  code = code.substring(0, corruptedIndex);
  
  // Close the array properly and add the missing exports
  code += `    "maintenanceSchedule": [],
    "buyingDate": "2026-07-01",
    "transferHistory": []
  }
];

export const INITIAL_APPROVAL_TASKS: ApprovalTask[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
`;
  
  fs.writeFileSync('src/data/mockData.ts', code);
  console.log('Fixed mockData.ts');
} else {
  console.log('Marker not found');
}
