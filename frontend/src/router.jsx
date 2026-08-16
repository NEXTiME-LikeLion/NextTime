import { createBrowserRouter } from "react-router-dom";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import OnboardingLoadingPage from "./pages/onboarding/OnboardingLoadingPage";
import OnboardingCompletePage from "./pages/onboarding/OnboardingCompletePage";
import OnboardingDevicePage from "./pages/onboarding/OnboardingDevicePage";
import TabLayout from "./layouts/TabLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HomePage from "./pages/HomePage";
import PatternPage from "./pages/PatternPage";
import PatternRecordPage from "./pages/PatternRecordPage";
import SettingsPage from "./pages/SettingsPage";
import GoalPage from "./pages/settings/GoalPage";
import ExcludePage from "./pages/settings/ExcludePage";
import DevicePage from "./pages/settings/DevicePage";
import NextTimePage from "./pages/next-time/NextTimePage";

const router = createBrowserRouter([
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/onboarding/loading",
    element: <OnboardingLoadingPage />,
  },
  {
    path: "/onboarding/complete",
    element: <OnboardingCompletePage />,
  },
  {
    path: "/onboarding/device",
    element: <OnboardingDevicePage />,
  },
  {
    path: "/settings/goal",
    element: <GoalPage />,
  },
  {
    path: "/settings/exclude",
    element: <ExcludePage />,
  },
  {
    path: "/settings/device",
    element: <DevicePage />,
  },
  {
    path: "/pattern/records",
    element: <PatternRecordPage />,
  },
  {
    path: "/",
    element: <TabLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pattern", element: <PatternPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
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
  {
    path: "/next-time",
    element: <NextTimePage />,
  },
]);

export default router;
