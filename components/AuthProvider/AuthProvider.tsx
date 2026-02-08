"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession, getMe } from "../../lib/api/clientApi"; 

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const sessionUser = await checkSession(); 
        if (sessionUser) {
          const me = await getMe(); 
          setUser(me);
        } else {
          clearIsAuthenticated();
          if (pathname.startsWith("/profile")) router.push("/sign-in");
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (loading) return <p style={{ padding: 20 }}>Checking authorization...</p>;

  return <>{children}</>;
}