import "./App.css";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import router from "./router";

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
