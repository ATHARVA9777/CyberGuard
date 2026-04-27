// lib/groq.js — server-side only, never imported from client directly
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

export async function groqChat(system, user, temperature = 0.2) {
  const key = process.env.GROQ_API_KEY
  if (!key || key === "gsk_your_key_here") {
    throw new Error("GROQ_API_KEY not set. See .env.local — it's free at console.groq.com")
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      temperature,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (res.status === 429) throw new Error("Rate limit hit — Groq free tier: wait 60s and retry.")
    throw new Error(err?.error?.message || `Groq error ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}

export function safeJSON(raw) {
  const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
  return JSON.parse(clean)
}
