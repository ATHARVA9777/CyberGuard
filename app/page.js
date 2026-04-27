"use client"
import { useState } from "react"
import AlertTriage from "../components/AlertTriage"
import SecurityChat from "../components/SecurityChat"

const NAV_ITEMS = ["alert triage", "ai analyst", "about"]

export default function Home() {
  const [tab, setTab] = useState("alert triage")
  const [selectedAlert, setSelectedAlert] = useState(null)

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "0 24px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 54, gap: 20 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <polygon points="11,2 20,7 20,15 11,20 2,15 2,7" stroke="var(--green)" strokeWidth="1.5" fill="none" />
              <polygon points="11,6 16,9 16,14 11,17 6,14 6,9" stroke="var(--green)" strokeWidth="1" fill="var(--green-dim)" />
              <circle cx="11" cy="11" r="2" fill="var(--green)" />
            </svg>
            <span style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: 15, color: "var(--text)", letterSpacing: "-0.01em" }}>
              CyberGuard<span style={{ color: "var(--green)" }}>_</span>
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)", background: "var(--green-dim)", border: "1px solid #2A5A32", padding: "2px 7px", borderRadius: 3, letterSpacing: "0.05em" }}>
              by Antigravati
            </span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", gap: 2, marginLeft: 8 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => setTab(item)}
                style={{
                  fontFamily: "var(--mono)", fontSize: 12, padding: "6px 14px",
                  borderRadius: 5, border: "none", cursor: "pointer",
                  background: tab === item ? "var(--border)" : "transparent",
                  color: tab === item ? "var(--text)" : "var(--muted)",
                  textTransform: "lowercase", letterSpacing: "0.02em",
                }}
              >{item}</button>
            ))}
          </nav>

          <div style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
            <span style={{ animation: "blink 1.2s ease infinite", color: "var(--green)", marginRight: 6 }}>●</span>
            GROQ · Llama 3.3 70B · Free tier
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "24px" }}>

        {tab === "alert triage" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
            <AlertTriage onAlertSelect={setSelectedAlert} />
            <div style={{ position: "sticky", top: 78 }}>
              <SecurityChat alertContext={selectedAlert} />
            </div>
          </div>
        )}

        {tab === "ai analyst" && (
          <div style={{ maxWidth: 740, margin: "0 auto" }}>
            <SecurityChat alertContext={null} />
          </div>
        )}

        {tab === "about" && (
          <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px 30px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>
                CyberGuard MVP
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Agentic SOC platform · by Antigravati</div>

              {[
                ["Problem", "Mid-market companies face enterprise-scale threats with fractional security budgets. A team of 1–2 analysts can triage ~20 alerts/day. Attackers are generating thousands."],
                ["Solution", "AI agents that autonomously triage alerts, investigate incidents, and surface prioritised actions — so your analysts spend time on real threats, not noise."],
                ["Free stack", "Groq API (Llama 3.3 70B, free) + Wazuh OSS (open-source SIEM) + Next.js on Vercel (free hosting). Total infrastructure cost: ₹0."],
                ["Revenue model", "Charge ₹15,000–50,000/month per company with a 1–5 person IT team. One sale covers 6 months of cloud costs. Target: 10 SMBs in month 3."],
              ].map(([title, body]) => (
                <div key={title} style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "var(--blue)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>{title}</div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{body}</p>
                </div>
              ))}

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>Week-by-week MVP plan</div>
                {[
                  ["Week 1", "This app — AI alert triage + security chat + simulator. Share with 5 IT managers. Collect feedback."],
                  ["Week 2", "Connect real Wazuh SIEM. Add phishing email analyser. First paying pilot customer."],
                  ["Week 3", "Automated Slack/email notifications. Dashboard with metrics. Pitch deck ready. Onboard 3 SMBs."],
                ].map(([week, goal]) => (
                  <div key={week} style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--green)", minWidth: 54, flexShrink: 0 }}>{week}</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "14px 24px", textAlign: "center" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--faint)" }}>
          CyberGuard by Antigravati · 100% free stack · Groq + Wazuh OSS + Vercel
        </span>
      </footer>
    </div>
  )
}
