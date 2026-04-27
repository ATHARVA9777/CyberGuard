"use client"

// ─── Severity badge ────────────────────────────────────────────
export function SevBadge({ level }) {
  const map = {
    CRITICAL: { bg: "#3A1410", color: "#F85149", border: "#5A2820" },
    HIGH:     { bg: "#3A2D0F", color: "#E3B341", border: "#5A450F" },
    MEDIUM:   { bg: "#0F2236", color: "#58A6FF", border: "#1E3A55" },
    LOW:      { bg: "#1A3A22", color: "#3FB950", border: "#2A5A32" },
  }
  const s = map[level] || map.MEDIUM
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
      padding: "3px 9px", borderRadius: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: "0.06em",
    }}>{level}</span>
  )
}

// ─── Verdict badge ─────────────────────────────────────────────
export function VerdictBadge({ verdict }) {
  const map = {
    TRUE_POSITIVE:       { color: "#F85149", label: "TRUE POSITIVE" },
    FALSE_POSITIVE:      { color: "#3FB950", label: "FALSE POSITIVE" },
    NEEDS_INVESTIGATION: { color: "#E3B341", label: "NEEDS INVESTIGATION" },
  }
  const s = map[verdict] || map.NEEDS_INVESTIGATION
  return (
    <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: s.color, letterSpacing: "0.05em" }}>
      ◆ {s.label}
    </span>
  )
}

// ─── Terminal spinner ─────────────────────────────────────────
export function Spinner({ label = "AI analysing..." }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 13, marginTop: 12 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
        <circle cx="8" cy="8" r="6" fill="none" stroke="var(--border-hi)" strokeWidth="2" />
        <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {label}
    </div>
  )
}

// ─── Error ────────────────────────────────────────────────────
export function ErrBox({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      marginTop: 10, padding: "10px 14px", background: "var(--red-dim)",
      border: "1px solid #5A2820", borderRadius: "var(--radius)",
      color: "var(--red)", fontFamily: "var(--mono)", fontSize: 13,
    }}>⚠ {msg}</div>
  )
}

// ─── Terminal card ─────────────────────────────────────────────
export function TCard({ children, style: extra = {} }) {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "20px 22px",
      ...extra,
    }}>{children}</div>
  )
}

// ─── Section label ─────────────────────────────────────────────
export function SLabel({ children, color = "var(--muted)" }) {
  return (
    <div style={{
      fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
      color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8,
    }}>{children}</div>
  )
}

// ─── Primary button ────────────────────────────────────────────
export function Btn({ children, onClick, disabled, variant = "primary", style: extra = {} }) {
  const styles = {
    primary: { background: disabled ? "var(--border)" : "var(--blue)", color: disabled ? "var(--muted)" : "#000" },
    ghost:   { background: "transparent", color: "var(--muted)", border: "1px solid var(--border)" },
    danger:  { background: "var(--red-dim)", color: "var(--red)", border: "1px solid #5A2820" },
    success: { background: "var(--green-dim)", color: "var(--green)", border: "1px solid #2A5A32" },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "9px 20px", borderRadius: "var(--radius)",
        fontFamily: "var(--mono)", fontWeight: 600, fontSize: 13,
        letterSpacing: "0.03em", ...styles[variant], ...extra,
      }}
    >{children}</button>
  )
}

// ─── Confidence bar ────────────────────────────────────────────
export function ConfBar({ value }) {
  const color = value >= 80 ? "var(--red)" : value >= 50 ? "var(--yellow)" : "var(--green)"
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color, minWidth: 36 }}>{value}%</span>
    </div>
  )
}

// ─── Mono code block ───────────────────────────────────────────
export function CodeBlock({ children }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "10px 14px",
      fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)", lineHeight: 1.7,
      whiteSpace: "pre-wrap", wordBreak: "break-word",
    }}>{children}</div>
  )
}
