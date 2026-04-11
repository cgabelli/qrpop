import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { openAiKey, geminiKey, aiProvider } = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        openAiKey: openAiKey || null,
        geminiKey: geminiKey || null,
        aiProvider: aiProvider || "openai"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
