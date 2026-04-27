// lib/alertSimulator.js
// When no Wazuh instance is configured, this generates realistic security
// alerts so you can demo and develop the AI triage engine immediately.

const ALERT_TEMPLATES = [
  {
    rule: { id: 5710, description: "SSH brute force attempt", level: 10, mitre: { tactic: ["Credential Access"], technique: ["T1110"] } },
    agent: { name: "prod-web-01", ip: "10.0.1.15" },
    data: { srcip: "185.220.101.47", dstport: 22, attempts: 142 },
    location: "/var/log/auth.log",
  },
  {
    rule: { id: 31101, description: "Suspicious PowerShell execution detected", level: 12, mitre: { tactic: ["Execution"], technique: ["T1059.001"] } },
    agent: { name: "workstation-HR-03", ip: "10.0.2.54" },
    data: { command: "powershell -enc JABjAGwAaQBlAG4AdA...", user: "jsmith" },
    location: "WinEvtLog:Microsoft-Windows-PowerShell/Operational",
  },
  {
    rule: { id: 87700, description: "Possible phishing email attachment opened", level: 9, mitre: { tactic: ["Initial Access"], technique: ["T1566.001"] } },
    agent: { name: "workstation-FIN-07", ip: "10.0.3.21" },
    data: { filename: "Invoice_April_2026.xlsm", user: "priya.mehta", email_sender: "billing@xn--invoce-m1a.com" },
    location: "Microsoft-Office-Events",
  },
  {
    rule: { id: 80792, description: "Outbound connection to known C2 IP", level: 13, mitre: { tactic: ["Command and Control"], technique: ["T1071"] } },
    agent: { name: "prod-db-02", ip: "10.0.1.22" },
    data: { dstip: "91.243.44.133", dstport: 4444, protocol: "TCP", bytes_out: 18240 },
    location: "Suricata-IDS",
  },
  {
    rule: { id: 5402, description: "sudo privilege escalation — unusual user", level: 8, mitre: { tactic: ["Privilege Escalation"], technique: ["T1548.003"] } },
    agent: { name: "prod-api-03", ip: "10.0.1.31" },
    data: { user: "deploy_bot", command: "/bin/bash", tty: "pts/1" },
    location: "/var/log/auth.log",
  },
  {
    rule: { id: 510, description: "AWS S3 bucket made publicly accessible", level: 11, mitre: { tactic: ["Exfiltration"], technique: ["T1537"] } },
    agent: { name: "aws-cloudtrail", ip: "52.94.133.131" },
    data: { bucket: "antigravati-customer-exports", actor: "IAMUser/jenkins-deploy", region: "ap-south-1" },
    location: "AWS-CloudTrail",
  },
  {
    rule: { id: 31530, description: "Ransomware-like file extension mass rename", level: 15, mitre: { tactic: ["Impact"], technique: ["T1486"] } },
    agent: { name: "fileserver-01", ip: "10.0.5.10" },
    data: { files_renamed: 847, extension: ".locked", user: "anonymous", share: "\\\\fileserver-01\\Finance" },
    location: "WinEvtLog:Security",
  },
  {
    rule: { id: 100200, description: "Multiple failed logins then success — possible account takeover", level: 10, mitre: { tactic: ["Credential Access"], technique: ["T1078"] } },
    agent: { name: "okta-idp", ip: "34.102.136.180" },
    data: { user: "rahul.kumar@company.in", failed_attempts: 8, success_ip: "197.234.240.0", country: "NL" },
    location: "Okta-System-Log",
  },
]

export function generateAlert() {
  const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)]
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...template,
    status: "open",
  }
}

export function generateAlertBatch(count = 5) {
  return Array.from({ length: count }, generateAlert)
}
