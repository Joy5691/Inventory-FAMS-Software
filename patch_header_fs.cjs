const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Header.tsx', 'utf-8');

// Import Maximize, Minimize
if (!code.includes('Maximize')) {
  code = code.replace("ExternalLink", "ExternalLink,\n  Maximize,\n  Minimize");
}

const fullscreenStates = `
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.log(err));
      }
    }
  };

  const handleNav =`;

code = code.replace("const handleNav =", fullscreenStates);

const buttonHtml = `
          {/* Full Screen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 border border-slate-200 transition-colors"
            title="Toggle Full Screen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Reset Demo Data Button */}`;

code = code.replace("{/* Reset Demo Data Button */}", buttonHtml);

fs.writeFileSync('src/components/layout/Header.tsx', code);
