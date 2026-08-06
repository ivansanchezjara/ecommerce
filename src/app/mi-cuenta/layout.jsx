"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { LoadingScreen } from "@/components/ui";

export default function MiCuentaLayout({ children }) {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return <LoadingScreen message="Cargando..." />;
  }

  if (!isLoggedIn) return null;

  return children;
}
