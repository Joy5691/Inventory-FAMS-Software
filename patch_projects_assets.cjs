const fs = require('fs');

let page = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');

// Seems like there was an unterminated JSX issue when replacing the asset block end, let's fix that.
// First, find the end of the assets block
let index = page.indexOf("No fixed assets assigned to this project.");
if (index !== -1) {
    let tbodyEnd = page.indexOf("</tbody>", index);
    if (tbodyEnd !== -1) {
        let tableEnd = page.indexOf("</table>", tbodyEnd);
        if (tableEnd !== -1) {
            let divEnd1 = page.indexOf("</div>", tableEnd);
            let divEnd2 = page.indexOf("</div>", divEnd1 + 6);
            let blockEnd = page.indexOf(")}", divEnd2);
            
            // Reconstruct perfectly
            const badSlice = page.slice(tableEnd, blockEnd + 2);
            page = page.replace(badSlice, `</table>
              </div>
            </div>
          )}`);
    }
}
}
fs.writeFileSync('src/pages/ProjectsPage.tsx', page, 'utf8');
