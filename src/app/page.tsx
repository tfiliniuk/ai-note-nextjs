import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId }: { userId: string | null } = auth();

  if (userId) {
    redirect("/notes");
  }
  return (
    <main className="flex flex-col h-screen items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="FlowBrain logo" width={100} height={100} />
        <span className="font-extrabold tracking-tighter text-4xl lg:text-5xl">
          FlowBrain
        </span>
      </div>
      <p className="max-w-prose text-center">
        An intelligent note-taking app with AI integration, built with OpenAI,
        Pienoce, Next.js, Shadcn UI, Clerk, and more
      </p>
      <Button asChild size="lg">
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
