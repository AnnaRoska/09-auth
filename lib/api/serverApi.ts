import type { Note } from "../../types/note";
import type { User } from "../../types/user";
import { cookies } from "next/headers";
import { api } from "./api";
import type { AxiosResponse } from "axios";

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
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
    headers: { Cookie: cookie },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookie = await getCookieHeader();

  const response = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookie },
  });

  return response.data;
};


export const getMe = async (): Promise<AxiosResponse<User>> => {
  const cookie = await getCookieHeader();
  return api.get("/users/me", { headers: { Cookie: cookie } });
};

export interface SessionResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}


export const checkSession = async (): Promise<AxiosResponse<SessionResponse>> => {
  const cookie = await getCookieHeader();
  return api.get("/auth/session", { headers: { Cookie: cookie } });
};