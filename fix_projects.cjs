const fs = require('fs');
let lines = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8').split('\n');

const newUI = `        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map(proj => {
            const pct = Math.round((proj.spentBudget / proj.budget) * 100) || 0;
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-blue-500/40 transition-all space-y-3 cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {proj.code}
                  </span>
                  <h4 className="font-bold text-slate-900 mt-1.5 text-sm line-clamp-1">{proj.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{proj.location}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-bold text-slate-700">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className={\`h-1.5 rounded-full \${pct > 80 ? 'bg-orange-500' : 'bg-blue-500'}\`} 
                      style={{ width: \`\${pct > 100 ? 100 : pct}%\` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Spent</p>
                    <p className="text-xs font-mono font-bold text-slate-900">৳{proj.spentBudget.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Budget</p>
                    <p className="text-xs font-mono font-bold text-slate-900">৳{proj.budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}`;

lines = lines.slice(0, 179);
lines.push(newUI);

fs.writeFileSync('src/pages/ProjectsPage.tsx', lines.join('\n'));
console.log('Fixed UI');
