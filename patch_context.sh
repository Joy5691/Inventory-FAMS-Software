sed -i '/const resetAllData = () => {/i \
  const addProject = (project: Omit<Project, "id">) => {\
    const newProject: Project = {\
      ...project,\
      id: `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`\
    };\
    setProjects(prev => [newProject, ...prev]);\
    addAuditLog({\
      userName: currentUser?.name || "System",\
      userRole: currentUser?.role || "System Admin",\
      action: "PROJECT_CREATED",\
      documentType: "Project Portfolio",\
      documentCode: newProject.code,\
      details: `New project "${newProject.name}" was successfully registered.`\
    });\
  };\
' src/context/AppContext.tsx
