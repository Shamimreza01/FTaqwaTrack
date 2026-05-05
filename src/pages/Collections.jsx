import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { openDB } from "idb";
import { useSettings } from "../contexts/SettingsContext";
import AyahCard from "../components/AlQuranpageComponents/AyahCard";
import DuaItemCard from "../components/DuapageComponents/DuaItemCard";

export default function Collections() {
    const [activeTab, setActiveTab] = useState("bookmarks"); // bookmarks | favorites | hifz

    const { bookmarkId, favoriteAyahIds, duaBookmarkId, favoriteDuaIds, memorizedDuaIds } = useSettings();

    // To verify 99 names we look at memorizedAyahs? Actually "99 names" mapped to `memorizedNamesHifz`
    const [memorizedNames] = useState(() => {
        return JSON.parse(localStorage.getItem('memorizedNamesHifz') || '[]');
    });

    const [memorizedQuranIds] = useState(() => {
        // FullQuranLoad mapped to memorizedAyahsHifz
        return JSON.parse(localStorage.getItem('memorizedAyahsHifz') || '[]');
    });

    const [allAyahs, setAllAyahs] = useState([]);
    const [allDuas, setAllDuas] = useState({}); // { uniqueId: { dataName, dua } }
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDatabases = async () => {
            // 1. Fetch Ayahs
            try {
                const quranDB = await openDB("fullQuranDB", 1, {
                    upgrade(db) {
                        if (!db.objectStoreNames.contains("quranData")) {
                            const store = db.createObjectStore("quranData", { keyPath: "id" });
                            store.createIndex("by_id", "id");
                        }
                    }
                });
                const quranData = await quranDB.get("quranData", 1);
                if (quranData && quranData.data) {
                    const flatAyahs = [];
                    quranData.data.forEach(surah => {
                        flatAyahs.push(...surah.ayahs);
                    });
                    setAllAyahs(flatAyahs);
                }
            } catch (e) { console.error("Quran DB read fail", e) }

            // 2. Fetch Duas
            try {
                const duaMetaReverse = {
                    1: "FortyRabbanaDua",
                    2: "FortyMotivationalAyah",
                    3: "AfterSalahDua"
                };
                const duaDB = await openDB("DuaDB", 1, {
                    upgrade(db) {
                        if (!db.objectStoreNames.contains("duas")) {
                            const store = db.createObjectStore("duas", { keyPath: "id" });
                            store.createIndex("id", "id", { unique: true });
                        }
                    }
                });
                if (duaDB.objectStoreNames.contains("duas")) {
                    const tx = duaDB.transaction("duas", "readonly");
                    const store = tx.objectStore("duas");
                    const keys = await store.getAllKeys();

                    const mappedDuas = {};
                    for (const key of keys) {
                        const obj = await store.get(key);
                        if (obj && obj.data) {
                            const dataName = duaMetaReverse[key];
                            obj.data.forEach(dua => {
                                const uid = `${dataName}_${dua.dua_number || dua.ayah_number}`;
                                mappedDuas[uid] = { dua, dataName };
                            });
                        }
                    }
                    setAllDuas(mappedDuas);
                }
            } catch (e) { console.error("Dua DB read fail", e) }

            setIsLoading(false);
        };

        fetchDatabases();
    }, []);

    const renderTabs = () => (
        <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-full w-full mx-auto max-w-sm mb-10 overflow-hidden shadow-inner isolate z-10 sticky top-[80px]">
            {['bookmarks', 'favorites', 'hifz'].map(key => (
                <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 relative ${activeTab === key ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
                >
                    {activeTab === key && (
                        <span className="absolute inset-0 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)] -z-10"></span>
                    )}
                    {key}
                </button>
            ))}
        </div>
    );

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center text-white/50 text-sm animate-pulse tracking-widest uppercase">Loading local databases...</div>;
        }

        const elements = [];

        if (activeTab === 'bookmarks') {
            // Verify Ayah Bookmark
            if (bookmarkId) {
                const b_ayah = allAyahs.find(a => a.number.toString() === bookmarkId);
                if (b_ayah) elements.push(<div key="b_ayah"><div className="text-emerald-400 font-bold mb-4 ml-2"><i className="fa-solid fa-bookmark mr-2"></i> Bookmarked Ayah</div><AyahCard ayah={b_ayah} isMemorizeMode={false} /></div>);
            }
            // Verify Dua Bookmark
            if (duaBookmarkId) {
                const b_dua_obj = allDuas[duaBookmarkId];
                if (b_dua_obj) elements.push(<div key="b_dua" className="mt-8"><div className="text-emerald-400 font-bold mb-4 ml-2"><i className="fa-solid fa-bookmark mr-2"></i> Bookmarked Dua</div><DuaItemCard dua={b_dua_obj.dua} dataName={b_dua_obj.dataName} uniqueId={duaBookmarkId} isMemorizeMode={false} /></div>);
            }
            if (elements.length === 0) elements.push(<div key="emp" className="text-center text-white/40 pt-10">No bookmarks present. Explore the Quran to leave your mark!</div>);
        }

        if (activeTab === 'favorites') {
            const matchedAyahs = allAyahs.filter(a => favoriteAyahIds.includes(a.number));
            const matchedDuas = favoriteDuaIds.map(uid => allDuas[uid]).filter(Boolean);

            if (matchedAyahs.length > 0) {
                elements.push(<div className="text-red-400 font-bold mb-4 ml-2 mt-8" key="fh1"><i className="fa-solid fa-heart mr-2"></i> Favorited Ayahs</div>);
                matchedAyahs.forEach(a => elements.push(<div key={'fa' + a.number} className="mb-4"><AyahCard ayah={a} isMemorizeMode={false} /></div>));
            }

            if (matchedDuas.length > 0) {
                elements.push(<div className="text-red-400 font-bold mb-4 ml-2 mt-8" key="fh2"><i className="fa-solid fa-heart mr-2"></i> Favorited Duas</div>);
                matchedDuas.forEach(obj => {
                    const uid = `${obj.dataName}_${obj.dua.dua_number || obj.dua.ayah_number}`;
                    elements.push(<div key={'fd' + uid} className="mb-4"><DuaItemCard dua={obj.dua} dataName={obj.dataName} uniqueId={uid} isMemorizeMode={false} /></div>);
                });
            }

            if (elements.length === 0) elements.push(<div key="emp" className="text-center text-white/40 pt-10">Your favorites list is empty. Love what you read!</div>);
        }

        if (activeTab === 'hifz') {
            const mmAyahs = allAyahs.filter(a => memorizedQuranIds.includes(a.number));
            const mmDuas = memorizedDuaIds.map(uid => allDuas[uid]).filter(Boolean);

            if (mmAyahs.length > 0) {
                elements.push(<div className="text-amber-400 font-bold mb-4 ml-2 mt-8 uppercase tracking-widest text-xs" key="mh1">Memorized Ayahs</div>);
                mmAyahs.forEach(a => elements.push(<div key={'ma' + a.number} className="mb-4"><AyahCard ayah={a} isMemorizeMode={false} isMemorized={true} /></div>));
            }

            if (mmDuas.length > 0) {
                elements.push(<div className="text-amber-400 font-bold mb-4 ml-2 mt-8 uppercase tracking-widest text-xs" key="mh2">Memorized Duas</div>);
                mmDuas.forEach(obj => {
                    const uid = `${obj.dataName}_${obj.dua.dua_number || obj.dua.ayah_number}`;
                    elements.push(<div key={'md' + uid} className="mb-4"><DuaItemCard dua={obj.dua} dataName={obj.dataName} uniqueId={uid} isMemorizeMode={false} isMemorized={true} /></div>);
                });
            }

            if (memorizedNames.length > 0) {
                elements.push(
                    <div key="mb2" className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center shadow-inner">
                        <i className="fa-solid fa-award text-3xl text-amber-500 mb-2"></i>
                        <div className="font-bold text-amber-400">99 Names of Allah</div>
                        <div className="text-white/60 text-sm mt-1">You have memorized <span className="text-white font-bold">{memorizedNames.length}</span> names. View them in the Asma-Ul-Husna tab.</div>
                    </div>
                );
            }

            if (elements.length === 0) elements.push(<div key="emp" className="text-center text-white/40 pt-10">You haven't added anything to your Hifz track yet. Turn on Memorize Mode to begin!</div>);
        }

        return <div className="flex flex-col">{elements}</div>;
    };

    return (
        <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white relative">
            <div className="w-full bg-[#021B1A]/90 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md">
                <h2 className="text-center text-emerald-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                    <i className="fa-solid fa-layer-group mr-2"></i> My Collections
                </h2>
            </div>

            <div className="relative mt-8 group flex items-center justify-between z-10 mb-6">
                <Link to="/" className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all font-semibold tracking-wide text-sm text-white/60">
                    <i className="fa-solid fa-chevron-left text-xs"></i> Back to Home
                </Link>
            </div>

            <div className="relative z-10">
                {renderTabs()}
                <div className="pb-20">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
