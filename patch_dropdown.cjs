const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

const locationDropdown = `
          <div className="flex items-center gap-2 mb-4">
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="ALL">All Sites & Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          `;

// Remove it from current place
code = code.replace(locationDropdown, '');

// And add it inside the filter strip
const searchInputEnd = `              placeholder="Search Asset Code, Machine, Serial..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E]"
            />
          </div>`;

const newSearchInputEnd = searchInputEnd + `

          {viewMode === 'LIST' && (
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-[#174A7E]"
            >
              <option value="ALL">All Sites & Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          )}`;

code = code.replace(searchInputEnd, newSearchInputEnd);

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
console.log('Dropdown moved successfully');
