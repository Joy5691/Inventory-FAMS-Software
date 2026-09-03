const fs = require('fs');

let fams = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf8');

// Replace manual location in "Create Asset"
fams = fams.replace(
  /const \[assetLocation, setAssetLocation\] = useState\('Ashulia Main Yard, Savar'\);/g,
  ""
);

fams = fams.replace(
  /currentLocation: assetLocation,/g,
  "currentLocation: proj?.name || 'Dhaka Elevated Expressway Phase-3 (DEEP-03)',"
);

const oldCurrentYardInput = `                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Current Yard Location *</label>
                  <input
                    type="text"
                    required
                    value={assetLocation}
                    onChange={e => setAssetLocation(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>`;
fams = fams.replace(oldCurrentYardInput, "");

// Replace manual location in "Reallocate Modal"
fams = fams.replace(
  /const \[reallocLocation, setReallocLocation\] = useState\('Chittagong Port Deep Jetty Site'\);/g,
  ""
);

fams = fams.replace(
  /reallocLocation,/g,
  "proj?.name || 'New Project',"
);

const oldReallocDestInput = `              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination Site Yard Location *</label>
                <input
                  type="text"
                  required
                  value={reallocLocation}
                  onChange={e => setReallocLocation(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>`;
fams = fams.replace(oldReallocDestInput, "");

fs.writeFileSync('src/pages/FAMSPage.tsx', fams, 'utf8');
console.log("FAMS location inputs removed/synced with projects");
