// app/api/chat/route.js
// Natural-language security Q&A — analysts can ask "what should I do next?"
// or "how do I hunt for lateral movement from this host?"
export const runtime = "edge"

import { groqChat } from "../../../lib/groq"

const CHAT_SYSTEM = `You are an expert SOC analyst and incident responder with 15 years of experience.
You help security teams investigate incidents, hunt threats, and respond to attacks.
You know MITRE ATT&CK deeply, common attack patterns, and practical defensive actions.
Be concise, direct, and actionable. Format your responses with clear sections when helpful.
You are embedded in the CyberGuard platform by Antigravati.`

export async function POST(req) {
  try {
    const { messages, alertContext } = await req.json()

    let system = CHAT_SYSTEM
    if (alertContext) {
      system += `\n\nCurrent alert context the analyst is investigating:\n${JSON.stringify(alertContext, null, 2)}`
    }

    // Build a multi-turn conversation
    const lastMessage = messages[messages.length - 1]?.content || ""
    const history = messages.slice(0, -1).map(m => `${m.role === "user" ? "Analyst" : "SOC-AI"}: ${m.content}`).join("\n")

    const userPrompt = history ? `Previous conversation:\n${history}\n\nAnalyst: ${lastMessage}` : lastMessage

    const reply = await groqChat(system, userPrompt, 0.3)
    return Response.json({ reply })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
