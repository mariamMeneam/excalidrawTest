import { StrictMode } from "react";
// import { createRoot } from "react-dom";
import { createRoot } from 'react-dom/client';
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('The root element was not found');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

