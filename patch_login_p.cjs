const fs = require('fs');
let code = fs.readFileSync('src/pages/LoginPage.css', 'utf-8');

code = code.replace(
  /\.tccl-footer-area p,\s*\.tccl-background-color \{/,
  `.tccl-footer-area p {
  font-size: 0.85em;
  transition: all 0.25s ease;
}

.tccl-background-color {`
);

code = code.replace(
  /\.tccl-footer-area:hover p,\s*\.tccl-footer-area:hover button \{/,
  `.tccl-footer-area:hover p {
  color: white;
}

.tccl-footer-area:hover button {`
);

fs.writeFileSync('src/pages/LoginPage.css', code);
