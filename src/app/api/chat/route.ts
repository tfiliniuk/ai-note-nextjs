import { getEmbedding } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessage } from "openai/resources";
import { auth } from "@clerk/nextjs/server";
import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { streamText } from "ai";

import { openai as openaiSDK } from "@ai-sdk/openai";

interface CoreMessage {
  role: "system" | "assistant" | "user";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated: CoreMessage[] = messages
      .slice(-6)
      .map((message) => ({
        role: message.role as "system" | "assistant" | "user",
        content: message.content ?? "",
      }));

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 1,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    const stream = streamText({
      model: openaiSDK("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",

          content:
            "You are an intelligent note-taking app. You answer the user's question based on their existing notes" +
            "The relevant notes for this query are:\n" +
            relevantNotes
              .map(
                (note) => `Title: ${note.title}\n\nContent:\n ${note.content}`,
              )
              .join("\n\n"),
        },
        ...messagesTruncated,
      ],
    });

    return (await stream).toDataStreamResponse();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
