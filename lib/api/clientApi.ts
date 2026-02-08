import type { Note } from "../../types/note";
import type { User } from "../../types/user";
import { api } from "./api";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  totalPages: number;
  notes: Note[];
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get("/notes", {
    params: { page, perPage, search, ...(tag ? { tag } : {}) },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (payload: CreateNoteParams): Promise<Note> => {
  const response = await api.post("/notes", payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

interface AuthParams {
  email: string;
  password: string;
}

export const register = async (data: AuthParams): Promise<User> => {
  const response = await api.post("/auth/register", data);
  //console.log("register response.data :", response.data)
  //console.log("register response.data.user  :", response.data.user)
  return response.data;
};



export const login = async (data: AuthParams): Promise<User> => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (err: unknown) {
    throw err; 
  }
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await api.get("/auth/session");
    return response.data;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const response = await api.get("/users/me");
  return response.data;
};

export interface UpdateMeParams {
  username: string;
}

export const updateMe = async (data: UpdateMeParams): Promise<User> => {
  const response = await api.patch("/users/me", data);
  return response.data;
};