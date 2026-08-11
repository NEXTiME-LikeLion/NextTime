import { createBrowserRouter } from "react-router-dom";
import TabLayout from "./layouts/TabLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TabLayout />,
  },
]);

export default router;
