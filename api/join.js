// Vercel serverless API route.
// Calls the supplied GET endpoint without a region parameter.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { uid, password, guild_id } = req.body || {};
  if (!uid || !password || !guild_id) {
    return res.status(400).json({ ok: false, error: "uid, password and guild_id are required" });
  }

  const template = process.env.JOIN_API_URL ||
    "https://danger-guild-management-web.vercel.app/join?guild_id={guild_id}&uid={guest_uid}&password={guest_pw}";

  try {
    const url = new URL(template);
    // Substitute placeholders safely; URLSearchParams handles escaping.
    const rendered = template
      .replaceAll("{guild_id}", encodeURIComponent(String(guild_id)))
      .replaceAll("{guest_uid}", encodeURIComponent(String(uid)))
      .replaceAll("{guest_pw}", encodeURIComponent(String(password)));

    const upstream = await fetch(rendered, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = { message: raw.slice(0, 500) }; }

    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: data.error || data.message || `Join API returned ${upstream.status}` });
    }

    // Accept common explicit success indicators; inspect actual API response to refine if needed.
    const status = String(data.status || "").toLowerCase();
    const success = data.ok === true || data.success === true ||
      ["success", "joined", "ok"].includes(status);

    return res.status(200).json({
      ok: success,
      message: data.message || data.msg || (success ? "Join request successful" : "API response did not confirm success")
    });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "Could not reach the join API" });
  }
}