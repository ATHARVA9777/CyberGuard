// app/api/simulate/route.js
// Returns simulated Wazuh-format alerts for development/demo when
// no real SIEM is connected. Real Wazuh integration replaces this.
export const runtime = "edge"

import { generateAlertBatch } from "../../../lib/alertSimulator"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const count = Math.min(parseInt(searchParams.get("count") || "3"), 10)

  // If a real Wazuh instance is configured, proxy to it instead
  const wazuhUrl = process.env.WAZUH_API_URL
  if (wazuhUrl && wazuhUrl !== "https://your-wazuh-instance:55000") {
    try {
      const creds = Buffer.from(`${process.env.WAZUH_USER}:${process.env.WAZUH_PASS}`).toString("base64")
      const res = await fetch(`${wazuhUrl}/alerts?limit=${count}&sort=-timestamp`, {
        headers: { Authorization: `Basic ${creds}` },
      })
      const data = await res.json()
      return Response.json({ alerts: data.data?.affected_items || [], source: "wazuh" })
    } catch {
      // Fall through to simulator if Wazuh is unreachable
    }
  }

  return Response.json({ alerts: generateAlertBatch(count), source: "simulator" })
}
