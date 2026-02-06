"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import css from "./AuthNavigation.module.css";

import { logout } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";

export default function AuthNavigation() {
  const router = useRouter();

  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();

      clearIsAuthenticated();

      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" className={css.navigationLink}>
            Login
          </Link>
        </li>

        <li className={css.navigationItem}>
          <Link href="/sign-up" className={css.navigationLink}>
            Register
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" className={css.navigationLink}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>

        <button className={css.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  );
}