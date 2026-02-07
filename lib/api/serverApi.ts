import type { Note } from "../../types/note";
import type { User } from "../../types/user";

import { cookies } from "next/headers";
import { api } from "./api";

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();

  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async (params: FetchNotesParams) => {
  const cookie = await getCookieHeader();

  const response = await api.get("/notes", {
    params: {
      page: params.page || 1,
      perPage: params.perPage || 12,
      search: params.search || "",
      ...(params.tag ? { tag: params.tag } : {}),
    },
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookie = await getCookieHeader();

  const response = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const getMe = async (cookieArg?: string): Promise<User | null> => {
  const cookie = cookieArg ?? await getCookieHeader();

  try {
    const response = await api.get("/users/me", {
      headers: {
        Cookie: cookie,
      },
    });

    return response.data;
  } catch {
    return null;
  }
};

export interface SessionResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const checkSession = async (): Promise<SessionResponse> => {
  const cookie = await getCookieHeader();

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await api.post(
    "/auth/session",
    { refreshToken },
    {
      headers: {
        Cookie: cookie,
      },
    },
  );

  return response.data;
};
