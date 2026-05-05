import { openDB } from "idb";
import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import AlQuranLoadShimmer from "./AlQuranLoadShimmer";
import { useSettings } from "../../contexts/SettingsContext";

async function openIndexedDB() {
    return openDB("quranDB", 1);
}

export default function QuranEditionView() {
    const { edition, surahId } = useParams();
    const { hash } = useLocation();
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { arabicFontSize, translationFontSize, bookmarkId, toggleBookmark, favoriteAyahIds, toggleFavorite } = useSettings();

    const quranMeta = {
        "bn.bengali": { textType: "textBangla", name: "আল-কোরআন বাংলা" },
        "en.yusufali": { textType: "textEnglish", name: "Al-Quran English Translation" },
        "quran-uthmani": { textType: "textArabic", name: "Al-Quran Arabic" },
    };
    const meta = quranMeta[edition];
    const textType = meta?.textType || "textArabic";
    const name = meta?.name || "Quran Library";

    useEffect(() => {
        const loadSurah = async () => {
            try {
                const db = await openIndexedDB();
                const storedData = await db.get("quranData", 1);
                if (storedData) {
                    const surah = storedData.data.find(s => s.number === parseInt(surahId, 10));
                    setSelectedSurah(surah);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching IndexedDB Quran data:", error);
            }
        };
        loadSurah();
    }, [surahId]);

    useEffect(() => {
        if (!isLoading && selectedSurah && hash) {
            setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.classList.add("ring-2", "ring-emerald-400", "ring-offset-2", "ring-offset-[#021B1A]");
                    setTimeout(() => element.classList.remove("ring-2", "ring-emerald-400", "ring-offset-2", "ring-offset-[#021B1A]"), 3000);
                }
            }, 300);
        }
    }, [isLoading, selectedSurah, hash]);

    if (isLoading || !selectedSurah) {
        return <AlQuranLoadShimmer name="Loading Surah..." />;
    }

    const isArabic = textType === "textArabic";

    return (
        <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white relative">
            <div className="w-full bg-[#021B1A]/90 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to={`/quran/${edition}`} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors shrink-0">
                        <i className="fa-solid fa-arrow-left text-sm"></i>
                    </Link>
                    <h2 className="text-emerald-400 font-bold text-[1.1rem] drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        {selectedSurah.number}. {selectedSurah.englishName}
                    </h2>
                </div>
            </div>

            <ul className="flex flex-col gap-4 pb-20 mt-4">
                {selectedSurah.ayahs.map((ayah) => {
                    const isBookmarked = bookmarkId === ayah.number.toString();
                    const isFavorited = favoriteAyahIds.includes(ayah.number);

                    return (
                        <li
                            id={`ayah-${ayah.numberInSurah}`}
                            key={ayah.number}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-colors hover:bg-white/10 flex flex-col gap-5"
                        >
                            <div
                                className={`leading-relaxed transition-all duration-300 ${isArabic ? 'text-right font-arabic' : 'text-white/80'}`}
                                style={{ fontSize: `${isArabic ? arabicFontSize : translationFontSize}px` }}
                            >
                                {!isArabic && <span className="text-emerald-400 font-bold mr-3">{ayah.numberInSurah}.</span>}
                                {ayah[textType]}
                                {isArabic && <span className="inline-flex w-[1.5em] h-[1.5em] ml-2 rounded-full border border-emerald-500/50 bg-emerald-900/30 items-center justify-center text-[0.4em] font-bold text-emerald-300">{ayah.numberInSurah}</span>}
                            </div>

                            <div className="flex justify-end gap-3 w-full border-t border-white/5 pt-4 mt-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(ayah.number); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${isFavorited ? 'bg-red-500/20 border-red-500/50 text-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <i className={`fa-solid fa-heart`}></i>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleBookmark(ayah.number.toString()); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${isBookmarked ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <i className={`fa-solid fa-bookmark`}></i>
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
