import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.openAiKey) {
      return NextResponse.json({ error: "Manca la chiave API di OpenAI. Aggiungila in Impostazioni." }, { status: 400 });
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

    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.openAiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!openAiRes.ok) {
      const err = await openAiRes.json();
      console.error(err);
      return NextResponse.json({ error: "Errore durante la comunicazione con OpenAI. Verifica che la chiave sia valida e abbia i permessi." }, { status: 500 });
    }

    const data = await openAiRes.json();
    const resultJson = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ success: true, data: resultJson });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
