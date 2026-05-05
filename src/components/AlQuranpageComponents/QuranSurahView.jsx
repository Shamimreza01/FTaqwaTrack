import { openDB } from "idb";
import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import AlQuranLoadShimmer from "./AlQuranLoadShimmer";
import AyahCard from "./AyahCard";

async function openIndexedDB() {
    return openDB("fullQuranDB", 1); // Relies on it already being built by QuranSurahList
}

export default function QuranSurahView() {
    const { surahId } = useParams();
    const { hash } = useLocation();
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

    useEffect(() => {
        const loadSurah = async () => {
            try {
                const db = await openIndexedDB();
                const storedData = await db.get("quranData", 1);
                if (storedData) {
                    const surah = storedData.data.find(s => s.number === parseInt(surahId, 10));
                    setSelectedSurah(surah);
                    setIsLoading(false);
                } else {
                    // Need to return user if accessed randomly somehow without cache
                    console.error("Cache miss in direct route, return back to list");
                }
            } catch (error) {
                console.error("Error fetching IndexedDB Quran data:", error);
            }
        };

        loadSurah();
    }, [surahId]);

    useEffect(() => {
        // Handle scrolling to specific Ayah hash
        if (!isLoading && selectedSurah && hash) {
            setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.classList.add("ring-2", "ring-emerald-400", "ring-offset-2", "ring-offset-[#021B1A]");
                    setTimeout(() => element.classList.remove("ring-2", "ring-emerald-400", "ring-offset-2", "ring-offset-[#021B1A]"), 3000);
                }
            }, 300); // Wait for render
        }
    }, [isLoading, selectedSurah, hash]);

    if (isLoading || !selectedSurah) {
        return <AlQuranLoadShimmer name="Loading Surah..." />;
    }

    return (
        <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white relative">
            <div className="w-full bg-[#021B1A]/90 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/quran/fullQuran" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors shrink-0">
                        <i className="fa-solid fa-arrow-left text-sm"></i>
                    </Link>
                    <h2 className="text-emerald-400 font-bold text-[1.1rem] drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        {selectedSurah.number}. {selectedSurah.englishName} ({selectedSurah.name})
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    {isMemorizeMode && (
                        <div className="bg-black/30 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                            <span className="text-[0.65rem] uppercase font-bold text-white/50 tracking-wider">Hifz</span>
                            <span className="text-amber-300 text-sm font-bold tracking-widest">
                                {selectedSurah.ayahs.filter(a => memorizedAyahIds.includes(a.number)).length}
                                <span className="text-white/30 text-xs"> /{selectedSurah.ayahs.length}</span>
                            </span>
                        </div>
                    )}

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

            <ul className="flex flex-col gap-4 pb-20 mt-4">
                {selectedSurah.ayahs.map((ayah) => (
                    <div id={`ayah-${ayah.numberInSurah}`} key={ayah.number}>
                        <AyahCard
                            ayah={ayah}
                            isMemorizeMode={isMemorizeMode}
                            isMemorized={memorizedAyahIds.includes(ayah.number)}
                            onToggleMemorized={toggleMemorized}
                        />
                    </div>
                ))}
            </ul>
        </div>
    );
}
