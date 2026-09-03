const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

code = code.replace(
  '            </table>\\n          </div>\\n        </div>\\n      )}',
  '            </table>\\n          </div>\\n        </div>\\n        </div>\\n      )}'
);

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
