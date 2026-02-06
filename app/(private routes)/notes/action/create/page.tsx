import type { Metadata } from "next";
import css from "./CreateNote.module.css";
import NoteForm from "../../../../../components/NoteForm/NoteForm";

export const metadata: Metadata = {
  title: "Create Note – NoteHub",
  description: "Create a new note in NoteHub application",
  openGraph: {
    title: "Create Note – NoteHub",
    description: "Create a new note in NoteHub application",
    url: "https://notehub-public.goit.study",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>

        <NoteForm />
      </div>
    </main>
  );
}