import "./App.css";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import useEnsurePushSubscription from "./hooks/useEnsurePushSubscription";
import router from "./router";

function App() {
  useEnsurePushSubscription();

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
