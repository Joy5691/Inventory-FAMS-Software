import React from 'react';
import { renderToString } from 'react-dom/server';
import { ProjectsPage } from './src/pages/ProjectsPage';
import { AppProvider } from './src/context/AppContext';

try {
  const html = renderToString(
    <AppProvider>
      <ProjectsPage />
    </AppProvider>
  );
  console.log("Render successful. Length:", html.length);
} catch (e) {
  console.error("Render failed:", e);
}
