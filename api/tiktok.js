export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.QUANTICDATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "QUANTICDATA_API_KEY belum diatur di Vercel."
    });
  }

  const videoUrl = String(req.query.url || "").trim();

  if (!videoUrl) {
    return res.status(400).json({
      error: "Link video TikTok wajib diisi."
    });
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(videoUrl);
  } catch {
    return res.status(400).json({
      error: "Link tidak valid."
    });
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  if (
    hostname !== "tiktok.com" &&
    !hostname.endsWith(".tiktok.com")
  ) {
    return res.status(400).json({
      error: "Masukkan link TikTok yang valid."
    });
  }

  try {
    const response = await fetch(
      "https://api.quanticdata.io/v1/scraper/collectors/tiktok_video/run",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          videos: [videoUrl],
          max_results: 1
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("QuanticData error:", data);

      return res.status(response.status).json({
        error: "Data TikTok tidak dapat diambil."
      });
    }

    const results =
      data?.payload?.results ||
      data?.results ||
      [];

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(404).json({
        error: "Data video TikTok tidak ditemukan."
      });
    }

    const video = results[0];

    return res.status(200).json({
      video_id: video.video_id,
      url: video.url || videoUrl,
      description: video.description || "",
      created_at: video.created_at || null,
      views: video.views ?? 0,
      likes: video.likes ?? 0,
      comments: video.comments ?? 0,
      shares: video.shares ?? 0,
      saves: video.saves ?? 0,
      fetched_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("TikTok API error:", error);

    return res.status(500).json({
      error: "Gagal mengambil data TikTok."
    });
  }
}
