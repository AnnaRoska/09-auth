"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfilePage.module.css";

import { getMe, updateMe } from "../../../../lib/api/clientApi";
import { useAuthStore } from "../../../../lib/store/authStore";

export default function EditProfile() {
  const router = useRouter();

  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const me = await getMe();
        setUsername(me.username);
        setEmail(me.email);
      } catch {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const updated = await updateMe({ username, email });

      setUser(updated);

      router.push("/profile");
    } catch {
      setError("Failed to update profile");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          //src={user?.avatar || "/default-avatar.png"}
          src={user?.avatar || "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>

            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>
          
          {/* <p>Email: {user?.email}</p> */}
          {/* <p>Email: user_email@example.com</p> */}

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>

            {<button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button> }
          </div>
        </form>
      </div>
    </main>
  );
}