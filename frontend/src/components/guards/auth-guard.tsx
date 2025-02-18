import { useSessionStore } from "@/context/use-session-store";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

export const AuthGuard = () => {
  const { refresh } = useAuth();
  const { currentUser, endSession } = useSessionStore();
  const [isRefreshing, setIsRefreshing] = useState(true);

  const refreshAccessToken = async () => {
    try {
      await refresh();
    } catch {
      endSession();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  if (isRefreshing) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  const { is2FAEnabled, is2FAVerified } = currentUser;
  if (is2FAEnabled && !is2FAVerified) {
    return <Navigate to="/require-otp" />;
  }

  return <Outlet />;
};
