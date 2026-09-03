import React from 'react';
import { renderToString } from 'react-dom/server';
import { InventoryPage } from './src/pages/InventoryPage';
import { AppProvider } from './src/context/AppContext';

try {
  const html = renderToString(
    <AppProvider>
      <InventoryPage />
    </AppProvider>
  );
  console.log("Inv Render successful. Length:", html.length);
} catch (e) {
  console.error("Inv Render failed:", e);
}
