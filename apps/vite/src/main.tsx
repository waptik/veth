// Imports
// ========================================================
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import RootProvider from "./providers";

import "./style.css";

// Render
// ========================================================
const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RootProvider>
        <App />
      </RootProvider>
    </StrictMode>,
  );
}
