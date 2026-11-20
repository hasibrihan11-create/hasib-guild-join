// Vercel serverless API route.
// Configure JOIN_API_URL in Vercel Environment Variables.
// Adapt the request/response mapping below to the official API documentation.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const { uid, password, guild_id, region } = req.body || {};
  if (!uid || !password || !guild_id || !region) {
    return res.status(400).json({ ok: false, error: "uid, password, guild_id and region are required" });
  }
  const endpoint = process.env.JOIN_API_URL;
  if (!endpoint) return res.status(503).json({ ok: false, error: "Server is not configured: JOIN_API_URL is missing" });

  try {
    // Generic adapter payload. Change field names/method/auth only to match the API's documented contract.
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.JOIN_API_TOKEN ? { Authorization: `Bearer ${process.env.JOIN_API_TOKEN}` } : {}) },
      body: JSON.stringify({ uid: String(uid), password: String(password), guild_id: String(guild_id), region: String(region) })
    });
    const raw = await upstream.text();
    let data; try { data = JSON.parse(raw); } catch { data = { message: raw.slice(0, 500) }; }
    if (!upstream.ok) return res.status(502).json({ ok: false, error: data.error || data.message || `Upstream API returned ${upstream.status}` });
    // Adjust this success check to the official API's response format.
    const success = data.ok === true || data.success === true || data.status === "success";
    return res.status(200).json({ ok: success, message: data.message || data.msg || (success ? "Joined" : "API response did not confirm success") });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "Could not reach the join API" });
  }
}