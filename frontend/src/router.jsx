import { createBrowserRouter } from "react-router-dom";
import TabLayout from "./layouts/TabLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TabLayout />,
  },
  {
    path: "/login",
    element: <AuthLayout logoMarginTop={140} bottomPadding={200} />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/signup",
    element: <AuthLayout logoMarginTop={70} bottomPadding={100} />,
    children: [{ index: true, element: <Signup /> }],
  },
]);

export default router;
