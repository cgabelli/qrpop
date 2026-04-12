import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const maxDuration = 60; // Allow 60 seconds since Image Generation takes long

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const provider = user?.aiProvider || "openai";

    if (provider === "openai" && !user?.openAiKey) {
      return NextResponse.json({ error: "Manca la chiave API di OpenAI. Aggiungila in Impostazioni per generare immagini." }, { status: 400 });
    }
    if (provider === "gemini" && !user?.geminiKey) {
      return NextResponse.json({ error: "Manca la chiave API di Google Gemini. Aggiungila in Impostazioni per generare immagini." }, { status: 400 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Nessun prompt fornito." }, { status: 400 });
    }

    let b64 = "";
    let mimeType = "image/png";

    if (provider === "openai") {
      console.log("Generating DALL-E 3 Image for:", prompt);
      const openAiRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.openAiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1792",
          response_format: "b64_json"
        })
      });

      if (!openAiRes.ok) {
        const errText = await openAiRes.text();
        console.error("OpenAI Error:", errText);
        return NextResponse.json({ error: "Errore durante la comunicazione con OpenAI. (DALL-E 3 Error)" }, { status: 500 });
      }

      const data = await openAiRes.json();
      b64 = data.data?.[0]?.b64_json;
    } else if (provider === "gemini") {
      console.log("Generating Imagen 3 Image for:", prompt);
      mimeType = "image/jpeg";
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${user?.geminiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            { prompt: prompt }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: "9:16"
          }
        })
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        console.error("Gemini Error:", errText);
        return NextResponse.json({ error: "Errore durante la comunicazione con Gemini. (Imagen 3 Error)" }, { status: 500 });
      }

      const data = await geminiRes.json();
      b64 = data.predictions?.[0]?.bytesBase64Encoded;
    }

    if (!b64) {
      return NextResponse.json({ error: "Nessuna immagine restituita." }, { status: 500 });
    }

    return NextResponse.json({ success: true, base64: `data:${mimeType};base64,${b64}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
