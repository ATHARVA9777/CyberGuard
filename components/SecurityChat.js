"use client"
import { useState, useRef, useEffect } from "react"
import { Spinner, ErrBox, TCard, SLabel, Btn } from "./ui"

export default function SecurityChat({ alertContext }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "SOC-AI online. I can help you investigate alerts, hunt threats, write detection rules, or answer security questions. What do you need?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const QUICK_PROMPTS = alertContext ? [
    `What's the fastest way to contain this threat on ${alertContext.alert?.agent?.name}?`,
    `Write a Wazuh rule to detect this pattern in future`,
    `What other hosts should I check for lateral movement?`,
  ] : [
    "How do I hunt for lateral movement in my network?",
    "Write a Wazuh rule to detect PowerShell obfuscation",
    "What are the MITRE ATT&CK techniques for ransomware?",
  ]

  async function send(text) {
    const msg = text || input.trim()
    if (!msg) return
    setInput("")
    const newMessages = [...messages, { role: "user", content: msg }]
    setMessages(newMessages)
    setLoading(true); setErr("")
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, alertContext }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch (e) { setErr(e.message) }
    setLoading(false)
  }

  return (
    <TCard style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 500 }}>
      <SLabel color="var(--green)">// SOC-AI ANALYST</SLabel>

      {alertContext && (
        <div style={{ marginBottom: 12, padding: "8px 12px", background: "var(--blue-dim)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontFamily: "var(--mono)", fontSize: 11, color: "var(--blue)" }}>
          Context: {alertContext.alert?.rule?.description} on {alertContext.alert?.agent?.name}
        </div>
      )}

      {/* Message thread */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 14, maxHeight: 420 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "88%",
              padding: "10px 14px",
              borderRadius: "var(--radius)",
              fontFamily: m.role === "user" ? "var(--mono)" : "var(--sans)",
              fontSize: m.role === "user" ? 13 : 14,
              lineHeight: 1.65,
              background: m.role === "user" ? "var(--blue-dim)" : "var(--surface)",
              color: m.role === "user" ? "var(--blue)" : "var(--text)",
              border: `1px solid ${m.role === "user" ? "var(--border-hi)" : "var(--border)"}`,
              whiteSpace: "pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <Spinner label="" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ErrBox msg={err} />

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {QUICK_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => send(p)}
            disabled={loading}
            style={{
              fontFamily: "var(--mono)", fontSize: 10, padding: "4px 9px",
              borderRadius: 4, background: "var(--surface)", border: "1px solid var(--border)",
              color: "var(--muted)", cursor: "pointer", textAlign: "left", lineHeight: 1.4,
            }}
          >{p.slice(0, 50)}{p.length > 50 ? "..." : ""}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask anything — hunt queries, playbooks, containment steps..."
          disabled={loading}
          style={{
            flex: 1, fontFamily: "var(--mono)", fontSize: 13,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "10px 14px",
            color: "var(--text)", outline: "none",
          }}
        />
        <Btn onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: "10px 16px" }}>→</Btn>
      </div>
    </TCard>
  )
}
