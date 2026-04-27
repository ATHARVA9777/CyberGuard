# CyberGuard — Agentic SOC Platform by Antigravati
### 100% Free Stack · Zero Cost · Unicorn Potential

---

## What this is

An AI-powered Security Operations Center (SOC) tool that autonomously triages security alerts, investigates incidents, and surfaces prioritised actions for lean security teams. Built with:

| Layer | Tool | Cost |
|-------|------|------|
| AI brain | Groq API + Llama 3.3 70B | **Free** (30 req/min, 500K tokens/day) |
| SIEM / log source | Wazuh OSS | **Free** (open-source) |
| Frontend + API | Next.js | **Free** |
| Hosting | Vercel | **Free** (hobby tier) |
| Alert simulator | Built-in | **Free** |

**Total infrastructure cost: ₹0**

---

## 3-Week MVP Plan

### Week 1 — Build & validate (this codebase)
**Goal: Ship the product. Get 5 IT managers to try it.**

- [x] AI alert triage engine (Groq + Llama 3.3 70B)
- [x] Built-in alert simulator (8 realistic attack scenarios)
- [x] Natural-language security analyst chat
- [x] Auto-generated: severity, verdict, confidence, blast radius, MITRE ATT&CK mapping, immediate actions, hunt queries
- [x] Zero-config setup (no Wazuh needed to demo)

**Day 1 actions:**
```bash
git clone <your-repo>
cd cyberguard
cp .env.local .env.local.bak  # already done
# Get free Groq key at https://console.groq.com (no credit card)
# Add GROQ_API_KEY to .env.local
npm install
npm run dev
# → Open http://localhost:3000
```

**Deploy free to Vercel:**
```bash
npm install -g vercel
vercel deploy
# Add GROQ_API_KEY in Vercel dashboard → Settings → Environment Variables
```

**Validate this week:**
- Share the Vercel URL with 5 IT managers at local companies
- Ask: "Would you pay ₹10,000/month for this?"
- Target: 3 say yes → proceed. 1 says yes → pivot slightly. 0 say yes → pivot hard.

---

### Week 2 — Real integration + first customer
**Goal: Connect real Wazuh. Onboard 1 paying pilot.**

**Build list:**
- [ ] Wazuh SIEM connection (replace simulator with real alerts)
- [ ] Phishing email analyser (paste email headers → AI analysis)
- [ ] Automated Slack webhook notifications for CRITICAL alerts
- [ ] Alert history + basic case management (Supabase free tier)

**Wazuh setup (free, self-hosted):**
```bash
# On a spare Ubuntu VM or free Oracle Cloud free tier VM:
curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh
sudo bash ./wazuh-install.sh -a
# Then add WAZUH_API_URL, WAZUH_USER, WAZUH_PASS to .env.local
```

**Pricing for first customer:**
- Free 2-week trial (no credit card)
- ₹15,000/month after trial
- Pitch: "Replaces 1 junior security analyst. Pays for itself."

---

### Week 3 — Scale to 3–5 customers
**Goal: ₹50,000 MRR. Pitch deck ready.**

**Build list:**
- [ ] Multi-tenant: each customer gets their own dashboard
- [ ] Weekly threat report (auto-generated PDF)
- [ ] Compliance report (maps alerts to ISO 27001 / SOC 2 controls)
- [ ] Razorpay payment integration (free to set up)
- [ ] Onboarding flow (1-click Wazuh agent installer script)

**Target customers (Pune/Mumbai):**
- IT managers at 50–500 person companies
- MSSPs (Managed Security Service Providers) who can white-label it
- Fintech startups needing compliance evidence

---

## Architecture

```
Browser (Next.js)
    │
    ├─ /api/simulate → Alert simulator OR Wazuh proxy
    ├─ /api/analyze  → Groq (Llama 3.3 70B) → Structured triage JSON
    └─ /api/chat     → Groq → Natural language security Q&A
```

## Free tools used

- **Groq** — https://console.groq.com (Llama 3.3 70B, no credit card)
- **Wazuh** — https://wazuh.com (open-source SIEM + XDR)
- **Vercel** — https://vercel.com (free hobby hosting)
- **Supabase** — https://supabase.com (free Postgres for week 2)
- **MITRE ATT&CK** — https://attack.mitre.org (free threat framework)
- **AlienVault OTX** — https://otx.alienvault.com (free threat intel feeds)

---

## Unicorn path

| Metric | Month 1 | Month 3 | Month 6 | Year 2 |
|--------|---------|---------|---------|--------|
| Customers | 0 → 1 | 5 | 20 | 200 |
| MRR | ₹0 | ₹75K | ₹3L | ₹30L |
| Stack cost | ₹0 | ₹2K | ₹15K | ₹1L |
| Team size | 1 | 2 | 4 | 20 |

---

*Built by Antigravati — agentic AI for teams that can't afford to be slow.*
