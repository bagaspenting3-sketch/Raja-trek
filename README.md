# TikTok Stats Finder - HTML Version

Struktur sederhana untuk Acode + GitHub + Vercel.

## Struktur

tiktok-stats-finder/
├── index.html
├── style.css
├── script.js
├── api/
│   └── tiktok.js
├── .gitignore
└── README.md

## Vercel

1. Upload project ke GitHub.
2. Import repository ke Vercel.
3. Masuk ke Settings -> Environment Variables.
4. Tambahkan:

QUANTICDATA_API_KEY = API KEY QUANTICDATA KAMU

5. Deploy.

API key tidak ditaruh di HTML/JavaScript frontend.

## Alur

index.html
  -> script.js
  -> /api/tiktok
  -> QuanticData API
  -> statistik
  -> browser
