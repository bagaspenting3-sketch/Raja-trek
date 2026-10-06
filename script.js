"use strict";

console.log(
  "================================"
);

console.log(
  "TikTok Stats Finder"
);

console.log(
  "script.js berhasil dimuat"
);

console.log(
  "================================"
);


// ==========================================
// ELEMENT HTML
// ==========================================

const searchForm =
  document.getElementById(
    "searchForm"
  );

const videoInput =
  document.getElementById(
    "videoUrl"
  );

const checkButton =
  document.getElementById(
    "checkButton"
  );

const errorBox =
  document.getElementById(
    "error"
  );

const loadingBox =
  document.getElementById(
    "loading"
  );

const resultBox =
  document.getElementById(
    "result"
  );

const videoIdElement =
  document.getElementById(
    "videoId"
  );

const openTikTok =
  document.getElementById(
    "openTikTok"
  );

const descriptionElement =
  document.getElementById(
    "description"
  );

const viewsElement =
  document.getElementById(
    "views"
  );

const likesElement =
  document.getElementById(
    "likes"
  );

const commentsElement =
  document.getElementById(
    "comments"
  );

const sharesElement =
  document.getElementById(
    "shares"
  );

const savesElement =
  document.getElementById(
    "saves"
  );

const createdAtElement =
  document.getElementById(
    "createdAt"
  );

const fetchedAtElement =
  document.getElementById(
    "fetchedAt"
  );


// ==========================================
// CEK HTML
// ==========================================

console.log(
  "searchForm:",
  !!searchForm
);

console.log(
  "videoInput:",
  !!videoInput
);

console.log(
  "checkButton:",
  !!checkButton
);

console.log(
  "errorBox:",
  !!errorBox
);

console.log(
  "loadingBox:",
  !!loadingBox
);

console.log(
  "resultBox:",
  !!resultBox
);


// ==========================================
// ERROR
// ==========================================

function showError(message) {

  console.error(
    "ERROR:",
    message
  );

  if (!errorBox) {
    return;
  }

  errorBox.textContent =
    message;

  errorBox.classList.remove(
    "hidden"
  );
}


function hideError() {

  if (!errorBox) {
    return;
  }

  errorBox.textContent =
    "";

  errorBox.classList.add(
    "hidden"
  );
}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

  if (!loadingBox) {
    return;
  }

  loadingBox.classList.remove(
    "hidden"
  );
}


function hideLoading() {

  if (!loadingBox) {
    return;
  }

  loadingBox.classList.add(
    "hidden"
  );
}


// ==========================================
// FORMAT NUMBER
// ==========================================

function formatNumber(value) {

  const number =
    Number(value || 0);

  return number.toLocaleString(
    "id-ID"
  );
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(value) {

  if (!value) {
    return "-";
  }

  try {

    return new Date(
      value
    ).toLocaleString(
      "id-ID"
    );

  } catch {

    return value;
  }
}


// ==========================================
// REQUEST API
// ==========================================

async function getTikTokStats(
  videoUrl
) {

  console.log(
    "================================"
  );

  console.log(
    "STEP 1"
  );

  console.log(
    "URL INPUT:",
    videoUrl
  );


  // ========================================
  // VALIDASI URL FRONTEND
  // ========================================

  try {

    const parsed =
      new URL(videoUrl);

    console.log(
      "URL valid:"
    );

    console.log({
      protocol:
        parsed.protocol,

      hostname:
        parsed.hostname,

      pathname:
        parsed.pathname
    });

  } catch {

    throw new Error(
      "Link TikTok tidak valid."
    );
  }


  // ========================================
  // URL API VERCEL
  // ========================================

  const apiUrl =
    "/api/tiktok?url=" +
    encodeURIComponent(
      videoUrl
    );


  console.log(
    "STEP 2"
  );

  console.log(
    "Request:",
    apiUrl
  );


  // ========================================
  // FETCH
  // ========================================

  let response;

  try {

    response =
      await fetch(
        apiUrl,
        {
          method:
            "GET",

          headers: {
            "Accept":
              "application/json"
          }
        }
      );

  } catch (error) {

    console.error(
      "FETCH ERROR:",
      error
    );

    throw new Error(
      "Tidak dapat terhubung ke server Vercel."
    );
  }


  // ========================================
  // STATUS
  // ========================================

  console.log(
    "STEP 3"
  );

  console.log({
    status:
      response.status,

    statusText:
      response.statusText,

    ok:
      response.ok,

    url:
      response.url
  });


  // ========================================
  // BACA RESPONSE
  // ========================================

  const raw =
    await response.text();


  console.log(
    "STEP 4"
  );

  console.log(
    "RAW RESPONSE:"
  );

  console.log(
    raw
  );


  // ========================================
  // RESPONSE KOSONG
  // ========================================

  if (!raw) {

    throw new Error(
      "Server mengembalikan response kosong."
    );
  }


  // ========================================
  // PARSE JSON
  // ========================================

  let data;

  try {

    data =
      JSON.parse(raw);

  } catch (error) {

    console.error(
      "JSON ERROR:",
      error
    );

    throw new Error(
      "Server mengembalikan response yang bukan JSON."
    );
  }


  console.log(
    "STEP 5"
  );

  console.log(
    "JSON:",
    data
  );


  // ========================================
  // HTTP ERROR
  // ========================================

  if (!response.ok) {

    throw new Error(
      data.error ||
      data.message ||
      `HTTP Error ${response.status}`
    );
  }


  // ========================================
  // API ERROR
  // ========================================

  if (
    data.success === false
  ) {

    throw new Error(
      data.error ||
      "API gagal mengambil data."
    );
  }


  // ========================================
  // SUCCESS
  // ========================================

  console.log(
    "STEP 6"
  );

  console.log(
    "DATA BERHASIL:"
  );

  console.log(
    data
  );


  return data;
}


// ==========================================
// TAMPILKAN HASIL
// ==========================================

function displayResult(
  data
) {

  console.log(
    "Menampilkan hasil..."
  );


  // ========================================
  // VIDEO ID
  // ========================================

  if (videoIdElement) {

    videoIdElement.textContent =
      `Video ID: ${
        data.video_id ||
        "-"
      }`;
  }


  // ========================================
  // OPEN TIKTOK
  // ========================================

  if (openTikTok) {

    openTikTok.href =
      data.url ||
      "#";
  }


  // ========================================
  // DESCRIPTION
  // ========================================

  if (
    descriptionElement
  ) {

    if (
      data.description
    ) {

      descriptionElement.textContent =
        data.description;

      descriptionElement.classList.remove(
        "hidden"
      );

    } else {

      descriptionElement.classList.add(
        "hidden"
      );
    }
  }


  // ========================================
  // STATS
  // ========================================

  if (viewsElement) {

    viewsElement.textContent =
      formatNumber(
        data.views
      );
  }


  if (likesElement) {

    likesElement.textContent =
      formatNumber(
        data.likes
      );
  }


  if (commentsElement) {

    commentsElement.textContent =
      formatNumber(
        data.comments
      );
  }


  if (sharesElement) {

    sharesElement.textContent =
      formatNumber(
        data.shares
      );
  }


  if (savesElement) {

    savesElement.textContent =
      formatNumber(
        data.saves
      );
  }


  // ========================================
  // DATE
  // ========================================

  if (createdAtElement) {

    createdAtElement.textContent =
      formatDate(
        data.created_at
      );
  }


  if (fetchedAtElement) {

    fetchedAtElement.textContent =
      formatDate(
        data.fetched_at
      );
  }


  // ========================================
  // SHOW RESULT
  // ========================================

  if (resultBox) {

    resultBox.classList.remove(
      "hidden"
    );
  }
}


// ==========================================
// FORM
// ==========================================

if (searchForm) {

  searchForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      console.log(
        "================================"
      );

      console.log(
        "FORM SUBMIT"
      );

      console.log(
        "================================"
      );


      hideError();


      if (resultBox) {

        resultBox.classList.add(
          "hidden"
        );
      }


      const videoUrl =
        videoInput
          ? videoInput.value.trim()
          : "";


      console.log(
        "Input:",
        videoUrl
      );


      // ====================================
      // KOSONG
      // ====================================

      if (!videoUrl) {

        showError(
          "Masukkan link video TikTok."
        );

        return;
      }


      // ====================================
      // LOADING
      // ====================================

      showLoading();


      // ====================================
      // REQUEST
      // ====================================

      try {

        const data =
          await getTikTokStats(
            videoUrl
          );


        displayResult(
          data
        );


      } catch (error) {

        console.error(
          "================================"
        );

        console.error(
          "REQUEST GAGAL"
        );

        console.error(
          error
        );

        console.error(
          "================================"
        );


        showError(
          error.message ||
          "Terjadi kesalahan."
        );

      } finally {

        hideLoading();

      }
    }
  );

} else {

  console.error(
    "FORM #searchForm TIDAK DITEMUKAN!"
  );
}


// ==========================================
// ENTER
// ==========================================

if (videoInput) {

  videoInput.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        if (searchForm) {

          searchForm.requestSubmit();

        }
      }
    }
  );
}


// ==========================================
// READY
// ==========================================

console.log(
  "================================"
);

console.log(
  "SCRIPT READY"
);

console.log(
  "TikTok Stats Finder siap digunakan."
);

console.log(
  "================================"
);
