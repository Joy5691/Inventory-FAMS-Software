import React from 'react';
import { renderToString } from 'react-dom/server';
import { FAMSPage } from './src/pages/FAMSPage';
import { AppProvider } from './src/context/AppContext';

try {
  const html = renderToString(
    <AppProvider>
      <FAMSPage />
    </AppProvider>
  );
  console.log("FAMS Render successful. Length:", html.length);
} catch (e) {
  console.error("FAMS Render failed:", e);
}
