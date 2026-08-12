import { createBrowserRouter } from "react-router-dom";
import TabLayout from "./layouts/TabLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TabLayout />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
