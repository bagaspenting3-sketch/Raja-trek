"use strict";

console.log("================================");
console.log("TikTok Stats Finder DEBUG");
console.log("Script berhasil dimuat");
console.log("================================");


// ==========================================
// AMBIL ELEMENT HTML
// ==========================================

const searchForm =
  document.getElementById("searchForm");

const videoInput =
  document.getElementById("videoUrl");

const checkButton =
  document.getElementById("checkButton");

const errorBox =
  document.getElementById("error");

const loadingBox =
  document.getElementById("loading");

const resultBox =
  document.getElementById("result");

const videoIdElement =
  document.getElementById("videoId");

const openTikTok =
  document.getElementById("openTikTok");

const descriptionElement =
  document.getElementById("description");

const viewsElement =
  document.getElementById("views");

const likesElement =
  document.getElementById("likes");

const commentsElement =
  document.getElementById("comments");

const sharesElement =
  document.getElementById("shares");

const savesElement =
  document.getElementById("saves");

const createdAtElement =
  document.getElementById("createdAt");

const fetchedAtElement =
  document.getElementById("fetchedAt");


// ==========================================
// CEK ELEMENT
// ==========================================

console.log("searchForm:", searchForm);
console.log("videoInput:", videoInput);
console.log("checkButton:", checkButton);
console.log("errorBox:", errorBox);
console.log("loadingBox:", loadingBox);
console.log("resultBox:", resultBox);


// ==========================================
// HELPER
// ==========================================

function showError(message) {

  console.error(
    "[ERROR]",
    message
  );

  if (errorBox) {

    errorBox.textContent =
      message;

    errorBox.classList.remove(
      "hidden"
    );
  }
}


function hideError() {

  if (errorBox) {

    errorBox.textContent =
      "";

    errorBox.classList.add(
      "hidden"
    );
  }
}


function showLoading() {

  if (loadingBox) {

    loadingBox.classList.remove(
      "hidden"
    );
  }
}


function hideLoading() {

  if (loadingBox) {

    loadingBox.classList.add(
      "hidden"
    );
  }
}


// ==========================================
// API REQUEST
// ==========================================

async function getTikTokStats(videoUrl) {

  console.log(
    "================================"
  );

  console.log(
    "STEP 1 - URL INPUT"
  );

  console.log(
    videoUrl
  );


  // ========================================
  // VALIDASI URL
  // ========================================

  let parsedUrl;

  try {

    parsedUrl =
      new URL(videoUrl);

  } catch (error) {

    console.error(
      "URL INVALID:",
      error
    );

    throw new Error(
      "Link TikTok tidak valid."
    );
  }


  console.log(
    "STEP 2 - URL VALID"
  );

  console.log({
    protocol:
      parsedUrl.protocol,

    hostname:
      parsedUrl.hostname,

    pathname:
      parsedUrl.pathname
  });


  // ========================================
  // BUAT URL API
  // ========================================

  const apiUrl =
    `/api/tiktok?url=${encodeURIComponent(
      videoUrl
    )}`;


  console.log(
    "STEP 3 - API URL"
  );

  console.log(
    apiUrl
  );


  // ========================================
  // FETCH API
  // ========================================

  let response;

  try {

    console.log(
      "STEP 4 - REQUEST KE VERCEL"
    );

    response =
      await fetch(
        apiUrl,
        {
          method: "GET",

          headers: {
            Accept:
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
    "STEP 5 - RESPONSE"
  );

  console.log({
    status:
      response.status,

    statusText:
      response.statusText,

    ok:
      response.ok,

    url:
      response.url,

    redirected:
      response.redirected
  });


  // ========================================
  // HEADERS
  // ========================================

  const headers = {};

  response.headers.forEach(
    (value, key) => {

      headers[key] =
        value;

    }
  );

  console.log(
    "STEP 6 - RESPONSE HEADERS"
  );

  console.log(
    headers
  );


  // ========================================
  // BACA TEXT
  // ========================================

  let raw;

  try {

    raw =
      await response.text();

  } catch (error) {

    console.error(
      "READ RESPONSE ERROR:",
      error
    );

    throw new Error(
      "Tidak dapat membaca response server."
    );
  }


  console.log(
    "STEP 7 - RAW RESPONSE"
  );

  console.log(
    raw
  );


  // ========================================
  // RESPONSE KOSONG
  // ========================================

  if (!raw) {

    throw new Error(
      `Server mengembalikan response kosong. HTTP ${response.status}`
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
      "JSON PARSE ERROR:",
      error
    );

    console.error(
      "RAW RESPONSE:",
      raw
    );

    throw new Error(
      "Server mengembalikan response bukan JSON."
    );
  }


  console.log(
    "STEP 8 - JSON BERHASIL"
  );

  console.log(
    data
  );


  // ========================================
  // CEK HTTP
  // ========================================

  if (!response.ok) {

    console.error(
      "HTTP ERROR:",
      data
    );

    throw new Error(
      data.error ||
      data.message ||
      `HTTP Error ${response.status}`
    );
  }


  // ========================================
  // CEK SUCCESS
  // ========================================

  if (
    data.success === false
  ) {

    throw new Error(
      data.error ||
      "API mengembalikan success=false."
    );
  }


  console.log(
    "STEP 9 - DATA BERHASIL"
  );

  console.log(
    data
  );


  return data;
}


// ==========================================
// TAMPILKAN DATA
// ==========================================

function displayResult(data) {

  console.log(
    "================================"
  );

  console.log(
    "DISPLAY RESULT"
  );

  console.log(
    data
  );


  if (videoIdElement) {

    videoIdElement.textContent =
      `Video ID: ${
        data.video_id || "-"
      }`;
  }


  if (openTikTok) {

    openTikTok.href =
      data.url || "#";
  }


  if (
    descriptionElement &&
    data.description
  ) {

    descriptionElement.textContent =
      data.description;

    descriptionElement.classList.remove(
      "hidden"
    );

  } else if (descriptionElement) {

    descriptionElement.classList.add(
      "hidden"
    );
  }


  if (viewsElement) {

    viewsElement.textContent =
      Number(
        data.views || 0
      ).toLocaleString(
        "id-ID"
      );
  }


  if (likesElement) {

    likesElement.textContent =
      Number(
        data.likes || 0
      ).toLocaleString(
        "id-ID"
      );
  }


  if (commentsElement) {

    commentsElement.textContent =
      Number(
        data.comments || 0
      ).toLocaleString(
        "id-ID"
      );
  }


  if (sharesElement) {

    sharesElement.textContent =
      Number(
        data.shares || 0
      ).toLocaleString(
        "id-ID"
      );
  }


  if (savesElement) {

    savesElement.textContent =
      Number(
        data.saves || 0
      ).toLocaleString(
        "id-ID"
      );
  }


  if (createdAtElement) {

    createdAtElement.textContent =
      data.created_at ||
      "-";
  }


  if (fetchedAtElement) {

    fetchedAtElement.textContent =
      data.fetched_at ||
      "-";
  }


  if (resultBox) {

    resultBox.classList.remove(
      "hidden"
    );
  }
}


// ==========================================
// FORM SUBMIT
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
        "CHECK BUTTON / FORM DITEKAN"
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
        "URL USER:",
        videoUrl
      );


      if (!videoUrl) {

        showError(
          "Masukkan link video TikTok."
        );

        return;
      }


      showLoading();


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

}


// ==========================================
// ENTER KEY
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
// SELESAI
// ==========================================

console.log(
  "================================"
);

console.log(
  "SCRIPT SIAP"
);

console.log(
  "Form:",
  !!searchForm
);

console.log(
  "Input:",
  !!videoInput
);

console.log(
  "Button:",
  !!checkButton
);

console.log(
  "Result:",
  !!resultBox
);

console.log(
  "================================"
);
