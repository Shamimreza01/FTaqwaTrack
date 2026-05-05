import { openDB } from "idb";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AlQuranLoadShimmer from "./AlQuranLoadShimmer";

export default function AlQuranLoad() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { edition } = useParams();
  const quranMeta = {
    "bn.bengali": { textType: "textBangla", name: "আল-কোরআন বাংলা " },
    "en.yusufali": {
      textType: "textEnglish",
      name: "Al-Quran English Translation",
    },
    "quran-uthmani": {
      textType: "textArabic",
      name: "Al-Quran Arabic Non-Arab",
    },
  };
  console.log(edition);
  const meta = quranMeta[edition];
  const textType = meta?.textType;
  const name = meta?.name;

  const openIndexedDB = async () => {
    return openDB("quranDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("quranData")) {
          const store = db.createObjectStore("quranData", { keyPath: "id" });
          store.createIndex("id", "id", { unique: true });
        }
      },
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
          <div className="w-full text-center bg-[#021B1A]/90 backdrop-blur-xl border-b border-white/10 text-emerald-400 p-4 font-bold text-xl fixed top-0 left-0 z-20 shadow-md">
            {selectedSurah.number} {selectedSurah.englishName} {selectedSurah.name}
          </div>
          <button
            className="w-full sm:w-auto p-3 px-6 mt-4 mb-6 rounded-full border-none bg-emerald-600/80 hover:bg-emerald-500 text-white cursor-pointer transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur text-[1.1rem] mx-auto block hover:scale-105"
            onClick={() => setSelectedSurah(null)}
          >
            <i className="fa-solid fa-circle-left mr-2"></i> Go To Surah List
          </button>
          <ul className="flex flex-col gap-4 pb-20">
            {selectedSurah.ayahs.map((ayah) => (
              <li
                key={ayah.number}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-colors hover:bg-white/10 group"
                style={{
                  fontSize: textType === "textArabic" ? "30px" : "16px",
                  lineHeight: textType === "textArabic" ? "1.8" : "1.6"
                }}
              >
                <div className={textType === "textArabic" ? "text-right font-arabic" : ""}>
                  {textType !== "textArabic" && <span className="text-emerald-400 font-bold mr-2">{ayah.numberInSurah}.</span>}
                  {ayah[textType]}
                  {textType === "textArabic" && <span className="inline-flex w-10 h-10 mr-2 rounded-full border-2 border-emerald-500/30 items-center justify-center text-[1rem] text-emerald-300 font-bold align-middle">{ayah.numberInSurah}</span>}
                  {ayah.sajda && <span className="ml-2 text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30">Sajda</span>}
                </div>
              </li>
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
