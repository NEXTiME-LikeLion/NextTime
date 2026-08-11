import { createBrowserRouter } from "react-router-dom";
import TabLayout from "./layouts/TabLayout";
import HomePage from "./pages/HomePage";
import PatternPage from "./pages/PatternPage";
import SettingPage from "./pages/SettingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TabLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pattern", element: <PatternPage /> },
      { path: "settings", element: <SettingPage /> },
    ],
  },
]);

export default router;
