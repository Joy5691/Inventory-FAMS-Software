const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(/ashuliaQty: ashuliaAvail,\n\s*sreemangalQty: sreemangalAvail,\n\s*otherStoreQty: 0,/g, `ashuliaQty: hoAvail,\n          sreemangalQty: otherAvail,\n          otherStoreQty: 0,`);

fs.writeFileSync('src/context/AppContext.tsx', code, 'utf8');
console.log('Fixed MAR object creation');
