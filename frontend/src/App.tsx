import { AuthGuard, AuthPage, Dashboard, Models } from "@/pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ModalManager } from "@/components/common";
import { MainLayout } from "@/components/layouts";
import { Fragment } from "react/jsx-runtime";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  { path: "/signup", element: <AuthPage.Signup /> },
  { path: "/signin", element: <AuthPage.Signin /> },
  { path: "/forgot-password", element: <AuthPage.ForgotPassword /> },
  { path: "/reset-password", element: <AuthPage.ResetPassword /> },
  { path: "/require-otp", element: <AuthPage.RequireOtp /> },
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      { path: "change-password", element: <AuthPage.ChangePassword /> },
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "/models", element: <Models /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <Fragment>
      <RouterProvider router={router}></RouterProvider>
      <ModalManager />
      <Toaster />
    </Fragment>
  );
}
