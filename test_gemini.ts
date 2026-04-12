import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({
    where: { NOT: { geminiKey: null } }
  })
  
  if (!user || !user.geminiKey) {
    console.log("No geminiKey found")
    return
  }
  
  const prompt = "A red apple on a desk"
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${user.geminiKey}`
  
  console.log("Testing Gemini API...")
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"]
      }
    })
  })
  
  if (!res.ok) {
    console.error("Error:", await res.text())
  } else {
    const data = await res.json()
    console.log("Success! Modalities returned:", data?.candidates?.[0]?.content?.parts?.map(p => Object.keys(p)))
  }
}

main().catch(console.error)
