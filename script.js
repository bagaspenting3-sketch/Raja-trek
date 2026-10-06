const form = document.getElementById("searchForm");
const input = document.getElementById("videoUrl");
const button = document.getElementById("checkButton");
const errorBox = document.getElementById("error");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

const fields = {
  videoId: document.getElementById("videoId"),
  openTikTok: document.getElementById("openTikTok"),
  description: document.getElementById("description"),
  views: document.getElementById("views"),
  likes: document.getElementById("likes"),
  comments: document.getElementById("comments"),
  shares: document.getElementById("shares"),
  saves: document.getElementById("saves"),
  createdAt: document.getElementById("createdAt"),
  fetchedAt: document.getElementById("fetchedAt")
};

function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? "0");
  return new Intl.NumberFormat("id-ID").format(n);
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function setLoading(state) {
  loading.classList.toggle("hidden", !state);
  button.disabled = state;
  button.textContent = state ? "Checking..." : "Check";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = input.value.trim();

  clearError();
  result.classList.add("hidden");

  if (!url) {
    showError("Masukkan link video TikTok terlebih dahulu.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
      `/api/tiktok?url=${encodeURIComponent(url)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal mengambil data TikTok.");
    }

    fields.videoId.textContent = `ID: ${data.video_id || "-"}`;
    fields.openTikTok.href = data.url || url;

    if (data.description) {
      fields.description.textContent = data.description;
      fields.description.classList.remove("hidden");
    } else {
      fields.description.classList.add("hidden");
    }

    fields.views.textContent = formatNumber(data.views);
    fields.likes.textContent = formatNumber(data.likes);
    fields.comments.textContent = formatNumber(data.comments);
    fields.shares.textContent = formatNumber(data.shares);
    fields.saves.textContent = formatNumber(data.saves);
    fields.createdAt.textContent = data.created_at || "-";
    fields.fetchedAt.textContent = data.fetched_at || "-";

    result.classList.remove("hidden");
  } catch (error) {
    showError(error.message || "Terjadi kesalahan.");
  } finally {
    setLoading(false);
  }
});
