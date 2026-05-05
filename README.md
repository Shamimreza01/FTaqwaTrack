<p align="center">
  <img src="public/icon512x512.png" width="120" alt="TaqwaTrack Logo" />
</p>

<h1 align="center">🕌 TaqwaTrack</h1>

<p align="center">
  <strong>Your Personal Islamic Companion — Offline, Private, Beautiful.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/IndexedDB-Offline-FF6F00?style=for-the-badge&logo=databricks&logoColor=white" />
  <img src="https://img.shields.io/badge/Vulnerabilities-0-2ECC71?style=for-the-badge&logo=checkmarx&logoColor=white" />
</p>

<p align="center">
  <em>A modern, privacy-first web application built for Muslims to track daily prayers, read the Quran, learn Duas, memorize the 99 Names of Allah, and build consistent spiritual habits — all without an internet connection.</em>
</p>

---

## ✨ Features at a Glance

| Feature | Description |
|---|---|
| 🕋 **Prayer Times** | Accurate Salah times based on your GPS location using the Adhan calculation library |
| 📖 **Al-Quran** | Full Quran with Arabic text, Bengali translation, and audio recitation |
| 🤲 **Dua Library** | Curated collections including 40 Rabbana Duas, Motivational Ayahs & After-Salah Duas |
| 📿 **99 Names of Allah** | Beautiful Asma ul Husna cards with memorization tracking |
| 📊 **Daily Hub** | Track your 5 daily Salah (Jamat/Individual), Focus Sessions & personal journal notes |
| 📅 **History Calendar** | Monthly heatmap showing your tracking consistency with missed-day indicators |
| 📂 **My Collections** | Centralized dashboard for all your bookmarks, favorites & memorization progress |
| 💾 **Backup & Restore** | Export all your data to a JSON file and restore it on any device |
| 🔒 **100% Offline & Private** | All data stays on YOUR device. Zero tracking. Zero analytics. Zero servers. |

---

## 🏗️ Tech Stack

```
Frontend        →  React 19  +  Vite 6
Styling         →  Tailwind CSS 4
Animations      →  Framer Motion
Charts          →  Recharts
Data Storage    →  IndexedDB (idb) + localStorage
Prayer Calc     →  Adhan.js
Date Handling   →  Moment.js / Moment Timezone
Routing         →  React Router DOM v7
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Shamimreza01/TaqwaTrack.git
cd TaqwaTrack

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Add your API key for reverse geocoding (location name)

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
TaqwaTrack/
├── public/                     # Static assets & PWA icons
├── src/
│   ├── components/
│   │   ├── AlQuranpageComponents/   # Quran reading, edition & surah views
│   │   ├── DailyComponents/         # Salah tracker, Focus timer, Notes, Calendar
│   │   ├── DuapageComponents/       # Dua collections & item cards
│   │   ├── ErrorPage/               # 404 & under construction views
│   │   ├── HomeComponents/          # Header, prayer times, bottom nav
│   │   └── NamesOfAllahComponents/  # 99 Names cards & memorization
│   ├── contexts/                    # Settings & Menu context providers
│   ├── data/                        # Static JSON data (Duas, Names, etc.)
│   ├── Hooks/                       # Custom React hooks
│   ├── Icons/                       # SVG icon components
│   ├── pages/                       # Route-level page components
│   ├── utils/                       # API helpers & utility functions
│   ├── App.jsx                      # Root layout with navigation
│   ├── main.jsx                     # Router configuration & entry point
│   └── index.css                    # Global styles & Tailwind directives
├── .env                             # Environment variables (git-ignored)
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 📱 App Screens

### 🏠 Home Dashboard
> Real-time prayer times with countdown, Suhoor/Iftar schedule, quick access cards to all features, and a responsive desktop/mobile layout with glassmorphism design.

### 📖 Al-Quran
> Browse by edition or surah. Read Arabic text with translations side-by-side. Bookmark your last read position, favorite special Ayahs, and toggle Memorize Mode to track your Hifz journey.

### 🤲 Dua Collections
> Three curated Dua packs with Arabic text, transliteration, and translations. Bookmark, favorite, and memorize individual Duas.

### 📊 Daily Hub
> **Three powerful tabs:**
> - **Salah** — Log each of the 5 daily prayers as Jamat (27 pts) or Individual (1 pt). Visualize trends with area charts and monthly heatmaps. Missed days are flagged with a pulsing red dot.
> - **Focus** — Deep focus timer with animated progress ring. Log sessions and track your productive minutes over time.
> - **Notes** — Write multiple daily reflections with titles. Full CRUD support for managing your spiritual journal.

### 📂 My Collections
> A unified dashboard with three tabs — **Bookmarks**, **Favorites**, and **Hifz** — showing all your saved Ayahs, Duas, and memorization progress in one premium view.

---

## 🔐 Privacy & Security

TaqwaTrack is built with a **privacy-first architecture**:

- ✅ **Zero external data transmission** — All user data is stored locally in IndexedDB and localStorage
- ✅ **No user accounts required** — No sign-ups, no passwords, no tracking
- ✅ **XSS Protection** — React's built-in output encoding prevents script injection
- ✅ **Input Sanitization** — All text inputs enforce character limits to prevent storage abuse
- ✅ **Resilient DB Operations** — All IndexedDB calls are wrapped in try-catch to prevent crashes
- ✅ **0 npm vulnerabilities** — Verified with `npm audit`
- ✅ **`.env` properly git-ignored** — Sensitive API keys never reach your repository

---

## 💾 Data Backup & Restore

Your data is precious. TaqwaTrack includes a built-in backup system accessible from the **Menu** page:

| Action | What it does |
|---|---|
| **Backup Data** | Downloads a single `.json` file containing ALL your Salah logs, Focus sessions, Notes, Quran bookmarks, favorites, memorization progress, 99 Names progress, and app settings |
| **Restore Data** | Upload a previously exported `.json` file to merge all data back into the app. The page auto-reloads to apply everything instantly |

> 💡 **Tip:** Store your backup file in Google Drive, iCloud, or email it to yourself for safekeeping!

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ and Taqwa</strong>
</p>

<p align="center">
  <em>"Indeed, the most noble of you in the sight of Allah is the most righteous of you." — Quran 49:13</em>
</p>
