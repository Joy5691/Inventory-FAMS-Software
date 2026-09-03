const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

code = code.split('\\\\n').join('\\n');

// Also, need to close the div I broke in FAMSPage.tsx
// Let's find where </table> ends inside the report.
const tableEndStr = '</table>\\n          </div>';
const idx = code.indexOf(tableEndStr);
if (idx !== -1 && !code.substring(idx, idx + 50).includes('</div>\\n        </div>\\n      )}')) {
  // need to add </div> after the tableEndStr
  code = code.replace('            </table>\\n          </div>\\n        </div>\\n      )}', '            </table>\\n          </div>\\n          </div>\\n        </div>\\n      )}');
}

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
