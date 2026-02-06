"use client";

import Image from "next/image";
import css from "./ProfilePage.module.css";
import { useAuthStore } from "../../../lib/store/authStore";
import Link from "next/link";
/* import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page of NoteHub application",
}; */

const Profile = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            //src="https://ac.goit.global/avatar-placeholder.png"
            src={
              user.avatar ||
              "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};

export default Profile;
