"use client";

import { useAuth } from "@/lib/firebase/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/loading";

const publicAuthRoutes = [
  "/auth/signup",
  "/auth/signin",
  "/auth/forgot-password",
  "/",
];

export function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isOnPublicAuthRoute = publicAuthRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (user && isOnPublicAuthRoute) {
      router.replace("/dashboard");
    } else if (!user && !isOnPublicAuthRoute) {
      router.replace("/auth/signin");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <Loading />;
  }

  // Prevent UI from rendering while redirecting
  const isOnPublicAuthRoute = publicAuthRoutes.includes(pathname);
  if ((user && isOnPublicAuthRoute) || (!user && !isOnPublicAuthRoute)) {
    return null;
  }

  return <>{children}</>;
}
