import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const provider = user?.aiProvider || "openai";

    if (provider === "openai" && !user?.openAiKey) {
      return NextResponse.json({ error: "Manca la chiave API di OpenAI. Aggiungila in Impostazioni." }, { status: 400 });
    }
    if (provider === "gemini" && !user?.geminiKey) {
      return NextResponse.json({ error: "Manca la chiave API di Google Gemini. Aggiungila in Impostazioni." }, { status: 400 });
    }

    const { prodotto, offerta, tono } = await req.json();

    const systemPrompt = `
    Sei un copywriter esperto di marketing vettoriale per locandine. 
    Il cliente vuole promuovere: "${prodotto}".
    Offerta/Condizioni: "${offerta}".
    Tono di voce richiesto: "${tono}".
    
    Genera ESATTAMENTE un oggetto JSON con due campi.
    "titolo": un testo d'impatto, corto (massimo 4-5 parole) che generi hook. Maiuscolo.
    "sottotitolo": un testo descrittivo che spiega l'offerta o dà contesto, di 1-2 righe massimo.
    Non restituire null'altro che il JSON.
    `;

    let resultJsonStr = "";

    if (provider === "openai") {
      const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.openAiKey}` // We already checked it exists
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      if (!openAiRes.ok) {
        console.error(await openAiRes.text());
        return NextResponse.json({ error: "Errore OpenAI. Verifica chiave proxy." }, { status: 500 });
      }

      const data = await openAiRes.json();
      resultJsonStr = data.choices[0].message.content;
    } else if (provider === "gemini") {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${user?.geminiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!geminiRes.ok) {
        console.error(await geminiRes.text());
        return NextResponse.json({ error: "Errore Google Gemini. Verifica chiave proxy." }, { status: 500 });
      }

      const data = await geminiRes.json();
      resultJsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    }

    const resultJson = JSON.parse(resultJsonStr);

    return NextResponse.json({ success: true, data: resultJson });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
