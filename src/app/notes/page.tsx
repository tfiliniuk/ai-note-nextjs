import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";

export const metadata: Metadata = {
  title: "FlowBrain - Notes",
};
export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) {
    throw Error("userid undefined");
  }

  const allNotes = await prisma.note.findMany({
    where: { userId },
  });
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}

      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"You don't have any notes yet. Why don't you create one?"}
        </div>
      )}
    </div>
  );
}
