import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@/index.css";
import { RouterProvider } from "react-router";
import React from "react";
import router from "./routers/router.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>
);
