const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf-8');

// Replace the <aside className={...}>
code = code.replace(
  /w-64 h-full bg-white  border-r border-slate-200 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 \$\{/,
  "h-full bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'} ${"
);

// We need to inject isCollapsed logic for text
code = code.replace(
  /<span className="truncate">{item.label}<\/span>/g,
  `{!isCollapsed && <span className="truncate">{item.label}</span>}`
);

// Hide category headers if collapsed
code = code.replace(
  /<p className="px-3 mb-2 text-\[10px\] font-bold text-slate-500 uppercase tracking-widest">Operations<\/p>/,
  `{!isCollapsed ? <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operations</p> : <div className="h-4" />}`
);

code = code.replace(
  /<p className="px-3 mb-2 text-\[10px\] font-bold text-slate-500 uppercase tracking-widest">Governance & Control<\/p>/,
  `{!isCollapsed ? <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Governance & Control</p> : <div className="h-4" />}`
);

// Hide badges if collapsed
code = code.replace(
  /\{item.badge && !active && \(/g,
  `{!isCollapsed && item.badge && !active && (`
);

// Adjust counter badge placement/visibility
code = code.replace(
  /\{item.counter !== undefined && item.counter > 0 && \(/,
  `{!isCollapsed && item.counter !== undefined && item.counter > 0 && (`
);

// Hide User profile details
code = code.replace(
  /<div className="flex-1 min-w-0">\s*<p className="text-xs font-bold text-slate-900 truncate">Super Admin<\/p>\s*<p className="text-\[10px\] text-slate-500 font-medium truncate">System Administrator<\/p>\s*<\/div>/,
  `{!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Super Admin</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">System Administrator</p>
                  </div>
                )}`
);

// Hide sign out text and replace pulse text
code = code.replace(
  /<span className="flex items-center gap-1.5 text-\[10px\] text-slate-500 font-mono">\s*<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"><\/span>\s*HQ Online\s*<\/span>/,
  `<span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {!isCollapsed && "HQ Online"}
              </span>`
);

code = code.replace(
  /<LogOut className="w-3 h-3" \/> Sign Out/,
  `<LogOut className="w-4 h-4" /> {!isCollapsed && "Sign Out"}`
);

// We should also add the minimize/maximize button
const headerReplace = `<div className="flex flex-col h-full overflow-hidden">
          {/* Top Branding Section */}
          <div className="p-5 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCollapsed ? <div className="px-1"><Building2 className="w-8 h-8 text-blue-600" /></div> : <Logo showTagline={false} />}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded shadow-sm"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              
              {setMobileOpen && (
                <button
                  onClick={() => setMobileOpen(false)}
                  className="lg:hidden p-1 text-slate-500 hover:text-white rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>`;

code = code.replace(/<div className="flex flex-col h-full overflow-hidden">[\s\S]*?<\/button>\s*\)\}\s*<\/div>/, headerReplace);

// Let's add justify-center to nav links when collapsed so icons are centered
code = code.replace(
  /w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-all group rounded-r-md cursor-pointer/g,
  "w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-xs font-medium transition-all group rounded-r-md cursor-pointer"
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
