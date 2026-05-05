import { openDB } from "idb";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AlQuranLoadShimmer from "./AlQuranLoadShimmer";

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

    const loadQuran = async () => {
        try {
            const db = await openIndexedDB();
            const storedData = await db.get("quranData", 1);
            if (storedData) {
                setSurahs(storedData.data);
                setIsLoading(false);
            } else {
                const responses = await fetch(
                    "https://api-taqwatrack.onrender.com/QuranArBnEnAudio"
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
        if (lowerQuery.includes(':')) {
            const [s, a] = lowerQuery.split(':');
            return surahs.filter(su => su.number === parseInt(s, 10)); // return just that one to allow tapping it easily
        }

        return surahs.filter(surah =>
            surah.englishName.toLowerCase().includes(lowerQuery) ||
            surah.name.includes(lowerQuery) ||
            surah.number.toString() === lowerQuery
        );
    }, [surahs, searchQuery]);

    return isLoading ? (
        <AlQuranLoadShimmer name={name} />
    ) : loadError || surahs.length === 0 ? (
        <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white flex flex-col items-center justify-center gap-6">
            <div className="text-center">
                <i className={`fa-solid ${!navigator.onLine ? 'fa-wifi' : 'fa-triangle-exclamation'} text-5xl text-red-400/60 mb-4`}></i>
                <h2 className="text-2xl font-bold text-white/80 mb-2">Unable to Load Quran</h2>
                <p className="text-white/40 max-w-sm">
                    {!navigator.onLine 
                        ? "You are offline. Please connect to the internet to download the Quran data. It will be saved offline for future use."
                        : "The server is starting up (this can take up to 30 seconds on first load). Please tap 'Try Again' in a moment."
                    }
                </p>
            </div>
            <button onClick={() => { setLoadError(false); setIsLoading(true); loadQuran(); }} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-all shadow-lg shadow-emerald-500/30">
                <i className="fa-solid fa-rotate-right mr-2"></i> Try Again
            </button>
        </div>
    ) : (
        <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white">
            <div className="w-full bg-[#021B1A]/80 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md">
                <h2 className="text-center text-emerald-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">{`📖 Al-Quran : ${name}`}</h2>
            </div>

            {/* Modern Search Bar */}
            <div className="relative mt-8 mb-6 mx-auto z-10 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fa-solid fa-search text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors"></i>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all"
                    placeholder="Search surah name, number, or go to 36:15..."
                />
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                {filteredSurahs.map((surah) => (
                    <Link
                        to={`/quran/fullQuran/${surah.number}${searchQuery.includes(':') ? '#ayah-' + searchQuery.split(':')[1] : ''}`}
                        key={surah.number}
                    >
                        <li className="cursor-pointer p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-emerald-500/30 flex items-center justify-between group">
                            <div className="flex gap-3 items-center">
                                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white transition-colors">{surah.number}</span>
                                <span className="font-semibold text-white/90">{surah.englishName}</span>
                            </div>
                            <span className="text-xl text-emerald-400 font-arabic">{surah.name}</span>
                        </li>
                    </Link>
                ))}
            </ul>

            {filteredSurahs.length === 0 && (
                <div className="text-center text-white/40 mt-10">No surahs found matching "{searchQuery}"</div>
            )}
        </div>
    );
}
