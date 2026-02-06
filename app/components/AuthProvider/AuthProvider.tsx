"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { checkSession } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { setUser, clearIsAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();

          if (pathname.startsWith("/profile")) {
            router.push("/sign-in");
          }
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    }

    verify();
  },[pathname, setUser, clearIsAuthenticated, router]);

  if (loading) {
    return <p style={{ padding: 20 }}>Checking authorization...</p>;
  }

  return <>{children}</>;
}
