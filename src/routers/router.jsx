import { createBrowserRouter } from "react-router";
import RootLayout from "@/layout/RootLayout";
import LoginPage from "@/pages/Login/LoginPage";
import PrivateRoute from "@/utils/auth/PrivateRoute";
import AdminPage from "@/pages/Admin/Admin";
// import { NotFound } from "@/pages/NotFound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "", element: <LoginPage /> },
      {
        path: "admin",
        element: (
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        ),
      },
    ],
    // errorElement: <NotFound />,
  },
]);

export default router;
