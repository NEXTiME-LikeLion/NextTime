import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "styled-components";
import { theme } from "./constants/theme.js";
import { Amplify } from "aws-amplify";
import awsConfig from "./aws-config.js";

Amplify.configure(awsConfig);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .catch((error) => {
        console.error("Service Worker 등록 실패", error);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
