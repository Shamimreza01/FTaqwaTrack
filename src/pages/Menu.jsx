import { Link } from "react-router-dom";
import { useSettings } from "../contexts/SettingsContext";
import { useRef } from "react";
import moment from "moment";
import { openDB } from "idb";

const initDailyDB = async () => {
    return openDB("dailyDB", 3, {
        upgrade(db, oldVersion, newVersion) {
            if (!db.objectStoreNames.contains("focus_sessions")) {
                db.createObjectStore("focus_sessions", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("salah_records")) {
                db.createObjectStore("salah_records", { keyPath: "date" });
            }
            if (!db.objectStoreNames.contains("daily_notes")) {
                db.createObjectStore("daily_notes", { keyPath: "date" });
            }
        },
    });
};

export default function Menu() {
    const { arabicFontSize, setArabicFontSize, translationFontSize, setTranslationFontSize } = useSettings();
    const fileInputRef = useRef(null);

    const handleExportData = async () => {
        try {
            const db = await initDailyDB();
            const allFocus = await db.getAll("focus_sessions");
            const allSalah = await db.getAll("salah_records");
            const allNotes = await db.getAll("daily_notes");

            const lsData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                lsData[key] = localStorage.getItem(key);
            }

            const backupData = {
                focus_sessions: allFocus,
                salah_records: allSalah,
                daily_notes: allNotes,
                local_storage: lsData,
                exportDate: new Date().toISOString()
            };

            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `TaqwaTrack-Backup-${moment().format('YYYY-MM-DD')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export data.");
        }
    };

    const handleImportData = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.focus_sessions && !data.salah_records && !data.daily_notes) {
                    alert("Invalid backup file format.");
                    return;
                }

                const db = await initDailyDB();
                
                if (data.focus_sessions) {
                    for (const session of data.focus_sessions) {
                        await db.put("focus_sessions", session);
                    }
                }
                
                if (data.salah_records) {
                    for (const record of data.salah_records) {
                        await db.put("salah_records", record);
                    }
                }

                if (data.daily_notes) {
                    for (const note of data.daily_notes) {
                        await db.put("daily_notes", note);
                    }
                }

                if (data.local_storage) {
                    Object.entries(data.local_storage).forEach(([key, value]) => {
                        localStorage.setItem(key, value);
                    });
                }

                alert("Data imported successfully! The page will now reload to apply all settings.");
                window.location.reload();
            } catch (error) {
                console.error("Import failed:", error);
                alert("Failed to read or import file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white relative">
            <div className="w-full bg-[#021B1A]/90 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md">
                <h2 className="text-center text-emerald-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                    <i className="fa-solid fa-bars mr-2"></i> Menu & Settings
                </h2>
            </div>

            <div className="flex flex-col gap-6 mt-8">

                {/* Settings Section */}
                <section className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <i className="fa-solid fa-font text-sm"></i>
                        </div>
                        Font Scaler Configuration
                    </h3>

                    {/* Arabic Font scale */}
                    <div className="flex flex-col gap-4 mb-8 pb-8 border-b border-white/5">
                        <div className="flex justify-between items-center text-white/80">
                            <span className="font-semibold">Arabic Size</span>
                            <span className="text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">{arabicFontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="20" max="80"
                            value={arabicFontSize}
                            onChange={(e) => setArabicFontSize(Number(e.target.value))}
                            className="w-full appearance-none h-2 bg-white/10 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 hover:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all"
                        />
                        <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-center mt-2 group">
                            <span className="font-arabic text-emerald-400 group-hover:-translate-y-1 transition-transform" style={{ fontSize: `${arabicFontSize}px` }}>بِسْمِ ٱللَّهِ</span>
                        </div>
                    </div>

                    {/* Translation Font scale */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center text-white/80">
                            <span className="font-semibold">Translation Size</span>
                            <span className="text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">{translationFontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="12" max="32"
                            value={translationFontSize}
                            onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                            className="w-full appearance-none h-2 bg-white/10 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 hover:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all"
                        />
                        <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-center mt-2 group text-center">
                            <span className="text-white/80 group-hover:-translate-y-1 transition-transform" style={{ fontSize: `${translationFontSize}px` }}>In the Name of Allah, the Most Beneficent, the Most Merciful</span>
                        </div>
                    </div>
                </section>

                {/* Data Backup & Restore Section */}
                <section className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <i className="fa-solid fa-cloud-arrow-up text-sm"></i>
                        </div>
                        Data Management
                    </h3>
                    
                    <p className="text-white/60 text-sm mb-6">
                        Securely backup all your Salah logs, Focus sessions, daily notes, Quran bookmarks, and settings to a local file. You can restore them later if you switch devices.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={handleExportData}
                            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-400 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-download"></i> Backup Data
                        </button>
                        
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-400 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-upload"></i> Restore Data
                        </button>
                        <input 
                            type="file" 
                            accept=".json" 
                            ref={fileInputRef} 
                            onChange={handleImportData} 
                            className="hidden" 
                        />
                    </div>
                </section>

                {/* User Links Section */}
                <section className="bg-white/5 border border-white/10 rounded-[24px] p-2 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    <Link to="/" className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors text-white/80 hover:text-white border-b border-white/5">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <i className="fa-solid fa-home"></i>
                        </div>
                        <span className="font-semibold text-lg flex-1">Back to Home</span>
                        <i className="fa-solid fa-chevron-right text-sm text-white/30"></i>
                    </Link>
                    <Link to="/collections" className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors text-white/80 hover:text-white border-b border-white/5">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <span className="font-semibold text-lg flex-1">My Collections</span>
                        <i className="fa-solid fa-chevron-right text-sm text-white/30"></i>
                    </Link>
                    <Link to="/quran" className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors text-white/80 hover:text-white">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <i className="fa-solid fa-book-open"></i>
                        </div>
                        <span className="font-semibold text-lg flex-1">Al-Quran Library</span>
                        <i className="fa-solid fa-chevron-right text-sm text-white/30"></i>
                    </Link>
                </section>

            </div>
        </div>
    );
}
