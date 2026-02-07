"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession, getMe } from "../../lib/api/clientApi";

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
        const session = await checkSession();

        if (session) {
          const user = await getMe();

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
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (loading) {
    return <p style={{ padding: 20 }}>Checking authorization...</p>;
  }

  return <>{children}</>;
}