sed -i '/<\/div>$/i \
      {showNewProjectModal && (\
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">\
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">\
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">\
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">\
                <Building2 className="w-5 h-5 text-blue-600" /> Register New Project\
              </h3>\
              <button onClick={() => setShowNewProjectModal(false)} className="text-slate-400 hover:text-slate-600">\
                <Archive className="w-5 h-5" />\
              </button>\
            </div>\
            <div className="p-6 space-y-4">\
              <div className="grid grid-cols-2 gap-4">\
                <div>\
                  <label className="block text-xs font-bold text-slate-500 mb-1">Project Code</label>\
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.code} onChange={e => setNewProject({...newProject, code: e.target.value})} placeholder="e.g. TCCL-PRJ-01" />\
                </div>\
                <div>\
                  <label className="block text-xs font-bold text-slate-500 mb-1">Project Name</label>\
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="Project Name" />\
                </div>\
                <div>\
                  <label className="block text-xs font-bold text-slate-500 mb-1">Client Name</label>\
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} placeholder="Client Name" />\
                </div>\
                <div>\
                  <label className="block text-xs font-bold text-slate-500 mb-1">Location</label>\
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} placeholder="Location" />\
                </div>\
                <div>\
                  <label className="block text-xs font-bold text-slate-500 mb-1">Project Manager</label>\
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.manager} onChange={e => setNewProject({...newProject, manager: e.target.value})} placeholder="Manager Name" />\
                </div>\
                <div>\
                  <label className="block text-xs font-bold text-slate-500 mb-1">Total Budget (BDT)</label>\
                  <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.budget || ""} onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})} placeholder="0" />\
                </div>\
                <div>\
                  <label className="block text-xs font-bold text-slate-500 mb-1">Start Date</label>\
                  <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} />\
                </div>\
                <div>\
                  <label className="block text-xs font-bold text-slate-500 mb-1">End Date</label>\
                  <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.endDate} onChange={e => setNewProject({...newProject, endDate: e.target.value})} />\
                </div>\
              </div>\
            </div>\
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">\
              <button onClick={() => setShowNewProjectModal(false)} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors text-sm">\
                Cancel\
              </button>\
              <button \
                onClick={() => {\
                  addProject({\
                    code: newProject.code, name: newProject.name, client: newProject.client,\
                    location: newProject.location, manager: newProject.manager, budget: newProject.budget,\
                    committedBudget: 0, spentBudget: 0, startDate: newProject.startDate, endDate: newProject.endDate,\
                    status: newProject.status, workPackages: [], costCodes: []\
                  });\
                  setShowNewProjectModal(false);\
                  setNewProject({ code: "", name: "", client: "", location: "", manager: "", budget: 0, startDate: "", endDate: "", status: "Planning" as any });\
                }}\
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"\
              >\
                Create Project\
              </button>\
            </div>\
          </div>\
        </div>\
      )}' src/pages/ProjectsPage.tsx
