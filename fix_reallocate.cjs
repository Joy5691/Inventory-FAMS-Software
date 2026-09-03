const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// 1. Change asset status to 'In-Transit'
code = code.replace(
  `      status: 'Active / Deployed',
      transferHistory: [transferEntry, ...(a.transferHistory || [])]`,
  `      status: 'In-Transit',
      transferHistory: [transferEntry, ...(a.transferHistory || [])]`
);

// 2. Change MTV status and add task
const mtvEndStr = `      preparedBy: currentUser?.name || 'FAMS Logistics Officer',
      status: 'Received'
    };

    setMtvs(prev => [newMTV, ...prev]);`;

const mtvEndReplacement = `      preparedBy: currentUser?.name || 'FAMS Logistics Officer',
      status: 'Dispatched (In Transit)'
    };

    setMtvs(prev => [newMTV, ...prev]);

    // Create approval/receiving task for the destination site
    setApprovalTasks(prev => [{
      id: \`app-mtv-\${Date.now()}\`,
      documentType: 'MTV',
      documentId: newMTV.id,
      documentNumber: newMTV.mtvNumber,
      projectId: toProjectId,
      projectName: toProjectName,
      requestedBy: newMTV.preparedBy,
      submittedDate: newMTV.date,
      priority: 'Normal',
      requiredRole: 'Store Officer',
      status: 'Pending',
      approvalStage: 'Destination Receiving Confirmation',
      comments: \`\${newMTV.transferType} from \${actualFrom} to \${toLocation}.\`
    }, ...prev]);`;

code = code.replace(mtvEndStr, mtvEndReplacement);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("Updated reallocateAsset");
