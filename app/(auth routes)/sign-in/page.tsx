"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";

import { login } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import type { AxiosError } from "axios";

export default function SignIn() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const user = await login({ email, password });
      useAuthStore.getState().setUser(user);
      router.push("/profile");
    } catch (err: unknown) {
      /* catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed. Check your credentials.";
      setError((err as any)?.response?.data?.message || errorMessage);
    } finally {
      setLoading(false);
    } */
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as AxiosError<{ message?: string }>;

        setError(
          axiosError.response?.data?.message ||
            "Login failed. Check your credentials.",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Check your credentials.");
      }
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
