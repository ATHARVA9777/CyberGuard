// app/api/analyze/route.js
// The core AI SOC engine: takes a raw security alert and runs an autonomous
// triage + investigation using Groq (free Llama 3.3 70B).
export const runtime = "edge"

import { groqChat, safeJSON } from "../../../lib/groq"

const TRIAGE_SYSTEM = `You are an expert Tier-1 SOC analyst with deep knowledge of MITRE ATT&CK, threat intelligence, and incident response.
Your job is to autonomously triage a security alert and produce a structured investigation report.

Return ONLY valid JSON — no markdown, no explanation, no fences. Schema:
{
  "severity": "CRITICAL|HIGH|MEDIUM|LOW",
  "verdict": "TRUE_POSITIVE|FALSE_POSITIVE|NEEDS_INVESTIGATION",
  "confidence": <integer 0-100>,
  "threat_summary": "<2 sentence plain-English summary of what happened and why it matters>",
  "attack_stage": "<e.g. Initial Access, Lateral Movement, Exfiltration>",
  "likely_attacker": "<e.g. opportunistic script kiddie, ransomware affiliate, insider threat, APT>",
  "blast_radius": "<e.g. Single host isolated, Could spread to 3 subnets, Potential data breach>",
  "immediate_actions": ["<action 1>", "<action 2>", "<action 3>"],
  "investigation_queries": ["<log query 1>", "<log query 2>"],
  "false_positive_indicators": ["<reason this might be benign>"],
  "threat_intel": "<Any known threat actor / campaign / CVE this matches>",
  "escalate": <true|false>
}`

export async function POST(req) {
  try {
    const { alert } = await req.json()
    if (!alert) return Response.json({ error: "No alert provided" }, { status: 400 })

    const alertStr = JSON.stringify(alert, null, 2)
    const raw = await groqChat(
      TRIAGE_SYSTEM,
      `Analyse this Wazuh security alert and produce a triage report:\n\n${alertStr}`
    )

    const analysis = safeJSON(raw)
    return Response.json({ analysis })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
