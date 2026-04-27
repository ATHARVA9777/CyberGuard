"use client"
import { useState } from "react"
import { SevBadge, VerdictBadge, Spinner, ErrBox, TCard, SLabel, Btn, ConfBar, CodeBlock } from "./ui"

export default function AlertTriage({ onAlertSelect }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [analysing, setAnalysing] = useState(null) // alert id being analysed
  const [analyses, setAnalyses] = useState({})    // alertId → analysis result
  const [expanded, setExpanded] = useState(null)
  const [err, setErr] = useState("")
  const [source, setSource] = useState("")

  async function fetchAlerts() {
    setLoading(true); setErr("")
    try {
      const res = await fetch("/api/simulate?count=5")
      const data = await res.json()
      setAlerts(data.alerts)
      setSource(data.source)
      setAnalyses({})
      setExpanded(null)
    } catch (e) { setErr(e.message) }
    setLoading(false)
  }

  async function analyseAlert(alert) {
    setAnalysing(alert.id); setErr("")
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalyses(prev => ({ ...prev, [alert.id]: data.analysis }))
      setExpanded(alert.id)
      onAlertSelect?.({ alert, analysis: data.analysis })
    } catch (e) { setErr(e.message) }
    setAnalysing(null)
  }

  const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
  const sortedAlerts = [...alerts].sort((a, b) => (b.rule?.level || 0) - (a.rule?.level || 0))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <TCard>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <SLabel color="var(--green)">// ALERT QUEUE</SLabel>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)" }}>
              {source === "simulator" ? "⚡ Live simulator — plug in Wazuh for real alerts" : "🔴 Connected to Wazuh SIEM"}
            </div>
          </div>
          <Btn onClick={fetchAlerts} disabled={loading}>
            {loading ? "Fetching..." : alerts.length ? "Refresh alerts" : "Pull alerts →"}
          </Btn>
        </div>
        {loading && <Spinner label="Pulling alerts from SIEM..." />}
        <ErrBox msg={err} />
      </TCard>

      {sortedAlerts.map((alert) => {
        const analysis = analyses[alert.id]
        const isAnalysing = analysing === alert.id
        const isExpanded = expanded === alert.id
        const level = alert.rule?.level || 0

        return (
          <TCard key={alert.id} style={{ animation: "fadeUp 0.3s ease" }}>
            {/* Alert header */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700,
                color: level >= 12 ? "var(--red)" : level >= 8 ? "var(--yellow)" : "var(--blue)",
                minWidth: 28, flexShrink: 0,
              }}>{level}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                  {alert.rule?.description}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
                    {alert.agent?.name} · {alert.agent?.ip}
                  </span>
                  {alert.rule?.mitre?.tactic?.map(t => (
                    <span key={t} style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 7px", background: "var(--purple-dim)", color: "var(--purple)", borderRadius: 3 }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--faint)", marginTop: 3 }}>
                  {alert.rule?.mitre?.technique?.join(", ")} · {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                {analysis && <VerdictBadge verdict={analysis.verdict} />}
                <Btn
                  onClick={() => isExpanded && analysis ? setExpanded(null) : analyseAlert(alert)}
                  disabled={isAnalysing}
                  variant={analysis ? "ghost" : "primary"}
                  style={{ fontSize: 12, padding: "7px 14px" }}
                >
                  {isAnalysing ? "Thinking..." : analysis ? (isExpanded ? "Collapse" : "Show report") : "Triage with AI →"}
                </Btn>
              </div>
            </div>

            {isAnalysing && <Spinner label="AI agent investigating alert..." />}

            {/* Raw alert data */}
            <details style={{ marginTop: 8 }}>
              <summary style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--faint)", cursor: "pointer" }}>Raw alert data ▾</summary>
              <CodeBlock style={{ marginTop: 8 }}>{JSON.stringify(alert.data, null, 2)}</CodeBlock>
            </details>

            {/* AI analysis report */}
            {analysis && isExpanded && (
              <div style={{ marginTop: 18, borderTop: "1px solid var(--border)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.3s ease" }}>

                {/* Summary row */}
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start" }}>
                  <div style={{ textAlign: "center" }}>
                    <SevBadge level={analysis.severity} />
                    <div style={{ marginTop: 8 }}>
                      <SLabel>Confidence</SLabel>
                      <ConfBar value={analysis.confidence} />
                    </div>
                  </div>
                  <div>
                    <SLabel>Threat summary</SLabel>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text)", lineHeight: 1.65 }}>{analysis.threat_summary}</p>
                    <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>Stage: <span style={{ color: "var(--yellow)" }}>{analysis.attack_stage}</span></span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>Actor: <span style={{ color: "var(--purple)" }}>{analysis.likely_attacker}</span></span>
                    </div>
                  </div>
                </div>

                {/* Blast radius */}
                <div style={{ background: analysis.escalate ? "var(--red-dim)" : "var(--surface)", border: `1px solid ${analysis.escalate ? "#5A2820" : "var(--border)"}`, borderRadius: "var(--radius)", padding: "10px 14px" }}>
                  <SLabel color={analysis.escalate ? "var(--red)" : "var(--muted)"}>{analysis.escalate ? "⚠ ESCALATE — " : ""}Blast radius</SLabel>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 13, color: analysis.escalate ? "var(--red)" : "var(--text)" }}>{analysis.blast_radius}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {/* Immediate actions */}
                  <div>
                    <SLabel color="var(--red)">Immediate actions</SLabel>
                    <ol style={{ paddingLeft: 18 }}>
                      {analysis.immediate_actions?.map((a, i) => (
                        <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text)", marginBottom: 5, lineHeight: 1.5 }}>{a}</li>
                      ))}
                    </ol>
                  </div>
                  {/* Log queries */}
                  <div>
                    <SLabel color="var(--blue)">Hunt queries</SLabel>
                    {analysis.investigation_queries?.map((q, i) => (
                      <div key={i} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--blue)", background: "var(--blue-dim)", borderRadius: 4, padding: "5px 8px", marginBottom: 5, lineHeight: 1.6, wordBreak: "break-all" }}>{q}</div>
                    ))}
                  </div>
                </div>

                {/* FP indicators + threat intel */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <SLabel>False positive indicators</SLabel>
                    <ul style={{ paddingLeft: 16 }}>
                      {analysis.false_positive_indicators?.map((f, i) => (
                        <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <SLabel color="var(--purple)">Threat intel match</SLabel>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{analysis.threat_intel}</p>
                  </div>
                </div>
              </div>
            )}
          </TCard>
        )
      })}

      {!alerts.length && !loading && (
        <TCard style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 32, color: "var(--border)", marginBottom: 12 }}>[ ]</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--muted)" }}>No alerts loaded — click "Pull alerts" to start</div>
        </TCard>
      )}
    </div>
  )
}
