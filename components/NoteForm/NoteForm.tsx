"use client";

import css from "./NoteForm.module.css";
import { createNote } from "../../lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useNoteStore } from "../../lib/store/noteStore";

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  async function handleSubmit(formData: FormData) {
    const note = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
    };

    try {
      await createNote(note);

      queryClient.invalidateQueries({ queryKey: ["notes"] });

      clearDraft();

      router.back();
    } catch (error) {
      alert(`Failed to create note: ${(error as Error).message}`);
    }
  }

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={50}
          className={css.input}
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          maxLength={500}
          className={css.textarea}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
