"use client";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "../../../../components/Modal/Modal";
import { fetchNoteById } from "../../../../lib/api/clientApi";
import css from "./NotePreview.module.css";
export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });
  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading, please wait...</p>}
      {error && <p>Something went wrong.</p>}
      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
            <button className={css.backBtn} onClick={() => router.back()}>Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
