sed -i '/const \[activeTab, setActiveTab\] = useState/a \ \ const [showNewProjectModal, setShowNewProjectModal] = useState(false);\
  const [newProject, setNewProject] = useState({\
    code: "", name: "", client: "", location: "", manager: "",\
    budget: 0, startDate: "", endDate: "", status: "Planning" as any\
  });' src/pages/ProjectsPage.tsx
