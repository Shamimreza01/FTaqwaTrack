import { openDB } from "idb";
import { useEffect, useState } from "react";
import AlQuranLoadShimmer from "./AlQuranLoadShimmer";
import AyahCard from "./AyahCard";

async function openIndexedDB() {
  return openDB("fullQuranDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("quranData")) {
        const store = db.createObjectStore("quranData", { keyPath: "id" });
        store.createIndex("by_id", "id");
      }
    },
  });
}

export default function FullQuranLoad({ name = "Al-Quran" }) {
  const [surahs, setSurahs] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMemorizeMode, setIsMemorizeMode] = useState(false);
  const [memorizedAyahIds, setMemorizedAyahIds] = useState(() => {
    const saved = localStorage.getItem("memorizedAyahsHifz");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleMemorized = (ayahNumber) => {
    setMemorizedAyahIds(prev => {
      const newIds = prev.includes(ayahNumber)
        ? prev.filter(i => i !== ayahNumber)
        : [...prev, ayahNumber];
      localStorage.setItem("memorizedAyahsHifz", JSON.stringify(newIds));
      return newIds;
    });
  };

  const loadQuran = async () => {
    try {
      const db = await openIndexedDB();
      const storedData = await db.get("quranData", 1);
      if (storedData) {
        setSurahs(storedData.data);
        setIsLoading(false);
        console.log("i am from indexDB");
      } else {
        const responses = await fetch(
          "https://api-taqwatrack.onrender.com/QuranArBnEnAudio"
        ).then((res) => res.json());
        await db.put("quranData", { id: 1, data: responses });

        setSurahs(responses);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Quran data:", error);
    }
  };

  useEffect(() => {
    loadQuran();
  }, [name]);

  return isLoading ? (
    <AlQuranLoadShimmer name={name} />
  ) : (
    <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white">
      {selectedSurah ? (
        <>
          <div className="w-full bg-[#021B1A]/90 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-emerald-400 font-bold text-[1.1rem] drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              {selectedSurah.number}. {selectedSurah.englishName} ({selectedSurah.name})
            </h2>

            <div className="flex items-center gap-4">
              {/* Progress Indicator */}
              {isMemorizeMode && (
                <div className="bg-black/30 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                  <span className="text-[0.65rem] uppercase font-bold text-white/50 tracking-wider">Hifz</span>
                  <span className="text-amber-300 text-sm font-bold tracking-widest">
                    {selectedSurah.ayahs.filter(a => memorizedAyahIds.includes(a.number)).length}
                    <span className="text-white/30 text-xs"> /{selectedSurah.ayahs.length}</span>
                  </span>
                </div>
              )}

              {/* Memorize Mode Toggle */}
              <button
                onClick={() => setIsMemorizeMode(!isMemorizeMode)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${isMemorizeMode ? 'bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-white/10'}`}
              >
                <span className="sr-only">Toggle Memorize Mode</span>
                <span className={`${isMemorizeMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white/70'} inline-block h-5 w-5 transform rounded-full transition-transform duration-300`} />
                {!isMemorizeMode && <span className="absolute right-1 text-[0.55rem] font-bold text-white/50 pointer-events-none">OFF</span>}
              </button>
            </div>
          </div>

          <button
            className="w-full sm:w-auto p-3 px-6 mt-8 mb-6 rounded-full border-none bg-emerald-600/80 hover:bg-emerald-500 text-white cursor-pointer transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur text-[1.1rem] mx-auto block hover:scale-105"
            onClick={() => setSelectedSurah(null)}
          >
            <i className="fa-solid fa-circle-left mr-2"></i> Go To Surah List
          </button>

          <ul className="flex flex-col gap-4 pb-20">
            {selectedSurah.ayahs.map((ayah) => (
              <AyahCard
                key={ayah.number}
                ayah={ayah}
                isMemorizeMode={isMemorizeMode}
                isMemorized={memorizedAyahIds.includes(ayah.number)}
                onToggleMemorized={toggleMemorized}
              />
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2 className="w-full text-center bg-[#021B1A]/80 backdrop-blur-xl border-b border-white/10 text-emerald-400 p-4 font-bold text-xl fixed top-0 left-0 z-20 shadow-md">{`📖 Al-Quran : ${name}`}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20 mt-4">
            {surahs.map((surah) => (
              <li
                className="cursor-pointer p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-emerald-500/30 flex items-center justify-between"
                key={surah.number}
                onClick={() => setSelectedSurah(surah)}
              >
                <div className="flex gap-3 items-center">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm border border-emerald-500/30">{surah.number}</span>
                  <span className="font-semibold text-white/90">{surah.englishName}</span>
                </div>
                <span className="text-xl text-emerald-400 font-arabic">{surah.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
