import { createBrowserRouter } from "react-router";
import { Home } from "@/pages/Home/Home";
import RootLayout from "@/layout/RootLayout"
// import { NotFound } from "@/pages/NotFound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "", element: <Home /> },
    ],
    // errorElement: <NotFound />,
  },
]);

export default router;
