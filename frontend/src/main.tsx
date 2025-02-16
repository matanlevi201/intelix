import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";

import { AuthGuard, ChangePassword, ForgotPassword, RequireOtp, ResetPassword, Signin, Signup } from "@/pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ModalManager } from "@/components/common";
import { Toaster } from "sonner";
import App from "./App.tsx";

const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/require-otp", element: <RequireOtp /> },
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      { index: true, element: <App /> },
      { path: "/change-password", element: <ChangePassword /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
    <ModalManager />
    <Toaster />
  </StrictMode>
);
