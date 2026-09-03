import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Project,
  ItemMaster,
  StoreStock,
  MaterialRequisition,
  MaterialAvailabilityReport,
  PurchaseRequisition,
  Vendor,
  ComparativeStatement,
  PurchaseOrder,
  GoodsReceivedNote,
  MaterialIssueVoucher,
  MaterialTransferVoucher,
  GatePass,
  FixedAsset,
  AssetRequisition,
  ApprovalTask,
  AuditLog,
  DocumentStatus,
  MARItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_ITEMS,
  INITIAL_STOCKS,
  INITIAL_VENDORS,
  INITIAL_MRS,
  INITIAL_MARS,
  INITIAL_PRS,
  INITIAL_CS,
  INITIAL_POS,
  INITIAL_GRNS,
  INITIAL_MIVS,
  INITIAL_MTVS,
  INITIAL_GATE_PASSES,
  INITIAL_ASSETS,
  INITIAL_APPROVAL_TASKS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ASSET_REQUISITIONS
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole;
  isAuthenticated: boolean;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  setActiveRole: (role: UserRole) => void;

  // Domain state
  projects: Project[];
  items: ItemMaster[];
  stocks: StoreStock[];
  vendors: Vendor[];
  mrs: MaterialRequisition[];
  mars: MaterialAvailabilityReport[];
  prs: PurchaseRequisition[];
  csList: ComparativeStatement[];
  pos: PurchaseOrder[];
  grns: GoodsReceivedNote[];
  mivs: MaterialIssueVoucher[];
  mtvs: MaterialTransferVoucher[];
  gatePasses: GatePass[];
  assets: FixedAsset[];
  assetRequisitions: AssetRequisition[];
  approvalTasks: ApprovalTask[];
  auditLogs: AuditLog[];

  // Action methods
  createMR: (mr: Omit<MaterialRequisition, 'id' | 'mrNumber' | 'documentNo' | 'createdAt'>) => MaterialRequisition;
  verifyMR: (mrId: string) => void;
  approveMR: (mrId: string) => void;
  rejectMR: (mrId: string, reason?: string) => void;
  
  createMAR: (mrId: string, customItems?: MARItem[]) => MaterialAvailabilityReport;
  reserveStock: (marId: string, itemId: string, qty: number, storeName: string) => void;
  createPRFromMAR: (marId: string) => PurchaseRequisition;
  approvePurchaseRequisition: (prId: string) => void;
  
  createComparativeStatement: (cs: Omit<ComparativeStatement, 'id' | 'csNumber'>) => ComparativeStatement;
  approveComparativeStatement: (csId: string) => void;
  
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'docNo'>) => PurchaseOrder;
  approvePurchaseOrder: (poId: string) => void;
  
  createGRN: (grn: Omit<GoodsReceivedNote, 'id' | 'grnNumber'>) => GoodsReceivedNote;
  postGRN: (grnId: string, options?: any) => void;
  receiveChallanForPO: (poId: string, options?: any) => void;
  issueMARToGRN: (marId: string) => GoodsReceivedNote | null;

  createMIV: (miv: Omit<MaterialIssueVoucher, 'id' | 'mivNumber'>) => MaterialIssueVoucher;
  createMTV: (mtv: Omit<MaterialTransferVoucher, 'id' | 'mtvNumber'>) => MaterialTransferVoucher;
  confirmMTVReceipt: (mtvId: string) => void;

  createGatePass: (gp: Omit<GatePass, 'id' | 'gatePassNo' | 'qrCodeValue'>) => GatePass;
  verifyGatePass: (gpId: string, guardName: string) => void;
  verifyGatePassSecurity?: (gpId: string, guardName?: string) => void;
  markGatePassReturned?: (gpId: string) => void;

  registerAsset: (asset: Omit<FixedAsset, 'id' | 'assetCode' | 'qrCode' | 'currentNetBookValue'>) => FixedAsset;
  createAsset: (asset: Omit<FixedAsset, 'id' | 'assetCode' | 'qrCode' | 'currentNetBookValue'>) => FixedAsset;
  updateAsset: (assetId: string, updates: Partial<FixedAsset>) => void;
  updateAssetStatus: (assetId: string, status: FixedAsset['status']) => void;
  reallocateAsset: (
    assetId: string,
    toProjectId: string,
    toProjectName: string,
    toLocation: string,
    custodianName: string,
    custodianPhone: string,
    transferType?: 'Site to Site' | 'Office to Site' | 'Site to Office',
    fromLocation?: string
  ) => void;
  addAssetMaintenance: (assetId: string, maint: FixedAsset['maintenanceSchedule'][0]) => void;
  addMaintenanceLog: (assetId: string, maint: FixedAsset['maintenanceSchedule'][0]) => void;

  requestAssetRelocation: (req: Omit<AssetRequisition, 'id' | 'requisitionNo' | 'status' | 'createdAt'>) => AssetRequisition;
  approveAssetRequisition: (requisitionId: string, remarks?: string) => void;
  rejectAssetRequisition: (requisitionId: string, remarks?: string) => void;

  approveApprovalTask: (taskId: string, comment?: string) => void;
  rejectApprovalTask: (taskId: string, comment?: string) => void;
  returnApprovalTask: (taskId: string, comment?: string) => void;

  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'TECHNIC_ERP_V14_CLEAN_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or initial
  const loadStorage = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStorage('USER', INITIAL_USERS[0]));
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    const savedUser = loadStorage<User | null>('USER', INITIAL_USERS[0]);
    return savedUser ? savedUser.role : 'Super Admin';
  });

  const [projects, setProjects] = useState<Project[]>(() => loadStorage('PROJECTS', INITIAL_PROJECTS));
  const [items, setItems] = useState<ItemMaster[]>(() => loadStorage('ITEMS', INITIAL_ITEMS));
  const [stocks, setStocks] = useState<StoreStock[]>(() => loadStorage('STOCKS', INITIAL_STOCKS));
  const [vendors, setVendors] = useState<Vendor[]>(() => loadStorage('VENDORS', INITIAL_VENDORS));
  const [mrs, setMrs] = useState<MaterialRequisition[]>(() => loadStorage('MRS', INITIAL_MRS));
  const [mars, setMars] = useState<MaterialAvailabilityReport[]>(() => loadStorage('MARS', INITIAL_MARS));
  const [prs, setPrs] = useState<PurchaseRequisition[]>(() => loadStorage('PRS', INITIAL_PRS));
  const [csList, setCsList] = useState<ComparativeStatement[]>(() => loadStorage('CS', INITIAL_CS));
  const [pos, setPos] = useState<PurchaseOrder[]>(() => loadStorage('POS', INITIAL_POS));
  const [grns, setGrns] = useState<GoodsReceivedNote[]>(() => loadStorage('GRNS', INITIAL_GRNS));
  const [mivs, setMivs] = useState<MaterialIssueVoucher[]>(() => loadStorage('MIVS', INITIAL_MIVS));
  const [mtvs, setMtvs] = useState<MaterialTransferVoucher[]>(() => loadStorage('MTVS', INITIAL_MTVS));
  const [gatePasses, setGatePasses] = useState<GatePass[]>(() => loadStorage('GATE_PASSES', INITIAL_GATE_PASSES));
  const [assets, setAssets] = useState<FixedAsset[]>(() => loadStorage('ASSETS', INITIAL_ASSETS));
  const [assetRequisitions, setAssetRequisitions] = useState<AssetRequisition[]>(() => loadStorage('ASSET_REQUISITIONS', INITIAL_ASSET_REQUISITIONS));
  const [approvalTasks, setApprovalTasks] = useState<ApprovalTask[]>(() => loadStorage('APPROVALS', INITIAL_APPROVAL_TASKS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStorage('AUDIT', INITIAL_AUDIT_LOGS));

  // Sync to local storage
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'USER', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'PROJECTS', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'ITEMS', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'STOCKS', JSON.stringify(stocks)); }, [stocks]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'VENDORS', JSON.stringify(vendors)); }, [vendors]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'MRS', JSON.stringify(mrs)); }, [mrs]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'MARS', JSON.stringify(mars)); }, [mars]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'PRS', JSON.stringify(prs)); }, [prs]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'CS', JSON.stringify(csList)); }, [csList]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'POS', JSON.stringify(pos)); }, [pos]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'GRNS', JSON.stringify(grns)); }, [grns]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'MIVS', JSON.stringify(mivs)); }, [mivs]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'MTVS', JSON.stringify(mtvs)); }, [mtvs]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'GATE_PASSES', JSON.stringify(gatePasses)); }, [gatePasses]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'ASSETS', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'ASSET_REQUISITIONS', JSON.stringify(assetRequisitions)); }, [assetRequisitions]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'APPROVALS', JSON.stringify(approvalTasks)); }, [approvalTasks]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'AUDIT', JSON.stringify(auditLogs)); }, [auditLogs]);

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newEntry: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const login = (username: string, password?: string): boolean => {
    const trimmed = username.trim().toLowerCase();
    let foundUser = INITIAL_USERS.find(u => u.username.toLowerCase() === trimmed);
    if (!foundUser) {
      if (trimmed === 'superadmin' || trimmed === 'admin') {
        foundUser = INITIAL_USERS[0];
      } else {
        foundUser = {
          id: `usr-custom-${Date.now()}`,
          name: username,
          username: username,
          email: `${username}@technicbd.com`,
          role: 'Super Admin',
          department: 'Executive Management',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          employeeId: 'TCCL-EMP-999',
          phone: '+880 1844-143001',
          assignedProjects: ['proj-1', 'proj-2', 'proj-3', 'proj-4']
        };
      }
    }
    setCurrentUser(foundUser);
    setActiveRoleState(foundUser.role);
    addAuditLog({
      userName: foundUser.name,
      userRole: foundUser.role,
      action: 'USER_LOGIN',
      documentType: 'Security Session',
      documentCode: 'AUTH-OK',
      details: `User ${foundUser.name} signed in successfully with role ${foundUser.role}.`
    });
    return true;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog({
        userName: currentUser.name,
        userRole: activeRole,
        action: 'USER_LOGOUT',
        documentType: 'Security Session',
        documentCode: 'AUTH-OUT',
        details: `User ${currentUser.name} signed out.`
      });
    }
    setCurrentUser(null);
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
      addAuditLog({
        userName: currentUser.name,
        userRole: role,
        action: 'SWITCH_ACTIVE_ROLE',
        documentType: 'User Permission',
        documentCode: 'RBAC-SWITCH',
        details: `Switched active testing role view to ${role}.`
      });
    }
  };

  // MR Methods
  const createMR = (mrData: Omit<MaterialRequisition, 'id' | 'mrNumber' | 'documentNo' | 'createdAt'>): MaterialRequisition => {
    const nextIndex = mrs.length + 46;
    const mrNum = `MR-2026-${String(nextIndex).padStart(4, '0')}`;
    const newMR: MaterialRequisition = {
      ...mrData,
      id: `mr-${Date.now()}`,
      mrNumber: mrNum,
      documentNo: 'TCCL/PUR/04/01',
      status: 'Pending Verification',
      createdAt: new Date().toISOString()
    };

    setMrs(prev => [newMR, ...prev]);

    // Create approval task for PM
    const newTask: ApprovalTask = {
      id: `app-mr-${Date.now()}`,
      documentType: 'Material Requisition',
      documentId: newMR.id,
      documentNumber: newMR.mrNumber,
      projectId: newMR.projectId,
      projectName: newMR.projectName,
      requestedBy: newMR.initiatedBy,
      amount: newMR.items.reduce((sum, it) => sum + (it.quantity * (it.estimatedUnitPrice || 0)), 0),
      submittedDate: newMR.date,
      priority: newMR.priority,
      requiredRole: 'Project Manager',
      status: 'Pending',
      approvalStage: 'Technical Verification (Site PM)',
      comments: `New requisition for ${newMR.items.length} line items.`
    };
    setApprovalTasks(prev => [newTask, ...prev]);

    addAuditLog({
      userName: currentUser?.name || newMR.initiatedBy,
      userRole: activeRole,
      action: 'CREATE_MR',
      documentType: 'Material Requisition',
      documentCode: newMR.mrNumber,
      projectName: newMR.projectName,
      previousStatus: 'None',
      newStatus: 'Pending Verification',
      details: `Material Requisition ${newMR.mrNumber} created with ${newMR.items.length} line items.`
    });

    return newMR;
  };

  const verifyMR = (mrId: string) => {
    setMrs(prev => prev.map(m => m.id === mrId ? { ...m, status: 'Pending Approval', checkedBy: currentUser?.name } : m));
    setApprovalTasks(prev => prev.map(t => t.documentId === mrId ? {
      ...t,
      requiredRole: 'Managing Director',
      approvalStage: 'Managing Director Endorsement (Level 2)'
    } : t));

    addAuditLog({
      userName: currentUser?.name || 'Verifier',
      userRole: activeRole,
      action: 'VERIFY_MR',
      documentType: 'Material Requisition',
      documentCode: mrId,
      newStatus: 'Pending Approval',
      details: 'Material Requisition verified by Project Manager, forwarded to MD.'
    });
  };

  const approveMR = (mrId: string) => {
    const targetMR = mrs.find(m => m.id === mrId);
    setMrs(prev => prev.map(m => m.id === mrId ? { ...m, status: 'Approved', authorizedBy: currentUser?.name } : m));
    setApprovalTasks(prev => prev.map(t => t.documentId === mrId ? { ...t, status: 'Approved' } : t));

    if (targetMR) {
      // Automatic multi-store availability audit
      const availableItemsForGRN: any[] = [];
      const shortageItemsForPR: any[] = [];

      targetMR.items.forEach((it, idx) => {
        // Find matching stock in Central and Regional Stores
        const allStoresStocks = stocks.filter(s => 
          s.itemId === it.itemId || 
          s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase())
        );
        const centralStocks = allStoresStocks.filter(s => 
          s.storeName.includes('Central Store') || 
          s.storeName.includes('Ashulia') || 
          s.storeName.includes('Head Office') ||
          s.storeName.includes('Regional Store')
        );
        const totalAvailable = centralStocks.reduce((sum, s) => sum + (s.availableQty || 0), 0);
        const reqQty = Number(it.quantity) || 1;

        if (totalAvailable >= reqQty) {
          // Full requirement is available internally
          availableItemsForGRN.push({
            slNo: availableItemsForGRN.length + 1,
            itemId: it.itemId || `itm-${idx}`,
            itemCode: (it as any).itemCode || `MAT-${it.itemDescription.substring(0, 3).toUpperCase()}-00${idx + 1}`,
            itemDescription: it.itemDescription,
            specification: it.specification || '',
            unit: it.unit || 'Nos',
            orderedQty: reqQty,
            receivedQty: reqQty,
            acceptedQty: 0, // ready for inspection and challan acceptance
            rejectedQty: 0,
            damagedQty: 0,
            inspectionResult: 'Passed' as const,
            remarks: `Transferred from Central Store for ${targetMR.mrNumber}`
          });
        } else if (totalAvailable > 0) {
          // Partial available -> Available portion goes to GRN, Shortage goes to PR
          availableItemsForGRN.push({
            slNo: availableItemsForGRN.length + 1,
            itemId: it.itemId || `itm-${idx}`,
            itemCode: (it as any).itemCode || `MAT-${it.itemDescription.substring(0, 3).toUpperCase()}-00${idx + 1}`,
            itemDescription: it.itemDescription,
            specification: it.specification || '',
            unit: it.unit || 'Nos',
            orderedQty: totalAvailable,
            receivedQty: totalAvailable,
            acceptedQty: 0,
            rejectedQty: 0,
            damagedQty: 0,
            inspectionResult: 'Passed' as const,
            remarks: `Partial stock (${totalAvailable} of ${reqQty}) transferred from Central Store`
          });
          shortageItemsForPR.push({
            slNo: shortageItemsForPR.length + 1,
            itemId: it.itemId || `itm-${idx}`,
            itemDescription: it.itemDescription,
            specification: it.specification || '',
            unit: it.unit || 'Nos',
            requiredQty: reqQty - totalAvailable,
            estimatedUnitPrice: it.estimatedUnitPrice || 0,
            ledger: it.ledger || 'Procurement Shortage'
          });
        } else {
          // Entire item is unavailable in stock -> route to PR
          shortageItemsForPR.push({
            slNo: shortageItemsForPR.length + 1,
            itemId: it.itemId || `itm-${idx}`,
            itemDescription: it.itemDescription,
            specification: it.specification || '',
            unit: it.unit || 'Nos',
            requiredQty: reqQty,
            estimatedUnitPrice: it.estimatedUnitPrice || 0,
            ledger: it.ledger || 'Procurement Shortage'
          });
        }
      });

      // 1. Available stocks automatically route to Project GRN for site approval & challan upload
      if (availableItemsForGRN.length > 0) {
        const grnNum = `GRN-2026-${String(grns.length + 28).padStart(4, '0')}`;
        const siteStoreName = `${targetMR.projectName} Site Store`;

        const newGRN: GoodsReceivedNote = {
          id: `grn-${Date.now()}`,
          grnNumber: grnNum,
          date: new Date().toISOString().substring(0, 10),
          poId: targetMR.id,
          poNumber: `Internal Transfer (${targetMR.mrNumber})`,
          vendorName: 'Central Store (Internal Transfer)',
          supplierChallanNo: `CH-INT-${targetMR.mrNumber.replace('MR-', '')}`,
          vehicleNo: 'Dhaka Metro-TA-14-3829 (10-Ton)',
          driverName: 'Abdul Karim',
          driverPhone: '+880 1712-334455',
          receivingStore: siteStoreName,
          projectId: targetMR.projectId,
          projectName: targetMR.projectName,
          items: availableItemsForGRN,
          inspectedBy: 'Site Engineer (Awaiting Physical Inspection)',
          storeOfficer: currentUser?.name || 'Site Store Controller',
          status: 'Draft'
        };

        setGrns(prev => [newGRN, ...prev]);

        // Create approval task for Site GRN
        const newGRNTask: ApprovalTask = {
          id: `task-grn-${Date.now()}`,
          documentType: 'Goods Received Note',
          documentNumber: newGRN.grnNumber,
          documentId: newGRN.id,
          projectId: targetMR.projectId,
          projectName: targetMR.projectName,
          requestedBy: 'Central Store Controller',
          submittedDate: new Date().toISOString().substring(0, 10),
          status: 'Pending',
          priority: targetMR.priority || 'High',
          amount: availableItemsForGRN.reduce((sum, it) => sum + (it.orderedQty * (targetMR.items.find(mi => mi.itemId === it.itemId)?.estimatedUnitPrice || 500)), 0),
          requiredRole: 'Project Manager',
          approvalStage: 'Site Material Receipt & Challan Inspection'
        };
        setApprovalTasks(prev => [newGRNTask, ...prev]);

        // Deduct/reserve available stocks from Central Store
        setStocks(prev => {
          let updated = [...prev];
          availableItemsForGRN.forEach(it => {
            let rem = it.orderedQty;
            for (let i = 0; i < updated.length && rem > 0; i++) {
              if (
                (updated[i].storeName.includes('Central Store') || updated[i].storeName.includes('Ashulia') || updated[i].storeName.includes('Head Office')) &&
                (updated[i].itemId === it.itemId || updated[i].itemName.toLowerCase().includes(it.itemDescription.toLowerCase()))
              ) {
                const deduct = Math.min(updated[i].availableQty, rem);
                updated[i] = {
                  ...updated[i],
                  availableQty: Math.max(0, updated[i].availableQty - deduct),
                  reservedQty: (updated[i].reservedQty || 0) + deduct,
                  lastUpdated: new Date().toISOString().substring(0, 10)
                };
                rem -= deduct;
              }
            }
          });
          return updated;
        });
      }

      // 2. Parallelly, shortage items route to Purchase Requisition (PR)
      if (shortageItemsForPR.length > 0) {
        const prNum = `PR-2026-${String(prs.length + 20).padStart(4, '0')}`;
        const totalEstVal = shortageItemsForPR.reduce((sum, it) => sum + (it.requiredQty * it.estimatedUnitPrice), 0);
        const newPR: PurchaseRequisition = {
          id: `pr-${Date.now()}`,
          prNumber: prNum,
          documentNo: `TCCL/PUR/04/${String(prs.length + 20).padStart(3, '0')}`,
          date: new Date().toISOString().substring(0, 10),
          dueDate: targetMR.dueDate || new Date().toISOString().substring(0, 10),
          sourceMrId: targetMR.id,
          sourceMrNumber: targetMR.mrNumber,
          projectId: targetMR.projectId,
          projectName: targetMR.projectName,
          location: targetMR.location || 'Site',
          department: 'Civil Construction',
          purchaseType: 'Direct Procurement for Requisition Shortage',
          status: 'Pending Approval',
          initiatedBy: currentUser?.name || 'Central Store Controller',
          createdAt: new Date().toISOString(),
          items: shortageItemsForPR.map(it => ({
            id: `pr-item-${Date.now()}-${it.slNo}`,
            itemId: it.itemId,
            itemDescription: it.itemDescription,
            specification: it.specification,
            unit: it.unit,
            quantity: it.requiredQty,
            shortageQty: it.requiredQty,
            classification: 'Raw Material',
            estimatedUnitPrice: it.estimatedUnitPrice,
            ledger: it.ledger
          }))
        };
        setPrs(prev => [newPR, ...prev]);

        const newPRTask: ApprovalTask = {
          id: `task-pr-${Date.now()}`,
          documentType: 'Purchase Requisition',
          documentNumber: newPR.prNumber,
          documentId: newPR.id,
          projectId: targetMR.projectId,
          projectName: targetMR.projectName,
          requestedBy: currentUser?.name || 'Procurement Coordinator',
          submittedDate: new Date().toISOString().substring(0, 10),
          status: 'Pending',
          priority: targetMR.priority || 'High',
          amount: totalEstVal,
          requiredRole: 'Managing Director',
          approvalStage: 'Procurement Commercial Approval'
        };
        setApprovalTasks(prev => [newPRTask, ...prev]);
      }
    }

    addAuditLog({
      userName: currentUser?.name || 'Approver',
      userRole: activeRole,
      action: 'APPROVE_MR',
      documentType: 'Material Requisition',
      documentCode: mrId,
      newStatus: 'Approved',
      details: `Material Requisition ${targetMR?.mrNumber || mrId} approved. Available stocks routed to Project GRN for inspection; shortage items routed to PR.`
    });
  };

  const rejectMR = (mrId: string, reason?: string) => {
    setMrs(prev => prev.map(m => m.id === mrId ? { ...m, status: 'Rejected', remarks: reason } : m));
    setApprovalTasks(prev => prev.map(t => t.documentId === mrId ? { ...t, status: 'Rejected', comments: reason } : t));
    addAuditLog({
      userName: currentUser?.name || 'Approver',
      userRole: activeRole,
      action: 'REJECT_MR',
      documentType: 'Material Requisition',
      documentCode: mrId,
      newStatus: 'Rejected',
      details: `Requisition rejected: ${reason || 'Does not match BOQ budget.'}`
    });
  };
  const rejectPurchaseRequisition = (prId: string, reason?: string) => {
    setPrs(prev => prev.map(p => p.id === prId ? { ...p, status: 'Rejected' } : p));
  };


  // MAR Method: Automatic Multi-store availability audit
  const createMAR = (mrId: string, customItems?: MARItem[]): MaterialAvailabilityReport => {
    const targetMR = mrs.find(m => m.id === mrId);
    const repNum = `MAR-2026-${String(mars.length + 33).padStart(4, '0')}`;

    let computedItems: MARItem[] = [];
    if (customItems && customItems.length > 0) {
      computedItems = customItems;
    } else if (targetMR) {
      computedItems = targetMR.items.map((it, idx) => {
        // Look up stocks globally
        const allStoresStocks = stocks.filter(s => s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase()));
        const hoStore = allStoresStocks.find(s => s.storeName === 'Head Office Central Store');
        const otherAvail = allStoresStocks.reduce((sum, s) => s.storeName !== 'Head Office Central Store' ? sum + s.availableQty : sum, 0);

        const hoAvail = hoStore?.availableQty || 0;
        const totalAvail = hoAvail + otherAvail;
        const req = it.quantity;

        let action: MARItem['actionTaken'] = 'Reserve & Issue';
        let resQty = 0;
        let shortQty = 0;

        if (totalAvail >= req) {
          action = hoAvail >= req ? 'Transfer from Store' : 'Reserve & Issue';
          resQty = req;
          shortQty = 0;
        } else if (totalAvail > 0) {
          action = 'Issue Partial & Create PR';
          resQty = totalAvail;
          shortQty = req - totalAvail;
        } else {
          action = 'Create PR for Full Shortage';
          resQty = 0;
          shortQty = req;
        }

        return {
          slNo: idx + 1,
          itemId: it.itemId || `itm-temp-${idx}`,
          itemName: it.itemDescription,
          specification: it.specification,
          unit: it.unit,
          requiredQty: req,
          ashuliaQty: hoAvail,
          sreemangalQty: otherAvail,
          otherStoreQty: 0,
          totalAvailable: totalAvail,
          reservedQty: resQty,
          shortageQty: shortQty,
          actionTaken: action,
          remarks: shortQty > 0 ? `Shortage of ${shortQty} ${it.unit} will be routed to PR.` : `Stock available. Reserve & prepare MIV.`
        };
      });
    }

    const hasShortage = computedItems.some(i => i.shortageQty > 0);

    const newMAR: MaterialAvailabilityReport = {
      id: `mar-${Date.now()}`,
      reportNo: repNum,
      reportDate: new Date().toISOString().substring(0, 10),
      mrId: targetMR ? targetMR.id : mrId,
      mrNumber: targetMR ? targetMR.mrNumber : 'MR-REF',
      mrDate: targetMR ? targetMR.date : new Date().toISOString().substring(0, 10),
      projectId: targetMR ? targetMR.projectId : 'proj-1',
      projectName: targetMR ? targetMR.projectName : 'General Project',
      projectLocation: targetMR ? targetMR.location : 'Dhaka Yard',
      materialsDueDate: targetMR ? targetMR.dueDate : new Date().toISOString().substring(0, 10),
      items: computedItems,
      preparedBy: currentUser?.name || 'Md. Delwar Hossain (Store Officer)',
      designation: 'Central Store Controller',
      status: hasShortage ? 'Shortage Identified' : 'Completed',
      comments: hasShortage ? 'Multi-store availability audit completed. Shortage identified for commercial procurement.' : 'All requested materials available in central stores. Ready for issue.'
    };

    setMars(prev => [newMAR, ...prev]);
    if (targetMR) {
      setMrs(prev => prev.map(m => m.id === targetMR.id ? { ...m, marId: newMAR.id } : m));
    }

    addAuditLog({
      userName: currentUser?.name || 'Store Controller',
      userRole: activeRole,
      action: 'CREATE_MAR',
      documentType: 'Material Availability Report',
      documentCode: newMAR.reportNo,
      projectName: newMAR.projectName,
      details: `Material Availability Report ${newMAR.reportNo} generated for ${newMAR.mrNumber}.`
    });

    return newMAR;
  };

  const reserveStock = (marId: string, itemId: string, qty: number, storeName: string) => {
    setStocks(prev => prev.map(s => {
      if (s.storeName === storeName && (s.itemId === itemId || s.itemCode === itemId)) {
        const newAvail = Math.max(0, s.availableQty - qty);
        const newRes = s.reservedQty + qty;
        return { ...s, availableQty: newAvail, reservedQty: newRes, lastUpdated: new Date().toISOString().substring(0, 10) };
      }
      return s;
    }));

    addAuditLog({
      userName: currentUser?.name || 'Store Officer',
      userRole: activeRole,
      action: 'RESERVE_STOCK',
      documentType: 'Inventory Ledger',
      documentCode: `STORE-RES-${itemId}`,
      details: `Reserved ${qty} units of item ${itemId} in ${storeName} against ${marId}.`
    });
  };

  const createPRFromMAR = (marId: string): PurchaseRequisition => {
    const targetMAR = mars.find(m => m.id === marId);
    const prNum = `PR-2026-${String(prs.length + 20).padStart(4, '0')}`;

    const shortageItems = (targetMAR?.items || []).filter(i => i.shortageQty > 0).map((it, idx) => ({
      id: `pr-itm-${Date.now()}-${idx}`,
      itemId: it.itemId,
      itemDescription: it.itemName,
      specification: it.specification,
      unit: it.unit,
      quantity: it.shortageQty,
      shortageQty: it.shortageQty,
      classification: 'Raw Material' as const,
      estimatedUnitPrice: 1000,
      ledger: 'Procurement Shortage',
      remarks: `Automated shortage pull from ${targetMAR?.reportNo}`
    }));

    const newPR: PurchaseRequisition = {
      id: `pr-${Date.now()}`,
      prNumber: prNum,
      documentNo: 'TCCL/PUR/04/01',
      date: new Date().toISOString().substring(0, 10),
      dueDate: targetMAR?.materialsDueDate || new Date().toISOString().substring(0, 10),
      sourceMrId: targetMAR?.mrId,
      sourceMrNumber: targetMAR?.mrNumber,
      projectId: targetMAR?.projectId || 'proj-1',
      projectName: targetMAR?.projectName || 'Project Requisition',
      location: targetMAR?.projectLocation || 'Site Yard',
      department: 'Commercial & Procurement',
      purchaseType: 'Goods / Materials',
      items: shortageItems,
      initiatedBy: currentUser?.name || 'Procurement Lead',
      status: 'Pending Approval',
      createdAt: new Date().toISOString()
    };

    setPrs(prev => [newPR, ...prev]);

    // Create approval task for PR
    const newTask: ApprovalTask = {
      id: `app-pr-${Date.now()}`,
      documentType: 'Purchase Requisition',
      documentId: newPR.id,
      documentNumber: newPR.prNumber,
      projectId: newPR.projectId,
      projectName: newPR.projectName,
      requestedBy: newPR.initiatedBy,
      amount: newPR.items.reduce((s, i) => s + (i.quantity * (i.estimatedUnitPrice || 0)), 0),
      submittedDate: newPR.date,
      priority: 'High',
      requiredRole: 'Managing Director',
      status: 'Pending',
      approvalStage: 'Commercial Approval (Managing Director)',
      comments: `PR auto-generated for ${newPR.items.length} shortage items from ${targetMAR?.reportNo}.`
    };
    setApprovalTasks(prev => [newTask, ...prev]);

    addAuditLog({
      userName: currentUser?.name || 'Procurement Officer',
      userRole: activeRole,
      action: 'CREATE_PR_FROM_MAR',
      documentType: 'Purchase Requisition',
      documentCode: newPR.prNumber,
      projectName: newPR.projectName,
      details: `Purchase Requisition ${newPR.prNumber} generated automatically for MAR shortage.`
    });

    return newPR;
  };

  
  const approvePurchaseRequisition = (prId: string) => {
    setPrs(prev => prev.map(p => p.id === prId ? { ...p, status: 'Approved' } : p));
    setApprovalTasks(prev => prev.map(t => t.documentId === prId ? { ...t, status: 'Approved' } : t));

    addAuditLog({
      userName: currentUser?.name || 'Approver',
      userRole: activeRole,
      action: 'APPROVE_PR',
      documentType: 'Purchase Requisition',
      documentCode: prId,
      newStatus: 'Approved',
      details: 'Purchase Requisition approved. Ready for Comparative Statement.'
    });
  };

  const createComparativeStatement = (csData: Omit<ComparativeStatement, 'id' | 'csNumber'>): ComparativeStatement => {
    const csNum = `CS-2026-${String(csList.length + 10).padStart(4, '0')}`;
    const newCS: ComparativeStatement = {
      ...csData,
      id: `cs-${Date.now()}`,
      csNumber: csNum,
      status: 'Pending Approval'
    };

    setCsList(prev => [newCS, ...prev]);

    const bestQuote = newCS.quotations.reduce((min, q) => q.grandTotal < min.grandTotal ? q : min, newCS.quotations[0]);
    const newTask: ApprovalTask = {
      id: `app-cs-${Date.now()}`,
      documentType: 'Comparative Statement',
      documentId: newCS.id,
      documentNumber: newCS.csNumber,
      projectId: newCS.projectId,
      projectName: newCS.projectName,
      requestedBy: newCS.preparedBy,
      amount: bestQuote?.grandTotal || 0,
      submittedDate: newCS.date,
      priority: 'High',
      requiredRole: 'Managing Director',
      status: 'Pending',
      approvalStage: 'Vendor Selection & Rate Endorsement',
      comments: `CS comparing ${newCS.quotations.length} vendors for ${newCS.quotations[0]?.items?.length || 0} items.`
    };
    setApprovalTasks(prev => [newTask, ...prev]);

    addAuditLog({
      userName: currentUser?.name || newCS.preparedBy,
      userRole: activeRole,
      action: 'CREATE_COMPARATIVE_STATEMENT',
      documentType: 'Comparative Statement',
      documentCode: newCS.csNumber,
      projectName: newCS.projectName,
      details: `Comparative Statement ${newCS.csNumber} prepared and submitted for approval.`
    });

    return newCS;
  };

  const approveComparativeStatement = (csId: string) => {
    setCsList(prev => prev.map(c => c.id === csId ? { ...c, status: 'Approved', approvedBy: currentUser?.name } : c));
    setApprovalTasks(prev => prev.map(t => t.documentId === csId ? { ...t, status: 'Approved' } : t));

    addAuditLog({
      userName: currentUser?.name || 'Approver',
      userRole: activeRole,
      action: 'APPROVE_CS',
      documentType: 'Comparative Statement',
      documentCode: csId,
      newStatus: 'Approved',
      details: 'Comparative Statement approved. Purchase Order can now be issued.'
    });
  };

  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'docNo'>): PurchaseOrder => {
    const poNum = `PO-2026-${String(pos.length + 13).padStart(4, '0')}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`,
      poNumber: poNum,
      docNo: 'PUR/3/2',
      status: poData.status || 'Pending Approval'
    };

    setPos(prev => [newPO, ...prev]);

    // If PO was created in Approved or Issued status, generate pending project GRN immediately
    if (newPO.status === 'Approved' || (newPO.status as any) === 'Issued') {
      const receivingStoreName = newPO.deliveryLocation || `${newPO.projectName} Site Store`;
      const mappedItems = newPO.items.map((it: any, idx: number) => {
        const qty = Number(it.qty || it.quantity || it.orderedQty || 0);
        return {
          slNo: it.slNo || (idx + 1),
          itemId: it.itemId || `itm-${Date.now()}-${idx + 1}`,
          itemCode: it.itemCode || `MAT-${(it.itemDescription || 'MAT').substring(0, 3).toUpperCase()}-00${idx + 1}`,
          itemDescription: it.itemDescription,
          specification: it.specification || 'Standard Specification',
          unit: it.unit || 'Nos',
          orderedQty: qty,
          receivedQty: qty,
          acceptedQty: qty,
          rejectedQty: 0,
          damagedQty: 0,
          inspectionResult: 'Passed' as const,
          isAsset: (it.itemDescription || '').toLowerCase().includes('equipment') || (it.itemDescription || '').toLowerCase().includes('machine') || (it.itemDescription || '').toLowerCase().includes('vehicle'),
          remarks: 'Awaiting site delivery challan upload & quality verification'
        };
      });

      setGrns(currentGrns => {
        const existing = currentGrns.find(g => g.poId === newPO.id || g.poNumber === newPO.poNumber);
        if (existing) return currentGrns;
        const grnNum = `GRN-2026-${String(currentGrns.length + 25).padStart(4, "0")}`;
        const newGRN: GoodsReceivedNote = {
          id: `grn-${Date.now()}`,
          grnNumber: grnNum,
          date: new Date().toISOString().substring(0, 10),
          poId: newPO.id,
          poNumber: newPO.poNumber,
          vendorName: newPO.vendorName,
          supplierChallanNo: 'Awaiting Delivery Challan',
          vehicleNo: 'Pending',
          driverName: 'Pending',
          driverPhone: '',
          receivingStore: receivingStoreName,
          projectId: newPO.projectId,
          projectName: newPO.projectName,
          items: mappedItems,
          inspectedBy: 'Pending Inspection',
          storeOfficer: currentUser?.name || 'Site Store Controller',
          status: 'Pending'
        };
        return [newGRN, ...currentGrns];
      });
    } else {
      const newTask: ApprovalTask = {
        id: `app-po-${Date.now()}`,
        documentType: 'Purchase Order',
        documentId: newPO.id,
        documentNumber: newPO.poNumber,
        projectId: newPO.projectId,
        projectName: newPO.projectName,
        requestedBy: newPO.preparedBy,
        amount: newPO.grandTotal,
        submittedDate: newPO.date,
        priority: 'High',
        requiredRole: 'Managing Director',
        status: 'Pending',
        approvalStage: 'Executive Authorization Signatory',
        comments: `PO for BDT ${(newPO.grandTotal || 0).toLocaleString()} to ${newPO.vendorName}.`
      };
      setApprovalTasks(prev => [newTask, ...prev]);
    }

    addAuditLog({
      userName: currentUser?.name || newPO.preparedBy,
      userRole: activeRole,
      action: 'CREATE_PURCHASE_ORDER',
      documentType: 'Purchase Order',
      documentCode: newPO.poNumber,
      projectName: newPO.projectName,
      details: `Purchase Order ${newPO.poNumber} created for ${newPO.vendorName}.`
    });

    return newPO;
  };

  const approvePurchaseOrder = (poId: string) => {
    setPos(prev => prev.map(p => p.id === poId ? { ...p, status: 'Approved', authorizedSignatory: currentUser?.name || 'Managing Director' } : p));
    setApprovalTasks(prev => prev.map(t => t.documentId === poId ? { ...t, status: 'Approved' } : t));

    const po = pos.find(p => p.id === poId);
    if (po) {
      const receivingStoreName = po.deliveryLocation || `${po.projectName} Site Store`;
      const mappedItems = po.items.map((it: any, idx: number) => {
        const qty = Number(it.qty || it.quantity || it.orderedQty || 0);
        return {
          slNo: it.slNo || (idx + 1),
          itemId: it.itemId || `itm-${Date.now()}-${idx + 1}`,
          itemCode: it.itemCode || `MAT-${(it.itemDescription || 'MAT').substring(0, 3).toUpperCase()}-00${idx + 1}`,
          itemDescription: it.itemDescription,
          specification: it.specification || 'Standard Specification',
          unit: it.unit || 'Nos',
          orderedQty: qty,
          receivedQty: qty,
          acceptedQty: qty,
          rejectedQty: 0,
          damagedQty: 0,
          inspectionResult: 'Passed' as const,
          isAsset: (it.itemDescription || '').toLowerCase().includes('equipment') || (it.itemDescription || '').toLowerCase().includes('machine') || (it.itemDescription || '').toLowerCase().includes('vehicle'),
          remarks: 'Awaiting site delivery challan upload & quality verification'
        };
      });

      // Automatically generate the Project GRN in PENDING status
      setGrns(currentGrns => {
        const existing = currentGrns.find(g => g.poId === po.id || g.poNumber === po.poNumber);
        if (existing) return currentGrns;

        const grnNum = `GRN-2026-${String(currentGrns.length + 25).padStart(4, "0")}`;
        const newGRN: GoodsReceivedNote = {
          id: `grn-${Date.now()}`,
          grnNumber: grnNum,
          date: new Date().toISOString().substring(0, 10),
          poId: po.id,
          poNumber: po.poNumber,
          vendorName: po.vendorName,
          supplierChallanNo: 'Awaiting Delivery Challan',
          vehicleNo: 'Pending',
          driverName: 'Pending',
          driverPhone: '',
          receivingStore: receivingStoreName,
          projectId: po.projectId,
          projectName: po.projectName,
          items: mappedItems,
          inspectedBy: 'Pending Inspection',
          storeOfficer: currentUser?.name || 'Site Store Controller',
          status: 'Pending'
        };
        return [newGRN, ...currentGrns];
      });
      // NOTE: Do NOT post to inventory here! Inventory will be credited only after challan upload and approval ("Okay").
    }

    addAuditLog({
      userName: currentUser?.name || 'Managing Director',
      userRole: activeRole,
      action: 'APPROVE_PURCHASE_ORDER',
      documentType: 'Purchase Order',
      documentCode: poId,
      newStatus: 'Approved',
      details: 'Purchase Order approved and issued. Site GRN generated in Pending status awaiting delivery challan & inspection.'
    });
  };

  
  const issueMARToGRN = (marId: string): GoodsReceivedNote | null => {
    const mar = mars.find(m => m.id === marId);
    if (!mar) return null;

    const issueItems = mar.items.filter(i => (i.reservedQty && i.reservedQty > 0) || i.actionTaken === 'Reserve & Issue' || i.actionTaken === 'Transfer from Store' || i.actionTaken === 'Issue Partial & Create PR');
    if (issueItems.length === 0) return null;

    const siteStoreName = `${mar.projectName} Site Store`;
    // Create GRN
    const grnData = {
      date: new Date().toISOString().substring(0, 10),
      poId: mar.id,
      poNumber: `Internal Issue (${mar.mrNumber})`,
      vendorName: 'Central Store (Internal Transfer)',
      supplierChallanNo: `CH-MAR-${mar.reportNo}`,
      vehicleNo: 'Dhaka Metro-TA-11-9042',
      driverName: 'Abdul Karim',
      driverPhone: '+880 1712-334455',
      receivingStore: siteStoreName,
      projectId: mar.projectId || 'proj-1',
      projectName: mar.projectName || 'General Project',
      items: issueItems.map((it, idx) => ({
        slNo: idx + 1,
        itemId: it.itemId,
        itemCode: `MAT-${it.itemName.substring(0, 3).toUpperCase()}-00${idx+1}`,
        itemDescription: it.itemName,
        specification: it.specification || '',
        unit: it.unit || 'Nos',
        orderedQty: it.reservedQty || it.requiredQty,
        receivedQty: it.reservedQty || it.requiredQty,
        acceptedQty: 0,
        rejectedQty: 0,
        damagedQty: 0,
        inspectionResult: 'Passed' as const,
        remarks: 'Issued from Central Store via MAR. Ready for Challan Upload & Site Inspection.'
      })),
      inspectedBy: 'Site Quality Engineer',
      storeOfficer: currentUser?.name || 'Site Store Officer',
    };

    const grnNum = `GRN-2026-${String(grns.length + 30).padStart(4, '0')}`;
    const newGRN: GoodsReceivedNote = {
      ...(grnData as any),
      id: `grn-${Date.now()}`,
      grnNumber: grnNum,
      status: 'Draft'
    };

    setGrns(prev => [newGRN, ...prev]);

    // Create approval task for Site GRN
    const newGRNTask: ApprovalTask = {
      id: `task-grn-${Date.now()}`,
      documentType: 'Goods Received Note',
      documentNumber: newGRN.grnNumber,
      documentId: newGRN.id,
      projectId: mar.projectId || 'proj-1',
      projectName: mar.projectName,
      requestedBy: 'Central Store Controller',
      submittedDate: new Date().toISOString().substring(0, 10),
      status: 'Pending',
      priority: 'High',
      amount: issueItems.reduce((sum, it) => sum + ((it.reservedQty || it.requiredQty) * 500), 0),
      requiredRole: 'Project Manager',
      approvalStage: 'Site Material Receipt & Challan Inspection'
    };
    setApprovalTasks(prev => [newGRNTask, ...prev]);

    // Deduct stock from central stores
    setStocks(prev => {
      let updated = [...prev];
      issueItems.forEach(it => {
        const qtyToIssue = it.reservedQty || it.requiredQty;
        if (qtyToIssue <= 0) return;
        
        let remaining = qtyToIssue;
        for (let i = 0; i < updated.length && remaining > 0; i++) {
          if (
            (updated[i].storeName.includes('Central Store') || updated[i].storeName.includes('Ashulia') || updated[i].storeName.includes('Head Office') || updated[i].storeName.includes('Regional Store')) &&
            (updated[i].itemId === it.itemId || updated[i].itemName.toLowerCase().includes(it.itemName.toLowerCase()))
          ) {
            const deduct = Math.min(updated[i].availableQty, remaining);
            updated[i] = {
              ...updated[i],
              availableQty: Math.max(0, updated[i].availableQty - deduct),
              reservedQty: (updated[i].reservedQty || 0) + deduct,
              lastUpdated: new Date().toISOString().substring(0, 10)
            };
            remaining -= deduct;
          }
        }
      });
      return updated;
    });

    // Mark MAR as Issued
    setMars(prev => prev.map(m => m.id === mar.id ? { ...m, status: 'Issued to GRN' } : m));

    addAuditLog({
      userName: currentUser?.name || 'System',
      userRole: activeRole,
      action: 'ISSUE_MAR_TO_GRN',
      documentType: 'Material Availability Report',
      documentCode: mar.reportNo,
      projectName: mar.projectName,
      details: `Reserved items from MAR ${mar.reportNo} issued automatically to GRN ${newGRN.grnNumber} for ${mar.projectName}.`
    });

    return newGRN;
  };

  const createGRN = (grnData: Omit<GoodsReceivedNote, 'id' | 'grnNumber'>): GoodsReceivedNote => {
    const grnNum = `GRN-2026-${String(grns.length + 25).padStart(4, '0')}`;
    const newGRN: GoodsReceivedNote = {
      ...grnData,
      id: `grn-${Date.now()}`,
      grnNumber: grnNum,
      status: grnData.status || 'Draft'
    };

    setGrns(prev => [newGRN, ...prev]);

    addAuditLog({
      userName: currentUser?.name || newGRN.inspectedBy,
      userRole: activeRole,
      action: 'CREATE_GRN',
      documentType: 'Goods Received Note',
      documentCode: newGRN.grnNumber,
      projectName: newGRN.projectName,
      details: `GRN ${newGRN.grnNumber} created for ${newGRN.poNumber}.`
    });

    return newGRN;
  };

  const postGRN = (grnId: string, options?: any) => {
    const targetGRN = grns.find(g => g.id === grnId);
    if (!targetGRN) return;

    // Auto-fill received/accepted quantities and inspect line items
    const updatedItems = targetGRN.items.map(it => {
      const match = options?.inspectedItems?.find((oi: any) => oi.itemId === it.itemId);
      const qtyToAccept = match !== undefined && match.acceptedQty !== undefined 
        ? Number(match.acceptedQty)
        : (it.acceptedQty > 0 ? it.acceptedQty : (it.orderedQty || (it as any).quantity || 0));
      const qtyToReject = match !== undefined && match.rejectedQty !== undefined 
        ? Number(match.rejectedQty)
        : (it.rejectedQty || 0);

      return {
        ...it,
        receivedQty: it.receivedQty > 0 ? it.receivedQty : (qtyToAccept + qtyToReject),
        acceptedQty: qtyToAccept,
        rejectedQty: qtyToReject,
        inspectionResult: (qtyToReject > 0 && qtyToAccept === 0 ? 'Failed' : (qtyToReject > 0 ? 'Partial' : 'Passed')) as any,
        remarks: match?.remarks || it.remarks || options?.remarks || 'Physical inspection completed & accepted.'
      };
    });

    const storeName = targetGRN.receivingStore || `${targetGRN.projectName} Site Store`;

    // Increment Store Stock for this project
    setStocks(prev => {
      let nextStocks = [...prev];
      updatedItems.forEach(it => {
        if (it.acceptedQty > 0) {
          const existing = nextStocks.find(s => 
            (s.projectId === targetGRN.projectId || s.storeName.toLowerCase() === storeName.toLowerCase()) && 
            (s.itemId === it.itemId || s.itemName.toLowerCase() === it.itemDescription.toLowerCase())
          );
          if (existing) {
            nextStocks = nextStocks.map(s => s === existing ? {
              ...s,
              projectId: targetGRN.projectId || s.projectId,
              storeName: s.storeName || storeName,
              availableQty: (s.availableQty || 0) + it.acceptedQty,
              lastUpdated: options?.receivedDate || new Date().toISOString().substring(0, 10)
            } : s);
          } else {
            nextStocks.push({
              itemId: it.itemId || `itm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              itemCode: it.itemCode || `MAT-${it.itemDescription.substring(0, 3).toUpperCase()}-NEW`,
              itemName: it.itemDescription,
              unit: it.unit || 'Nos',
              storeName: storeName,
              projectId: targetGRN.projectId,
              availableQty: it.acceptedQty,
              reservedQty: 0,
              inTransitQty: 0,
              binCardNumber: `BIN-${Date.now().toString().slice(-4)}`,
              lastUpdated: options?.receivedDate || new Date().toISOString().substring(0, 10)
            });
          }
        }
      });
      return nextStocks;
    });

    // Update GRN status, challan details, vehicle, dates
    setGrns(prev => prev.map(g => g.id === grnId ? {
      ...g,
      items: updatedItems,
      status: 'Inspected & Posted',
      date: options?.receivedDate || g.date,
      supplierChallanNo: options?.challanNo || options?.challanFileName || g.supplierChallanNo,
      vehicleNo: options?.vehicleNo || g.vehicleNo,
      driverName: options?.driverName || g.driverName,
      driverPhone: options?.driverPhone || g.driverPhone,
      inspectedBy: currentUser?.name || g.inspectedBy
    } : g));

    // Update any linked approval task to Approved
    setApprovalTasks(prev => prev.map(t => t.documentId === grnId ? {
      ...t,
      status: 'Approved',
      comments: `Challan accepted & material inspected: ${options?.challanNo || options?.challanFileName || 'Delivery Challan Verified'}`
    } : t));

    addAuditLog({
      userName: currentUser?.name || 'Site Store Officer',
      userRole: activeRole,
      action: 'POST_GRN_RECEIPT',
      documentType: 'Goods Received Note',
      documentCode: targetGRN.grnNumber,
      projectName: targetGRN.projectName,
      previousStatus: targetGRN.status,
      newStatus: 'Inspected & Posted',
      details: `GRN ${targetGRN.grnNumber} challan accepted and materials physically inspected. Stock credited to ${storeName}.`
    });
  };

  const receiveChallanForPO = (poId: string, options?: any) => {
    const po = pos.find(p => p.id === poId);
    if (!po) return;

    let targetGRN = grns.find(g => g.poId === po.id || g.poNumber === po.poNumber);
    let grnIdToPost = targetGRN?.id;

    if (!targetGRN) {
      const receivingStoreName = po.deliveryLocation || `${po.projectName} Site Store`;
      const mappedItems = po.items.map((it: any, idx: number) => {
        const qty = Number(it.qty || it.quantity || it.orderedQty || 0);
        return {
          slNo: it.slNo || (idx + 1),
          itemId: it.itemId || `itm-${Date.now()}-${idx + 1}`,
          itemCode: it.itemCode || `MAT-${(it.itemDescription || 'MAT').substring(0, 3).toUpperCase()}-00${idx + 1}`,
          itemDescription: it.itemDescription,
          specification: it.specification || 'Standard Construction Material',
          unit: it.unit || 'Nos',
          orderedQty: qty,
          receivedQty: qty,
          acceptedQty: qty,
          rejectedQty: 0,
          damagedQty: 0,
          inspectionResult: 'Passed' as const,
          remarks: 'Material delivery verified against PO'
        };
      });

      const grnNum = `GRN-2026-${String(grns.length + 25).padStart(4, '0')}`;
      const newGRN: GoodsReceivedNote = {
        id: `grn-${Date.now()}`,
        grnNumber: grnNum,
        date: options?.receivedDate || new Date().toISOString().substring(0, 10),
        poId: po.id,
        poNumber: po.poNumber,
        vendorName: po.vendorName,
        supplierChallanNo: options?.challanNo || options?.challanFileName || 'Delivery Challan Verified',
        vehicleNo: options?.vehicleNo || 'N/A',
        driverName: options?.driverName || 'N/A',
        driverPhone: options?.driverPhone || '',
        receivingStore: receivingStoreName,
        projectId: po.projectId,
        projectName: po.projectName,
        items: mappedItems,
        inspectedBy: options?.inspectorName || currentUser?.name || 'Site Quality Engineer',
        storeOfficer: currentUser?.name || 'Site Store Controller',
        status: 'Pending'
      };

      setGrns(prev => [newGRN, ...prev]);
      grnIdToPost = newGRN.id;

      // Post this newly created GRN immediately
      setTimeout(() => {
        postGRN(newGRN.id, options);
      }, 50);
      return;
    }

    // Existing GRN found, post directly
    postGRN(grnIdToPost!, options);
  };

  const createMIV = (mivData: Omit<MaterialIssueVoucher, 'id' | 'mivNumber'>): MaterialIssueVoucher => {
    const mivNum = `MIV-2026-${String(mivs.length + 39).padStart(4, '0')}`;
    const newMIV: MaterialIssueVoucher = {
      ...mivData,
      id: `miv-${Date.now()}`,
      mivNumber: mivNum,
      status: 'Approved'
    };

    // Deduct stock from reserved
    mivData.items.forEach(it => {
      setStocks(prev => prev.map(s => {
        if (s.storeName === mivData.fromStore && s.itemName.toLowerCase().includes(it.itemName.toLowerCase())) {
          const newRes = Math.max(0, s.reservedQty - it.qty);
          return { ...s, reservedQty: newRes, lastUpdated: new Date().toISOString().substring(0, 10) };
        }
        return s;
      }));
    });

    setMivs(prev => [newMIV, ...prev]);

    addAuditLog({
      userName: currentUser?.name || newMIV.preparedBy,
      userRole: activeRole,
      action: 'CREATE_MIV',
      documentType: 'Material Issue Voucher',
      documentCode: newMIV.mivNumber,
      projectName: newMIV.projectName,
      details: `MIV ${newMIV.mivNumber} issued to ${newMIV.receiverName}. Reserved stock deducted.`
    });

    return newMIV;
  };

  const createMTV = (mtvData: Omit<MaterialTransferVoucher, 'id' | 'mtvNumber'>): MaterialTransferVoucher => {
    const mtvNum = `MTV-2026-${String(mtvs.length + 16).padStart(4, '0')}`;
    const fromLoc = mtvData.fromOfficeOrSite || mtvData.fromStore;
    const toLoc = mtvData.toOfficeOrSite || mtvData.toStore;

    const newMTV: MaterialTransferVoucher = {
      ...mtvData,
      id: `mtv-${Date.now()}`,
      mtvNumber: mtvNum,
      fromOfficeOrSite: fromLoc,
      toOfficeOrSite: toLoc,
      status: 'Dispatched (In Transit)'
    };

    // If transfer involves fixed assets, update the asset record & transfer history
    if (mtvData.transferCategory === 'Fixed Asset' || mtvData.items.some(i => i.isAsset || i.assetId)) {
      mtvData.items.forEach(it => {
        setAssets(prev => prev.map(a => {
          const matches = (it.assetId && a.id === it.assetId) ||
                          (it.assetCode && a.assetCode === it.assetCode) ||
                          (it.itemName && it.itemName.includes(a.assetCode));
          if (matches) {
            const transferEntry = {
              id: `th-${Date.now()}-${a.id}`,
              transferDate: mtvData.date,
              transferType: (mtvData.transferType as any) || 'Site to Site',
              fromLocation: fromLoc,
              toLocation: toLoc,
              fromProjectId: a.projectId,
              toProjectId: mtvData.destinationProjectId || mtvData.projectId,
              toProjectName: mtvData.projectName,
              mtvNumber: mtvNum,
              custodianName: mtvData.receiverName
            };
            return {
              ...a,
              projectId: mtvData.destinationProjectId || mtvData.projectId || a.projectId,
              projectName: mtvData.projectName || a.projectName,
              currentLocation: toLoc,
              custodianName: mtvData.receiverName || a.custodianName,
              custodianPhone: mtvData.receiverPhone || a.custodianPhone,
              status: 'In-Transit',
              transferHistory: [transferEntry, ...(a.transferHistory || [])]
            };
          }
          return a;
        }));
      });
    }

    // Deduct from source store and mark inTransit for physical materials
    mtvData.items.forEach(it => {
      if (!it.isAsset) {
        setStocks(prev => prev.map(s => {
          if ((s.storeName === fromLoc || s.storeName.toLowerCase().includes(fromLoc.toLowerCase())) &&
              s.itemName.toLowerCase().includes(it.itemName.toLowerCase())) {
            return {
              ...s,
              availableQty: Math.max(0, s.availableQty - it.qty),
              inTransitQty: s.inTransitQty + it.qty,
              lastUpdated: new Date().toISOString().substring(0, 10)
            };
          }
          return s;
        }));
      }
    });

    setMtvs(prev => [newMTV, ...prev]);

    // Create approval/receiving task
    const newTask: ApprovalTask = {
      id: `app-mtv-${Date.now()}`,
      documentType: 'MTV',
      documentId: newMTV.id,
      documentNumber: newMTV.mtvNumber,
      projectId: newMTV.projectId || newMTV.destinationProjectId || 'proj-1',
      projectName: newMTV.projectName,
      requestedBy: newMTV.preparedBy,
      submittedDate: newMTV.date,
      priority: 'Normal',
      requiredRole: 'Store Officer',
      status: 'Pending',
      approvalStage: 'Destination Receiving Confirmation',
      comments: `${newMTV.transferType || 'Transfer'} from ${fromLoc} to ${toLoc}. Vehicle: ${newMTV.vehicleNo || 'N/A'}`
    };
    setApprovalTasks(prev => [newTask, ...prev]);

    addAuditLog({
      userName: currentUser?.name || newMTV.preparedBy,
      userRole: activeRole,
      action: 'CREATE_MTV',
      documentType: 'Material Transfer Voucher',
      documentCode: newMTV.mtvNumber,
      projectName: newMTV.projectName,
      details: `MTV ${newMTV.mtvNumber} (${newMTV.transferType || 'Transfer'}) dispatched from ${fromLoc} to ${toLoc}. Items: ${newMTV.items.map(i => i.itemName).join(', ')}.`
    });

    return newMTV;
  };

  const confirmMTVReceipt = (mtvId: string) => {
    const targetMTV = mtvs.find(m => m.id === mtvId);
    if (!targetMTV) return;

    const toLoc = targetMTV.toOfficeOrSite || targetMTV.toStore;
    const fromLoc = targetMTV.fromOfficeOrSite || targetMTV.fromStore;

    // Move from inTransit to destination store available for materials and update assets
    targetMTV.items.forEach(it => {
      if (it.isAsset || it.assetId) {
        setAssets(prev => prev.map(a => {
          const matches = (it.assetId && a.id === it.assetId) ||
                          (it.assetCode && a.assetCode === it.assetCode) ||
                          (it.itemName && it.itemName.includes(a.assetCode));
          if (matches) {
            return {
              ...a,
              status: 'Site-Deployed'
            };
          }
          return a;
        }));
      } else {
        setStocks(prev => {
          let updated = prev.map(s => {
            if ((s.storeName === fromLoc || s.storeName.toLowerCase().includes(fromLoc.toLowerCase())) &&
                s.itemName.toLowerCase().includes(it.itemName.toLowerCase())) {
              return { ...s, inTransitQty: Math.max(0, s.inTransitQty - it.qty) };
            }
            return s;
          });

          const destItem = updated.find(s =>
            (s.storeName === toLoc || s.storeName.toLowerCase().includes(toLoc.toLowerCase())) &&
            s.itemName.toLowerCase().includes(it.itemName.toLowerCase())
          );
          if (destItem) {
            updated = updated.map(s => s === destItem ? { ...s, availableQty: s.availableQty + it.qty, projectId: targetMTV.destinationProjectId || targetMTV.projectId || s.projectId } : s);
          } else {
            updated.push({
              itemId: `itm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              itemCode: `MAT-TRANS-${Date.now().toString().slice(-4)}`,
              itemName: it.itemName,
              unit: it.unit,
              storeName: toLoc as any,
              projectId: targetMTV.destinationProjectId || targetMTV.projectId,
              availableQty: it.qty,
              reservedQty: 0,
              inTransitQty: 0,
              binCardNumber: `BIN-${Date.now().toString().slice(-4)}`,
              lastUpdated: new Date().toISOString().substring(0, 10)
            });
          }
          return updated;
        });
      }
    });

    setMtvs(prev => prev.map(m => m.id === mtvId ? { ...m, status: 'Received', receivedBy: currentUser?.name || targetMTV.receiverName } : m));
    setApprovalTasks(prev => prev.map(t => t.documentId === mtvId ? { ...t, status: 'Approved' } : t));

    addAuditLog({
      userName: currentUser?.name || 'Receiver',
      userRole: activeRole,
      action: 'CONFIRM_MTV_RECEIPT',
      documentType: 'Material Transfer Voucher',
      documentCode: targetMTV.mtvNumber,
      projectName: targetMTV.projectName,
      previousStatus: 'Dispatched (In Transit)',
      newStatus: 'Received',
      details: `Material Transfer Voucher ${targetMTV.mtvNumber} verified and received at ${toLoc}.`
    });
  };

  const createGatePass = (gpData: Omit<GatePass, 'id' | 'gatePassNo' | 'qrCodeValue'>): GatePass => {
    const gpNum = `GP-2026-${String(gatePasses.length + 95).padStart(4, '0')}`;
    const qrVal = `TCCL-GP:${gpNum}|TYPE:${gpData.passType}|VEH:${gpData.vehicleNo}|REF:${gpData.refDocument}|DATE:${gpData.date}|AUTH:${gpData.authorizedSignatory}`;
    
    const newGP: GatePass = {
      ...gpData,
      id: `gp-${Date.now()}`,
      gatePassNo: gpNum,
      qrCodeValue: qrVal,
      status: 'Issued'
    };

    setGatePasses(prev => [newGP, ...prev]);

    addAuditLog({
      userName: currentUser?.name || newGP.issuedBy,
      userRole: activeRole,
      action: 'ISSUE_GATE_PASS',
      documentType: 'Gate Pass / Challan',
      documentCode: newGP.gatePassNo,
      projectName: newGP.projectName,
      details: `Gate Pass ${newGP.gatePassNo} (${newGP.passType}) issued for vehicle ${newGP.vehicleNo}.`
    });

    return newGP;
  };

  const verifyGatePass = (gpId: string, guardName: string) => {
    setGatePasses(prev => prev.map(g => g.id === gpId ? {
      ...g,
      status: 'Security Verified',
      securityChecked: true,
      securityGuardName: guardName,
      gateCheckInTime: new Date().toLocaleString()
    } : g));

    addAuditLog({
      userName: guardName,
      userRole: 'Gate Security Inspector',
      action: 'VERIFY_GATE_PASS_QR',
      documentType: 'Gate Pass',
      documentCode: gpId,
      newStatus: 'Security Verified',
      details: `Security QR scan verified at Main Gate by Officer ${guardName}. Clearance granted.`
    });
  };

  const verifyGatePassSecurity = (gpId: string, guardName: string = 'Security Officer') => {
    verifyGatePass(gpId, guardName);
  };

  const markGatePassReturned = (gpId: string) => {
    setGatePasses(prev => prev.map(g => g.id === gpId ? {
      ...g,
      status: 'Returned'
    } : g));

    addAuditLog({
      userName: currentUser?.name || 'Gate Officer',
      userRole: 'Gate Security Inspector',
      action: 'RETURN_GATE_PASS',
      documentType: 'Gate Pass',
      documentCode: gpId,
      newStatus: 'Returned',
      details: `Returnable Gate Pass ${gpId} marked Returned.`
    });
  };

  const registerAsset = (assetData: Omit<FixedAsset, 'id' | 'assetCode' | 'qrCode' | 'currentNetBookValue'>): FixedAsset => {
    const assetNum = `TCCL-AST-${assetData.category.substring(0, 3).toUpperCase()}-${String(assets.length + 5).padStart(3, '0')}`;
    const qrVal = `TCCL-FAMS:${assetNum}|${assetData.name}|SN:${assetData.serialChassisNo}|COST:${assetData.purchaseCost}`;
    
    const newAsset: FixedAsset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      assetCode: assetNum,
      qrCode: qrVal,
      status: assetData.status || 'Active / Deployed',
      currentLocation: (assetData.currentLocation && assetData.currentLocation.trim()) ? assetData.currentLocation.trim() : 'Main Fleet Yard',
      buyingDate: assetData.buyingDate || assetData.capitalizationDate || new Date().toISOString().substring(0, 10),
      residualValue: (assetData as any).salvageValue ?? assetData.residualValue ?? (assetData.purchaseCost * 0.1),
      currentNetBookValue: assetData.purchaseCost,
      transferHistory: []
    };

    setAssets(prev => [newAsset, ...prev]);

    addAuditLog({
      userName: currentUser?.name || 'FAMS Officer',
      userRole: activeRole,
      action: 'REGISTER_FIXED_ASSET',
      documentType: 'Fixed Asset Record',
      documentCode: newAsset.assetCode,
      projectName: newAsset.projectName,
      details: `Asset ${newAsset.name} (${newAsset.assetCode}) capitalized in FAMS with value BDT ${(newAsset.purchaseCost || 0).toLocaleString()}. Buying Date: ${newAsset.buyingDate}.`
    });

    return newAsset;
  };

  const createAsset = registerAsset;

  const reallocateAsset = (
    assetId: string,
    toProjectId: string,
    toProjectName: string,
    toLocation: string,
    custodianName: string,
    custodianPhone: string,
    transferType: 'Site to Site' | 'Office to Site' | 'Site to Office' = 'Site to Site',
    fromLocation?: string
  ) => {
    const targetAsset = assets.find(a => a.id === assetId);
    if (!targetAsset) return;

    const actualFrom = fromLocation || targetAsset.currentLocation || 'Head Office Central Yard';
    const mtvNum = `MTV-2026-${String(mtvs.length + 16).padStart(4, '0')}`;

    const transferEntry = {
      id: `th-${Date.now()}`,
      transferDate: new Date().toISOString().substring(0, 10),
      transferType,
      fromLocation: actualFrom,
      toLocation,
      fromProjectId: targetAsset.projectId,
      toProjectId,
      toProjectName,
      mtvNumber: mtvNum,
      custodianName
    };

    setAssets(prev => prev.map(a => a.id === assetId ? {
      ...a,
      projectId: toProjectId,
      projectName: toProjectName,
      currentLocation: toLocation,
      custodianName,
      custodianPhone,
      status: 'In-Transit',
      transferHistory: [transferEntry, ...(a.transferHistory || [])]
    } : a));

    // Automatically create MTV record so it is listed in Material Transfers!
    const newMTV: MaterialTransferVoucher = {
      id: `mtv-${Date.now()}`,
      mtvNumber: mtvNum,
      date: new Date().toISOString().substring(0, 10),
      projectId: toProjectId,
      projectName: toProjectName,
      sourceProjectId: targetAsset.projectId,
      destinationProjectId: toProjectId,
      transferType,
      transferCategory: 'Fixed Asset',
      fromOfficeOrSite: actualFrom,
      toOfficeOrSite: toLocation,
      fromStore: actualFrom,
      toStore: toLocation,
      receiverName: custodianName,
      receiverPhone: custodianPhone,
      items: [
        {
          slNo: 1,
          assetId: targetAsset.id,
          assetCode: targetAsset.assetCode,
          itemName: `${targetAsset.name} [${targetAsset.assetCode}]`,
          specification: `${targetAsset.makeModel} | S/N: ${targetAsset.serialChassisNo}`,
          unit: 'Unit',
          qty: 1,
          isAsset: true,
          remarks: `${transferType} from ${actualFrom} to ${toLocation}`
        }
      ],
      notesComments: `Fixed Asset Reallocation (${transferType}). Custodian: ${custodianName}.`,
      preparedBy: currentUser?.name || 'FAMS Logistics Officer',
      status: 'Dispatched (In Transit)'
    };

    setMtvs(prev => [newMTV, ...prev]);

    // Create approval/receiving task for the destination site
    setApprovalTasks(prev => [{
      id: `app-mtv-${Date.now()}`,
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
      comments: `${newMTV.transferType} from ${actualFrom} to ${toLocation}.`
    }, ...prev]);

    addAuditLog({
      userName: currentUser?.name || 'FAMS Logistics Officer',
      userRole: activeRole,
      action: 'TRANSFER_FIXED_ASSET',
      documentType: 'Material Transfer Voucher',
      documentCode: mtvNum,
      projectName: toProjectName,
      details: `Fixed Asset ${targetAsset.name} (${targetAsset.assetCode}) transferred [${transferType}] from ${actualFrom} to ${toLocation} (${toProjectName}).`
    });
  };

  const updateAsset = (assetId: string, updates: Partial<FixedAsset>) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const updated = { ...a, ...updates };
        if (updates.projectId && !updates.projectName) {
          const p = projects.find(proj => proj.id === updates.projectId);
          if (p) {
            updated.projectName = p.name;
            if (!updates.currentLocation) {
              updated.currentLocation = p.location;
            }
          }
        }
        return updated;
      }
      return a;
    }));

    const targetAsset = assets.find(a => a.id === assetId);
    if (targetAsset) {
      addAuditLog({
        userName: currentUser?.name || 'Project Site Officer',
        userRole: activeRole,
        action: 'UPDATE_FIXED_ASSET',
        documentType: 'Fixed Asset',
        documentCode: targetAsset.assetCode,
        projectName: updates.projectName || targetAsset.projectName,
        details: `Asset ${targetAsset.assetCode} (${targetAsset.name}) updated. Location: ${updates.currentLocation || targetAsset.currentLocation}. Status: ${updates.status || targetAsset.status}.`
      });
    }
  };

  const updateAssetStatus = (assetId: string, status: FixedAsset['status']) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status } : a));
    
    // audit log
    const targetAsset = assets.find(a => a.id === assetId);
    if (targetAsset) {
      addAuditLog({
        userName: currentUser?.name || 'System',
        userRole: activeRole,
        action: 'UPDATE_ASSET_STATUS',
        documentType: 'Fixed Asset',
        documentCode: targetAsset.assetCode,
        projectName: targetAsset.projectName,
        previousStatus: targetAsset.status,
        newStatus: status,
        details: `Asset ${targetAsset.assetCode} (${targetAsset.name}) marked as ${status}.`
      });
    }
  };

  const addAssetMaintenance = (assetId: string, maint: FixedAsset['maintenanceSchedule'][0]) => {
    setAssets(prev => prev.map(a => a.id === assetId ? {
      ...a,
      maintenanceSchedule: [maint, ...a.maintenanceSchedule]
    } : a));

    addAuditLog({
      userName: currentUser?.name || 'FAMS Officer',
      userRole: activeRole,
      action: 'LOG_ASSET_MAINTENANCE',
      documentType: 'Fixed Asset Record',
      documentCode: assetId,
      details: `Maintenance logged: ${maint.serviceType} (Cost: BDT ${(maint.cost || 0).toLocaleString()}).`
    });
  };

  const addMaintenanceLog = addAssetMaintenance;

  const requestAssetRelocation = (
    reqData: Omit<AssetRequisition, 'id' | 'requisitionNo' | 'status' | 'createdAt'>
  ): AssetRequisition => {
    const reqNum = `AR-2026-${String(assetRequisitions.length + 1).padStart(4, '0')}`;
    const newReq: AssetRequisition = {
      ...reqData,
      id: `ar-${Date.now()}`,
      requisitionNo: reqNum,
      status: 'Pending Approval',
      createdAt: new Date().toISOString()
    };

    setAssetRequisitions(prev => [newReq, ...prev]);

    // Create approval task for Central FAMS / Approvals
    const newTask: ApprovalTask = {
      id: `app-ar-${Date.now()}`,
      documentType: 'Asset Requisition',
      documentId: newReq.id,
      documentNumber: newReq.requisitionNo,
      projectId: newReq.targetProjectId,
      projectName: newReq.targetProjectName,
      requestedBy: newReq.requestedBy,
      submittedDate: newReq.date,
      priority: 'High',
      requiredRole: 'FAMS Officer',
      status: 'Pending',
      approvalStage: 'Central FAMS Authorization',
      comments: `Requisition for ${newReq.assetName} [${newReq.assetCode}] from ${newReq.sourceLocation} to ${newReq.targetProjectName}. Justification: ${newReq.justification}`
    };

    setApprovalTasks(prev => [newTask, ...prev]);

    addAuditLog({
      userName: currentUser?.name || newReq.requestedBy,
      userRole: activeRole,
      action: 'REQUEST_ASSET_RELOCATION',
      documentType: 'Asset Requisition',
      documentCode: newReq.requisitionNo,
      projectName: newReq.targetProjectName,
      details: `Asset requisition submitted for ${newReq.assetName} [${newReq.assetCode}]. Target Site: ${newReq.targetProjectName}. Required Date: ${newReq.requiredDate}.`
    });

    return newReq;
  };

  const approveAssetRequisition = (requisitionId: string, remarks?: string) => {
    const req = assetRequisitions.find(r => r.id === requisitionId || r.requisitionNo === requisitionId);
    if (!req) return;

    const targetAsset = assets.find(a => a.id === req.assetId || a.assetCode === req.assetCode);
    if (!targetAsset) return;

    const actualFrom = req.sourceLocation || targetAsset.currentLocation || 'Head Office Central Yard';
    const mtvNum = `MTV-2026-${String(mtvs.length + 16).padStart(4, '0')}`;
    const approvalDate = new Date().toISOString().substring(0, 10);
    const approverName = currentUser?.name || 'FAMS Officer';
    const isOffice = actualFrom.toLowerCase().includes('office') || actualFrom.toLowerCase().includes('yard') || actualFrom.toLowerCase().includes('fleet');
    const transferType = isOffice ? 'Office to Site' : 'Site to Site';

    // 1. Mark requisition as approved
    setAssetRequisitions(prev => prev.map(r => (r.id === req.id) ? {
      ...r,
      status: 'Approved',
      approvedBy: approverName,
      approvalDate,
      approvalRemarks: remarks || 'Approved by Central FAMS for site mobilization.',
      mtvNumber: mtvNum
    } : r));

    // 2. Relocate the asset - update projectId, projectName, currentLocation, custodianName, custodianPhone, status and transferHistory!
    const transferEntry = {
      id: `th-${Date.now()}`,
      transferDate: approvalDate,
      transferType: transferType as any,
      fromLocation: actualFrom,
      toLocation: req.targetLocation,
      fromProjectId: targetAsset.projectId,
      toProjectId: req.targetProjectId,
      toProjectName: req.targetProjectName,
      mtvNumber: mtvNum,
      custodianName: req.targetCustodianName
    };

    setAssets(prev => prev.map(a => (a.id === targetAsset.id) ? {
      ...a,
      projectId: req.targetProjectId,
      projectName: req.targetProjectName,
      currentLocation: req.targetLocation,
      custodianName: req.targetCustodianName,
      custodianPhone: req.targetCustodianPhone,
      status: 'Active / Deployed',
      transferHistory: [transferEntry, ...(a.transferHistory || [])]
    } : a));

    // 3. Create MTV for the dispatch
    const newMTV: MaterialTransferVoucher = {
      id: `mtv-${Date.now()}`,
      mtvNumber: mtvNum,
      date: approvalDate,
      projectId: req.targetProjectId,
      projectName: req.targetProjectName,
      sourceProjectId: targetAsset.projectId,
      destinationProjectId: req.targetProjectId,
      transferType,
      transferCategory: 'Fixed Asset',
      fromOfficeOrSite: actualFrom,
      toOfficeOrSite: req.targetLocation,
      fromStore: actualFrom,
      toStore: req.targetLocation,
      receiverName: req.targetCustodianName,
      receiverPhone: req.targetCustodianPhone,
      items: [
        {
          slNo: 1,
          assetId: targetAsset.id,
          assetCode: targetAsset.assetCode,
          itemName: `${targetAsset.name} [${targetAsset.assetCode}]`,
          specification: `${targetAsset.makeModel} | S/N: ${targetAsset.serialChassisNo}`,
          unit: 'Unit',
          qty: 1,
          isAsset: true,
          remarks: `Approved Requisition ${req.requisitionNo} - Relocated from ${actualFrom} to ${req.targetLocation}`
        }
      ],
      notesComments: `Approved Asset Requisition ${req.requisitionNo}. Purpose: ${req.justification}. Remarks: ${remarks || 'Approved by Central FAMS'}`,
      preparedBy: approverName,
      status: 'Dispatched (In Transit)'
    };

    setMtvs(prev => [newMTV, ...prev]);

    // 4. Update ApprovalTasks
    setApprovalTasks(prev => prev.map(t => 
      (t.documentId === req.id || t.documentNumber === req.requisitionNo)
        ? { ...t, status: 'Approved', comments: remarks || 'Approved by FAMS' }
        : t
    ));

    // 5. Audit Log
    addAuditLog({
      userName: approverName,
      userRole: activeRole,
      action: 'APPROVE_ASSET_RELOCATION',
      documentType: 'Asset Requisition',
      documentCode: req.requisitionNo,
      projectName: req.targetProjectName,
      newStatus: 'Approved',
      details: `Asset ${targetAsset.name} (${targetAsset.assetCode}) approved & relocated to ${req.targetProjectName} [${req.targetLocation}]. Custodian: ${req.targetCustodianName}. MTV: ${mtvNum}.`
    });
  };

  const rejectAssetRequisition = (requisitionId: string, remarks?: string) => {
    const req = assetRequisitions.find(r => r.id === requisitionId || r.requisitionNo === requisitionId);
    if (!req) return;

    setAssetRequisitions(prev => prev.map(r => (r.id === req.id) ? {
      ...r,
      status: 'Rejected',
      approvalRemarks: remarks || 'Requisition rejected by FAMS Central Authority.'
    } : r));

    setApprovalTasks(prev => prev.map(t => 
      (t.documentId === req.id || t.documentNumber === req.requisitionNo)
        ? { ...t, status: 'Rejected', comments: remarks || 'Rejected by FAMS' }
        : t
    ));

    addAuditLog({
      userName: currentUser?.name || 'FAMS Officer',
      userRole: activeRole,
      action: 'REJECT_ASSET_RELOCATION',
      documentType: 'Asset Requisition',
      documentCode: req.requisitionNo,
      projectName: req.targetProjectName,
      newStatus: 'Rejected',
      details: `Asset requisition ${req.requisitionNo} for ${req.assetName} was rejected. Remarks: ${remarks || 'Declined'}`
    });
  };

  const approveApprovalTask = (taskId: string, comment?: string) => {
    const task = approvalTasks.find(t => t.id === taskId);
    if (!task) return;

    setApprovalTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Approved', comments: comment || t.comments } : t));

    // Cascade approval to respective document
    if (task.documentType === 'Material Requisition') {
      approveMR(task.documentId);
    } else if (task.documentType === 'Purchase Requisition') {
      approvePurchaseRequisition(task.documentId);
    } else if (task.documentType === 'Comparative Statement') {
      approveComparativeStatement(task.documentId);
    } else if (task.documentType === 'Purchase Order') {
      approvePurchaseOrder(task.documentId);
    } else if (task.documentType === 'MTV') {
      confirmMTVReceipt(task.documentId);
    } else if (task.documentType === 'Asset Requisition' || task.documentType === 'Asset Transfer') {
      approveAssetRequisition(task.documentId, comment);
    }

    addAuditLog({
      userName: currentUser?.name || 'Approver',
      userRole: activeRole,
      action: 'APPROVE_WORKFLOW_TASK',
      documentType: task.documentType,
      documentCode: task.documentNumber,
      projectName: task.projectName,
      newStatus: 'Approved',
      details: `Task ${task.documentNumber} approved by ${activeRole}. Remarks: ${comment || 'Approved as requested.'}`
    });
  };

  const rejectApprovalTask = (taskId: string, comment?: string) => {
    const task = approvalTasks.find(t => t.id === taskId);
    if (!task) return;

    setApprovalTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Rejected', comments: comment || 'Rejected' } : t));

    if (task.documentType === 'Material Requisition') {
      rejectMR(task.documentId, comment);
    } else if (task.documentType === 'Purchase Requisition') {
      setPrs(prev => prev.map(p => p.id === task.documentId ? { ...p, status: 'Rejected' } : p));
    } else if (task.documentType === 'Comparative Statement') {
      setCsList(prev => prev.map(p => p.id === task.documentId ? { ...p, status: 'Rejected' } : p));
    } else if (task.documentType === 'Purchase Order') {
      setPos(prev => prev.map(p => p.id === task.documentId ? { ...p, status: 'Rejected' } : p));
    } else if (task.documentType === 'Asset Requisition' || task.documentType === 'Asset Transfer') {
      rejectAssetRequisition(task.documentId, comment);
    }

    addAuditLog({
      userName: currentUser?.name || 'Approver',
      userRole: activeRole,
      action: 'REJECT_WORKFLOW_TASK',
      documentType: task.documentType,
      documentCode: task.documentNumber,
      projectName: task.projectName,
      newStatus: 'Rejected',
      details: `Task ${task.documentNumber} rejected by ${activeRole}. Reason: ${comment || 'Non-compliant with guidelines.'}`
    });
  };

  const returnApprovalTask = (taskId: string, comment?: string) => {
    const task = approvalTasks.find(t => t.id === taskId);
    if (!task) return;

    setApprovalTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Returned', comments: comment || 'Returned for modification' } : t));

    if (task.documentType === 'Material Requisition') {
      setMrs(prev => prev.map(m => m.id === task.documentId ? { ...m, status: 'Returned', remarks: comment } : m));
    }

    addAuditLog({
      userName: currentUser?.name || 'Approver',
      userRole: activeRole,
      action: 'RETURN_FOR_CORRECTION',
      documentType: task.documentType,
      documentCode: task.documentNumber,
      projectName: task.projectName,
      newStatus: 'Returned',
      details: `Task ${task.documentNumber} returned for correction. Note: ${comment || 'Please update BOQ line.'}`
    });
  };

  const addProject = (project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setProjects(prev => [newProject, ...prev]);
    addAuditLog({
      userName: currentUser?.name || "System",
      userRole: currentUser?.role || "System Admin",
      action: "PROJECT_CREATED",
      documentType: "Project Portfolio",
      documentCode: newProject.code,
      details: `New project "${newProject.name}" was successfully registered.`
    });
  };

  const resetAllData = () => {
    localStorage.clear();
    setProjects(INITIAL_PROJECTS);
    setItems(INITIAL_ITEMS);
    setStocks(INITIAL_STOCKS);
    setVendors(INITIAL_VENDORS);
    setMrs(INITIAL_MRS);
    setMars(INITIAL_MARS);
    setPrs(INITIAL_PRS);
    setCsList(INITIAL_CS);
    setPos(INITIAL_POS);
    setGrns(INITIAL_GRNS);
    setMivs(INITIAL_MIVS);
    setMtvs(INITIAL_MTVS);
    setGatePasses(INITIAL_GATE_PASSES);
    setAssets(INITIAL_ASSETS);
    setAssetRequisitions(INITIAL_ASSET_REQUISITIONS);
    setApprovalTasks(INITIAL_APPROVAL_TASKS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        isAuthenticated: !!currentUser,
        login,
        logout,
        setActiveRole,
        projects,
        items,
        stocks,
        vendors,
        mrs,
        mars,
        prs,
        csList,
        pos,
        grns,
        mivs,
        mtvs,
        gatePasses,
        assets,
        assetRequisitions,
        approvalTasks,
        auditLogs,
        createMR,
        verifyMR,
        approveMR,
        rejectMR,
        createMAR,
        reserveStock,
        createPRFromMAR,
        approvePurchaseRequisition,
        createComparativeStatement,
        approveComparativeStatement,
        createPurchaseOrder,
        approvePurchaseOrder,
        createGRN,
        postGRN,
        receiveChallanForPO,
        issueMARToGRN,
        createMIV,
        createMTV,
        confirmMTVReceipt,
        createGatePass,
        verifyGatePass,
        verifyGatePassSecurity,
        markGatePassReturned,
        registerAsset,
        createAsset,
        updateAsset,
        updateAssetStatus,
        reallocateAsset,
        addAssetMaintenance,
        addMaintenanceLog,
        requestAssetRelocation,
        approveAssetRequisition,
        rejectAssetRequisition,
        approveApprovalTask,
        rejectApprovalTask,
        returnApprovalTask,
        addAuditLog,
        addProject,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
