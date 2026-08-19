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
    console.log("[NEXTiME][SW] 앱 시작 시 Service Worker 등록 시도");
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        console.log("[NEXTiME][SW] 앱 시작 등록 성공", {
          scope: registration.scope,
          active: Boolean(registration.active),
          installing: Boolean(registration.installing),
          waiting: Boolean(registration.waiting),
        });
      })
      .catch((error) => {
        console.error("[NEXTiME][SW] 앱 시작 등록 실패", error);
      });
  });
} else {
  console.warn("[NEXTiME][SW] 이 브라우저는 Service Worker를 지원하지 않습니다.");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
