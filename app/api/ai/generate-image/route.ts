import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const maxDuration = 60; // Allow 60 seconds since Image Generation takes long

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (!user?.openAiKey) {
      return NextResponse.json({ error: "Manca la chiave API di OpenAI. Aggiungila in Impostazioni per generare immagini." }, { status: 400 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Nessun prompt fornito." }, { status: 400 });
    }

    console.log("Generating DALL-E 3 Image for:", prompt);

    const openAiRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.openAiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        // DALL-E 3 supports 1024x1024, 1024x1792 (vertical)
        size: "1024x1792",
        response_format: "b64_json" // Vogliamo il base64 per evitare blocchi CORS nel Canvas Konva
      })
    });

    if (!openAiRes.ok) {
      const errText = await openAiRes.text();
      console.error("OpenAI Error:", errText);
      return NextResponse.json({ error: "Errore durante la comunicazione con OpenAI. (DALL-E 3 Error)" }, { status: 500 });
    }

    const data = await openAiRes.json();
    const b64 = data.data?.[0]?.b64_json;

    if (!b64) {
      return NextResponse.json({ error: "Nessuna immagine restituita." }, { status: 500 });
    }

    return NextResponse.json({ success: true, base64: `data:image/png;base64,${b64}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
