"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Link from "next/link";

import { fetchNotes } from "../../../../../lib/api/clientApi";
import type { Note } from "../../../../../types/note";

import NoteList from "../../../../../components/NoteList/NoteList";
import Pagination from "../../../../../components/Pagination/Pagination";
import SearchBox from "../../../../../components/SearchBox/SearchBox";

import css from "../../NotesPage.module.css";

export default function NotesClient({ tag }: { tag?: string }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<{
    notes: Note[];
    totalPages: number;
  }>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
  });
return (
  <div className={css.app}>
    <header className={css.toolbar}>
      <SearchBox
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {data?.totalPages && data.totalPages > 1 && (
        <Pagination
          page={page}
          pageCount={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <Link href="/notes/action/create" className={css.button}>
        Create note +
      </Link>
    </header>

    <NoteList
      notes={data?.notes ?? []}
      isLoading={isLoading}
      isError={isError}
    />
  </div>
);
}