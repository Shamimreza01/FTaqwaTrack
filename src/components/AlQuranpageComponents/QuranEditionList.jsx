import { openDB } from "idb";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AlQuranLoadShimmer from "./AlQuranLoadShimmer";
import SurahName from "./SurahName";
import SurahSearchBar from "./SurahSearchBar";

async function openIndexedDB() {
  return openDB("quranDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("quranData")) {
        const store = db.createObjectStore("quranData", { keyPath: "id" });
        store.createIndex("id", "id", { unique: true });
      }
    },
  });
}

export default function QuranEditionList() {
  const [surahs, setSurahs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { edition } = useParams();

  const quranMeta = {
    "bn.bengali": { name: "আল-কোরআন বাংলা" },
    "en.yusufali": { name: "Al-Quran English Translation" },
    "quran-uthmani": { name: "Al-Quran Arabic" },
  };
  const name = quranMeta[edition]?.name || "Quran Library";

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
    }
  };

  useEffect(() => {
    loadQuran();
  }, [edition]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs;
    const lowerQuery = searchQuery.toLowerCase();

    // Quick parse for "Surah:Ayah" lookup
    if (lowerQuery.includes(":")) {
      const [s, a] = lowerQuery.split(":");
      return surahs.filter((su) => su.number === parseInt(s, 10));
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
  ) : (
    <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white">
      <div className="w-full bg-[#021B1A]/80 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md">
        <h2 className="text-center text-emerald-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">{`📖 ${name}`}</h2>
      </div>

      <SurahSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
        {filteredSurahs.map((surah) => (
          <Link
            to={`/quran/${edition}/${surah.number}${searchQuery.includes(":") ? "#ayah-" + searchQuery.split(":")[1] : ""}`}
            key={surah.number}
          >
            <SurahName surah={surah} />
          </Link>
        ))}
      </ul>
      {filteredSurahs.length === 0 && (
        <div className="text-center text-white/40 mt-10">
          No surahs found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
