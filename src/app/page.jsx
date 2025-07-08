"use client";

import { useAuth } from "@/lib/firebase/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/auth/signin");
      }
    }
  }, [user, loading, router]);

  return null;
}
