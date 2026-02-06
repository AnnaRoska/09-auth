

  import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { fetchNotes } from "../../../../lib/api/clientApi";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0];

  const filterName = tag && tag !== "all" ? tag : "All Notes";

  const title = `Notes filtered by ${filterName} | NoteHub`;
  const description = `View notes filtered by tag: ${filterName} in NoteHub application.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub-public.goit.study/api/notes/filter/${tag ?? "all"}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub filter",
        },
      ],
    },
  };
}


export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;

  const tag = slug?.[0] === "all" ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}