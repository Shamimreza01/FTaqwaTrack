import { useEffect, useState } from "react";
import { openDB } from "idb";
import { motion } from "framer-motion";
import NamesOfAllahShimmer from "../components/NamesOfAllahComponents/NamesOfAllahShimmer";
import NameCard from "../components/NamesOfAllahComponents/NameCard";

const openIndexedDB = async () => {
    return openDB("asmaUlHusnaDB", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("namesData")) {
                const store = db.createObjectStore("namesData", { keyPath: "id" });
                store.createIndex("id", "id", { unique: true });
            }
        },
    });
};

export default function NamesOfAllah() {
    const [namesOfAllah, setNamesOfAllah] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMemorizeMode, setIsMemorizeMode] = useState(false);
    const [memorizedIds, setMemorizedIds] = useState(() => {
        const saved = localStorage.getItem("memorizedAsmaUlHusna");
        return saved ? JSON.parse(saved) : [];
    });

    const loadNames = async () => {
        try {
            const db = await openIndexedDB();
            const storedData = await db.get("namesData", 1);

            if (storedData && Array.isArray(storedData.data) && storedData.data.length >= 99) {
                setNamesOfAllah(storedData.data);
                setIsLoading(false);
                console.log("Names of Allah - loaded from indexDB");
            } else {
                const response = await fetch("https://api-taqwatrack.onrender.com/namesofallah");
                const json = await response.json();

                // Handle varying response formats safely
                let data = [];
                if (Array.isArray(json) && json.length > 0) {
                    data = json[0].names || json;
                } else if (json.names) {
                    data = json.names;
                } else if (json.data && Array.isArray(json.data)) {
                    data = json.data;
                }

                await db.put("namesData", { id: 1, data: data });

                setNamesOfAllah(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Names of Allah data:", error);
        }
    };

    useEffect(() => {
        loadNames();
    }, []);

    const toggleMemorized = (id) => {
        setMemorizedIds(prev => {
            const newIds = prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id];
            localStorage.setItem("memorizedAsmaUlHusna", JSON.stringify(newIds));
            return newIds;
        });
    };

    if (isLoading) {
        return <NamesOfAllahShimmer />;
    }

    return (
        <div className="font-sans py-[80px] px-4 max-w-5xl mx-auto min-h-screen text-white relative z-10">

            {/* Sticky Header with Controls */}
            <div className="w-full bg-[#021B1A]/80 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-emerald-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                    <i className="fa-solid fa-gem mr-2"></i>99 Names of Allah
                </h2>

                <div className="flex items-center gap-4">
                    {/* Progress Indicator */}
                    {isMemorizeMode && (
                        <div className="bg-black/30 px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-3">
                            <span className="text-xs uppercase font-bold text-white/50 tracking-wider">Progress</span>
                            <span className="text-amber-300 font-bold tracking-widest">{memorizedIds.length} <span className="text-white/30">/</span> 99</span>
                        </div>
                    )}

                    {/* Memorize Mode Toggle */}
                    <button
                        onClick={() => setIsMemorizeMode(!isMemorizeMode)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${isMemorizeMode ? 'bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-white/10'}`}
                    >
                        <span className="sr-only">Toggle Memorize Mode</span>
                        <span
                            className={`${isMemorizeMode ? 'translate-x-7 bg-white' : 'translate-x-1 bg-white/70'} inline-block h-6 w-6 transform rounded-full transition-transform duration-300`}
                        />
                        {!isMemorizeMode && <span className="absolute right-2 text-[0.6rem] font-bold text-white/50 pointer-events-none">OFF</span>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pb-20">
                {namesOfAllah.map((name) => (
                    <NameCard
                        key={name.number}
                        nameData={name}
                        isMemorizeMode={isMemorizeMode}
                        isMemorized={memorizedIds.includes(name.number)}
                        onToggleMemorized={toggleMemorized}
                    />
                ))}
            </div>

        </div>
    );
}
