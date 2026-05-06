import { useEffect, useState } from "react";
import { openDB } from "idb";
import { motion } from "framer-motion";
import NamesOfAllahShimmer from "../components/NamesOfAllahComponents/NamesOfAllahShimmer";
import NameCard from "../components/NamesOfAllahComponents/NameCard";
import { useTheme } from "../contexts/ThemeContext";
import { Gem } from "lucide-react";

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
    const { theme, s } = useTheme();
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
        <div className={`font-sans py-[80px] px-4 max-w-5xl mx-auto min-h-screen ${s.text} relative z-10`}>

            {/* Sticky Header with Controls */}
            <div className={`w-full ${s.nav} border-b ${theme === 'dark' ? 'border-white/10' : 'border-emerald-100'} p-4 fixed top-0 left-0 z-50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4`}>
                <h2 className={`font-bold text-xl flex items-center gap-2 ${theme === 'dark' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'text-emerald-700'}`}>
                    <Gem className="w-5 h-5"/>99 Names of Allah
                </h2>

                <div className="flex items-center gap-4">
                    {/* Progress Indicator */}
                    {isMemorizeMode && (
                        <div className={`${s.sectionAlt} px-4 py-1.5 rounded-full border ${theme === 'dark' ? 'border-white/5' : 'border-emerald-200'} flex items-center gap-3 shadow-inner`}>
                            <span className={`text-xs uppercase font-bold ${s.textSecondary} tracking-wider`}>Progress</span>
                            <span className={`${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'} font-bold tracking-widest`}>{memorizedIds.length} <span className="opacity-30">/</span> 99</span>
                        </div>
                    )}

                    {/* Memorize Mode Toggle */}
                    <button
                        onClick={() => setIsMemorizeMode(!isMemorizeMode)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none ${isMemorizeMode ? (theme === 'dark' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-emerald-500 shadow-md') : (theme === 'dark' ? 'bg-white/10' : 'bg-slate-200')}`}
                    >
                        <span className="sr-only">Toggle Memorize Mode</span>
                        <span
                            className={`${isMemorizeMode ? 'translate-x-7 bg-white shadow-sm' : `translate-x-1 ${theme === 'dark' ? 'bg-white/70' : 'bg-white shadow-sm'}`} inline-block h-6 w-6 transform rounded-full transition-transform duration-300`}
                        />
                        {!isMemorizeMode && <span className={`absolute right-2 text-[0.6rem] font-bold ${s.textSecondary} pointer-events-none`}>OFF</span>}
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
