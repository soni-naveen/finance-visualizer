"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";

export function useAuthToken() {
  const { user } = useAuth();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);
          // Store token in cookie for server-side access
          document.cookie = `firebase-auth-token=${idToken}; path=/; max-age=3600; secure; samesite=strict`;
        } catch (error) {
          console.error("Error getting token:", error);
          setToken(null);
        }
      } else {
        setToken(null);
        // Clear token cookie
        document.cookie =
          "firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    };

    getToken();

    // Refresh token every 50 minutes
    const interval = setInterval(getToken, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  return token;
}
