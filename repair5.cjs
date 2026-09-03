const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

const tfootStart = code.indexOf('<tfoot className="bg-slate-100');
if (tfootStart !== -1) {
  const ending = code.indexOf(')}', tfootStart);
  
  if (ending !== -1) {
    const section = code.substring(tfootStart, ending + 2);
    const fixedSection = section.replace('          </div>\\n        </div>\\n      )}', '          </div>\\n        </div>\\n        </div>\\n      )}');
    code = code.substring(0, tfootStart) + fixedSection + code.substring(ending + 2);
  }
}

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
