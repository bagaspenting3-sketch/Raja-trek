export default async function handler(req, res) {
  // ==========================================
  // METHOD
  // ==========================================

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // ==========================================
  // API KEY
  // ==========================================

  const apiKey =
    process.env.QUANTICDATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error:
        "QUANTICDATA_API_KEY belum diatur di Vercel."
    });
  }

  // ==========================================
  // AMBIL URL
  // ==========================================

  const inputUrl =
    String(req.query.url || "").trim();

  if (!inputUrl) {
    return res.status(400).json({
      success: false,
      error:
        "Link video TikTok wajib diisi."
    });
  }

  // ==========================================
  // VALIDASI URL
  // ==========================================

  let parsedUrl;

  try {
    parsedUrl =
      new URL(inputUrl);
  } catch {
    return res.status(400).json({
      success: false,
      error:
        "Link TikTok tidak valid."
    });
  }

  const hostname =
    parsedUrl.hostname.toLowerCase();

  const isTikTok =
    hostname === "tiktok.com" ||
    hostname.endsWith(".tiktok.com");

  if (!isTikTok) {
    return res.status(400).json({
      success: false,
      error:
        "Masukkan link TikTok yang valid."
    });
  }

  // ==========================================
  // URL FINAL
  // ==========================================

  let finalUrl = inputUrl;

  // ==========================================
  // HANDLE SHORT URL
  // ==========================================

  if (
    hostname === "vt.tiktok.com" ||
    hostname === "vm.tiktok.com"
  ) {
    try {
      console.log(
        "Short URL:",
        inputUrl
      );

      const redirectResponse =
        await fetch(inputUrl, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36",
            "Accept":
              "text/html,application/xhtml+xml"
          }
        });

      finalUrl =
        redirectResponse.url ||
        inputUrl;

      console.log(
        "Redirect URL:",
        finalUrl
      );

    } catch (error) {
      console.error(
        "Short URL error:",
        error
      );

      return res.status(502).json({
        success: false,
        error:
          "Gagal mengikuti link pendek TikTok.",
        details:
          error.message
      });
    }
  }

  // ==========================================
  // VALIDASI URL HASIL REDIRECT
  // ==========================================

  let finalParsed;

  try {
    finalParsed =
      new URL(finalUrl);
  } catch {
    return res.status(400).json({
      success: false,
      error:
        "URL TikTok hasil redirect tidak valid."
    });
  }

  const finalHostname =
    finalParsed.hostname.toLowerCase();

  const finalIsTikTok =
    finalHostname === "tiktok.com" ||
    finalHostname.endsWith(".tiktok.com");

  if (!finalIsTikTok) {
    return res.status(400).json({
      success: false,
      error:
        "Link tidak mengarah ke TikTok.",
      final_url:
        finalUrl
    });
  }

  console.log(
    "URL yang dikirim ke QuanticData:",
    finalUrl
  );

  // ==========================================
  // QUANTICDATA
  // ==========================================

  try {
    const response =
      await fetch(
        "https://api.quanticdata.io/v1/scraper/collectors/tiktok_video/run",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",

            "Accept":
              "application/json"
          },

          body: JSON.stringify({
            videos: [
              finalUrl
            ],

            max_results: 1
          })
        }
      );

    // ========================================
    // BACA SEBAGAI TEXT DULU
    // ========================================

    const raw =
      await response.text();

    console.log(
      "QuanticData status:",
      response.status
    );

    console.log(
      "QuanticData response:",
      raw
    );

    // ========================================
    // PARSE JSON
    // ========================================

    let data;

    try {
      data =
        JSON.parse(raw);
    } catch {
      return res.status(502).json({
        success: false,
        error:
          "QuanticData mengembalikan response bukan JSON.",

        status:
          response.status,

        response:
          raw.substring(0, 1000)
      });
    }

    // ========================================
    // CEK STATUS QUANTICDATA
    // ========================================

    if (!response.ok) {
      return res.status(502).json({
        success: false,

        error:
          "QuanticData gagal mengambil data TikTok.",

        status:
          response.status,

        details:
          data?.message ||
          data?.error ||
          data
      });
    }

    // ========================================
    // CARI RESULTS
    // ========================================

    const results =
      data?.payload?.results ||
      data?.results ||
      [];

    if (
      !Array.isArray(results) ||
      results.length === 0
    ) {
      return res.status(404).json({
        success: false,

        error:
          "Data video TikTok tidak ditemukan.",

        url:
          finalUrl,

        response:
          data
      });
    }

    const video =
      results[0];

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      video_id:
        video.video_id ??
        null,

      url:
        video.url ||
        finalUrl,

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
      "Server error:",
      error
    );

    return res.status(500).json({
      success: false,

      error:
        "Terjadi error pada server.",

      details:
        error.message
    });
  }
}
