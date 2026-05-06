import { openDB } from "idb";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import AlQuranLoadShimmer from "./AlQuranLoadShimmer";
import SurahName from "./SurahName";
import SurahSearchBar from "./SurahSearchBar";

async function openIndexedDB() {
  const db = await openDB("fullQuranDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("quranData")) {
        const store = db.createObjectStore("quranData", { keyPath: "id" });
        store.createIndex("by_id", "id");
      }
    },
  });
  // Self-heal: if DB exists but store is missing (broken state), recreate it
  if (!db.objectStoreNames.contains("quranData")) {
    db.close();
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase("fullQuranDB");
      req.onsuccess = resolve;
      req.onerror = reject;
    });
    return openIndexedDB();
  }
  return db;
}

export default function QuranSurahList({ name = "Al-Quran" }) {
  const [surahs, setSurahs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadError, setLoadError] = useState(false);
  const { theme, s } = useTheme();

  const loadQuran = async () => {
    try {
      const db = await openIndexedDB();
      const storedData = await db.get("quranData", 1);
      if (storedData) {
        setSurahs(storedData.data);
        setIsLoading(false);
      } else {
        const responses = await fetch(
          "https://api-taqwatrack.onrender.com/QuranArBnEnAudio",
        ).then((res) => res.json());
        await db.put("quranData", { id: 1, data: responses });

        setSurahs(responses);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Quran list:", error);
      setIsLoading(false);
      setLoadError(true);
    }
  };

  useEffect(() => {
    loadQuran();
  }, [name]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs;
    const lowerQuery = searchQuery.toLowerCase();

    // Quick parse for "Surah:Ayah" direct jump string
    if (lowerQuery.includes(":")) {
      const [s, a] = lowerQuery.split(":");
      return surahs.filter((su) => su.number === parseInt(s, 10)); // return just that one to allow tapping it easily
    }

    return surahs.filter(
      (surah) =>
        surah.englishName.toLowerCase().includes(lowerQuery) ||
        surah.name.includes(lowerQuery) ||
        surah.number.toString() === lowerQuery,
    );
  }, [surahs, searchQuery]);

  return isLoading ? (
    <AlQuranLoadShimmer name={name} />
  ) : loadError || surahs.length === 0 ? (
    <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <i
          className={`fa-solid ${!navigator.onLine ? "fa-wifi" : "fa-triangle-exclamation"} text-5xl text-red-400/60 mb-4`}
        ></i>
        <h2 className="text-2xl font-bold text-white/80 mb-2">
          Unable to Load Quran
        </h2>
        <p className="text-white/40 max-w-sm">
          {!navigator.onLine
            ? "You are offline. Please connect to the internet to download the Quran data. It will be saved offline for future use."
            : "The server is starting up (this can take up to 30 seconds on first load). Please tap 'Try Again' in a moment."}
        </p>
      </div>
      <button
        onClick={() => {
          setLoadError(false);
          setIsLoading(true);
          loadQuran();
        }}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-all shadow-lg shadow-emerald-500/30"
      >
        <i className="fa-solid fa-rotate-right mr-2"></i> Try Again
      </button>
    </div>
  ) : (
    <div
      className={`font-sans py-[80px] px-4 max-w-4xl mx-auto min-h-screen ${s.text} relative z-10`}
    >
      <div
        className={`w-full ${s.nav} border-b ${theme === "dark" ? "border-white/10" : "border-emerald-100"} p-4 fixed top-0 left-0 z-20 shadow-lg`}
      >
        <h2
          className={`text-center font-bold text-xl ${theme === "dark" ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" : "text-emerald-700"}`}
        >{`📖 Al-Quran : ${name}`}</h2>
      </div>

      {/* Modern Search Bar */}
      <SurahSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
        {filteredSurahs.map((surah) => (
          <Link
            to={`/quran/fullQuran/${surah.number}${searchQuery.includes(":") ? "#ayah-" + searchQuery.split(":")[1] : ""}`}
            key={surah.number}
          >
            <SurahName surah={surah} />
          </Link>
        ))}
      </ul>

      {filteredSurahs.length === 0 && (
        <div className={`text-center ${s.textSecondary} mt-10 opacity-60`}>
          No surahs found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
