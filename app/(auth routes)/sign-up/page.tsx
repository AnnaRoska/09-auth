"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./SignUpPage.module.css";
import { register, login, getMe } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import  { AxiosError } from "axios";

export default function SignUp() {
  const router = useRouter();
  const { setUser } = useAuthStore();
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
      await register({ email, password });
      await login({ email, password });
      const me = await getMe();
      setUser(me);
      router.push("/profile");
    } catch (err: unknown) {
      let message = "Registration failed. Try again.";

      if (err instanceof AxiosError) {
        message = err.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
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
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
