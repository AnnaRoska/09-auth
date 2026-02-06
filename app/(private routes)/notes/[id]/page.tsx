import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query"; 
import { fetchNoteById } from "../../../lib/api/clientApi";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";
interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const note = await fetchNoteById(id);

  const title = `${note.title} | NoteHub`;
  const description = note.content.slice(0, 120);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub-public.goit.study/api/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

interface PageProps {
  params: Promise<{ id: string }>; 
}
export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient(); 
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}