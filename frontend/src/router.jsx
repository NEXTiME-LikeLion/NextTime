import Splash from "./pages/Splash/Splash";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import OnboardingLoadingPage from "./pages/onboarding/OnboardingLoadingPage";
import OnboardingCompletePage from "./pages/onboarding/OnboardingCompletePage";
import OnboardingDevicePage from "./pages/onboarding/OnboardingDevicePage";
import { createBrowserRouter } from "react-router-dom";
import TabLayout from "./layouts/TabLayout";
import AuthLayout from "./layouts/AuthLayout";
import NextTimeLayout, {
  NextTimeIndexRedirect,
} from "./layouts/NextTimeLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HomePage from "./pages/HomePage";
import PatternPage from "./pages/PatternPage";
import PatternRecordPage from "./pages/PatternRecordPage";
import SettingsPage from "./pages/SettingsPage";
import GoalPage from "./pages/settings/GoalPage";
import ExcludePage from "./pages/settings/ExcludePage";
import DevicePage from "./pages/settings/DevicePage";
import ContextFlowPage from "./pages/next-time/ContextFlowPage";
import NextMeLoadingPage from "./pages/next-time/NextMeLoadingPage";
import RecommendPage from "./pages/next-time/RecommendPage";
import MissionPage from "./pages/next-time/MissionPage";
import RecordPage from "./pages/next-time/RecordPage";
import CompletePage from "./pages/next-time/CompletePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Splash />,
  },

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
    path: "/main",
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
    element: <NextTimeLayout />,
    children: [
      { index: true, element: <NextTimeIndexRedirect /> },
      { path: "context", element: <ContextFlowPage /> },
      { path: "next-me", element: <NextMeLoadingPage /> },
      { path: "recommend", element: <RecommendPage /> },
      { path: "mission", element: <MissionPage /> },
      { path: "record", element: <RecordPage /> },
      { path: "complete", element: <CompletePage /> },
    ],
  },
]);

export default router;
