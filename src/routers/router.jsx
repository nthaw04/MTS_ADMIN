import AdminLayout from "@/layout/AdminLayout";
import RootLayout from "@/layout/RootLayout";
import ApplicationPage from "@/pages/Application/ApplicationPage";
import Dashboard from "@/pages/Dashboard/Dashboard";
import LoginPage from "@/pages/Login/LoginPage";
import TrainPage from "@/pages/RouteManagement/Train/TrainPage";
import User from "@/pages/User/User";
import PrivateRoute from "@/utils/auth/PrivateRoute";
import { createBrowserRouter } from "react-router";

// import NotFound from "@/pages/NotFound/NotFound"; // Nếu có NotFound page

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      // { path: "*", element: <NotFound /> }, // Optional: Trang 404
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "user-management", element: <User /> },
      { path: "trainroute-management", element: <TrainPage /> },
      { path: "applications", element: <ApplicationPage /> },
    ],
  },
]);

export default router;
