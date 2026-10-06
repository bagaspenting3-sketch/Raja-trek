export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
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

  // =========================
  // VALIDASI URL AWAL
  // =========================

  let parsedUrl;

  try {
    parsedUrl = new URL(videoUrl);
  } catch {
    return res.status(400).json({
      error: "Link tidak valid."
    });
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  const isTikTokDomain =
    hostname === "tiktok.com" ||
    hostname.endsWith(".tiktok.com");

  if (!isTikTokDomain) {
    return res.status(400).json({
      error: "Masukkan link TikTok yang valid."
    });
  }

  // =========================
  // FOLLOW SHORT LINK
  // =========================

  let finalVideoUrl = videoUrl;

  try {
    // Link pendek seperti:
    // https://vt.tiktok.com/ZSb4VMLcr/

    if (
      hostname === "vt.tiktok.com" ||
      hostname === "vm.tiktok.com"
    ) {
      const redirectResponse = await fetch(videoUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36"
        }
      });

      // URL terakhir setelah redirect
      finalVideoUrl = redirectResponse.url;

      console.log("Original URL:", videoUrl);
      console.log("Final URL:", finalVideoUrl);
    }
  } catch (error) {
    console.error("Redirect error:", error);

    return res.status(400).json({
      error: "Link TikTok pendek tidak dapat dibuka."
    });
  }

  // =========================
  // VALIDASI URL HASIL REDIRECT
  // =========================

  let finalParsedUrl;

  try {
    finalParsedUrl = new URL(finalVideoUrl);
  } catch {
    return res.status(400).json({
      error: "URL TikTok hasil redirect tidak valid."
    });
  }

  const finalHostname =
    finalParsedUrl.hostname.toLowerCase();

  const finalIsTikTok =
    finalHostname === "tiktok.com" ||
    finalHostname.endsWith(".tiktok.com");

  if (!finalIsTikTok) {
    return res.status(400).json({
      error: "Link redirect bukan menuju TikTok."
    });
  }

  // =========================
  // REQUEST KE QUANTICDATA
  // =========================

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
          videos: [finalVideoUrl],
          max_results: 1
        })
      }
    );

    const data = await response.json();

    console.log("QuanticData response:", data);

    if (!response.ok) {
      console.error(
        "QuanticData error:",
        data
      );

      return res.status(response.status).json({
        error: "Data TikTok tidak dapat diambil.",
        details: data?.message || data?.error || null
      });
    }

    // =========================
    // AMBIL HASIL
    // =========================

    const results =
      data?.payload?.results ||
      data?.results ||
      [];

    if (
      !Array.isArray(results) ||
      results.length === 0
    ) {
      return res.status(404).json({
        error: "Data video TikTok tidak ditemukan."
      });
    }

    const video = results[0];

    // =========================
    // RESPONSE KE WEBSITE
    // =========================

    return res.status(200).json({
      video_id:
        video.video_id ||
        null,

      url:
        video.url ||
        finalVideoUrl,

      description:
        video.description ||
        "",

      created_at:
        video.created_at ||
        null,

      views:
        video.views ?? 0,

      likes:
        video.likes ?? 0,

      comments:
        video.comments ?? 0,

      shares:
        video.shares ?? 0,

      saves:
        video.saves ?? 0,

      fetched_at:
        new Date().toISOString()
    });

  } catch (error) {
    console.error(
      "TikTok API error:",
      error
    );

    return res.status(500).json({
      error: "Gagal mengambil data TikTok."
    });
  }
}

Yang berubah

Sekarang ketika kamu memasukkan:

https://www.tiktok.com/@jr_official_tiktok/video/7693521058934033670

langsung diproses.

Dan ketika memasukkan:

https://vt.tiktok.com/ZSb4VMLcr/

kode akan mencoba:

vt.tiktok.com
       ↓
redirect
       ↓
www.tiktok.com/@.../video/...
       ↓
QuanticData

Jadi API key tetap aman di Vercel melalui:

process.env.QUANTICDATA_API_KEY

Setelah mengganti file, deploy ulang ke Vercel, lalu coba kedua jenis URL tersebut.

Kalau link "vt.tiktok.com" masih gagal setelah ini, kemungkinan redirect TikTok tidak bisa diikuti dari server Vercel atau QuanticData sendiri tidak menerima URL hasil redirect tertentu. Dalam kasus itu kita bisa ubah kodenya supaya mengambil video ID dari redirect dan mengirim URL canonical secara lebih ketat.
