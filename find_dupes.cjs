const fs = require('fs');

const content = fs.readFileSync('src/data/mockData.ts', 'utf8');
const idMatches = content.match(/id:\s*'[^']+'/g);
if (idMatches) {
  const ids = idMatches.map(m => m.split("'")[1]);
  const counts = {};
  ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
  for (const id in counts) {
    if (counts[id] > 1) {
      console.log(`Duplicate id found: ${id} (${counts[id]} times)`);
    }
  }
}
