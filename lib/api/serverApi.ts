import type { Note } from "../../types/note";
import type { User } from "../../types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const fetchNotes = async (
  params: { page?: number; perPage?: number; search?: string; tag?: string },
  cookie?: string
) => {
  const query = new URLSearchParams({
    page: String(params.page || 1),
    perPage: String(params.perPage || 12),
    search: params.search || "",
    ...(params.tag ? { tag: params.tag } : {}),
  });

  const res = await fetch(`${API_URL}/notes?${query.toString()}`, {
    headers: cookie ? { Cookie: cookie } : {},
    cache: "no-store",
  });

  return res.json();
};

export const fetchNoteById = async (
  id: string,
  cookie?: string
): Promise<Note> => {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    headers: cookie ? { Cookie: cookie } : {},
    cache: "no-store",
  });

  return res.json();
};

export const getMe = async (cookie?: string): Promise<User | null> => {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: cookie ? { Cookie: cookie } : {},
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
};

export const checkSession = async (cookie?: string): Promise<User | null> => {
  const res = await fetch(`${API_URL}/auth/session`, {
    headers: cookie ? { Cookie: cookie } : {},
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
};