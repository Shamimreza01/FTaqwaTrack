import { Link } from "react-router-dom";
import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";
import { useRef } from "react";
import moment from "moment";
import { initDailyDB } from "../utils/db";
import { 
  Type, 
  Download, 
  Upload, 
  Home as HomeIcon, 
  Layers, 
  BookOpen, 
  ChevronRight, 
  Menu as MenuIcon,
  Sun,
  Moon,
  Settings2
} from "lucide-react";

export default function Menu() {
    const { arabicFontSize, setArabicFontSize, translationFontSize, setTranslationFontSize } = useSettings();
    const { theme, setTheme, toggleTheme, s } = useTheme();
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
        <div className={`font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen ${s.text} relative`}>
            <div className={`w-full ${s.nav} border-b p-4 fixed top-0 left-0 z-50 shadow-md`}>
                <h2 className={`${s.accent} font-bold text-xl flex items-center justify-center gap-2`}>
                    <MenuIcon className="w-5 h-5" /> Menu & Settings
                </h2>
            </div>

            <div className="flex flex-col gap-6 mt-8">

                {/* Appearance Section */}
                <section className={`${s.card} rounded-[24px] p-6 shadow-xl`}>
                    <h3 className={`text-xl font-bold ${s.accent} mb-6 flex items-center gap-3`}>
                        <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-blue-500/20'} flex items-center justify-center`}>
                            <Settings2 className="w-5 h-5" />
                        </div>
                        Appearance Settings
                    </h3>

                    <div className="flex flex-col gap-4">
                        <label className={`text-sm font-semibold opacity-70 px-1 ${s.text}`}>Theme Mode</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold transition-all ${
                                    theme === 'light' 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                                    : `${s.sectionAlt} ${s.textSecondary} border-white/10 hover:bg-white/10`
                                }`}
                            >
                                <Sun className="w-4 h-4" /> Light
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold transition-all ${
                                    theme === 'dark' 
                                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' 
                                    : `${s.sectionAlt} ${s.textSecondary} border-slate-200 hover:bg-slate-100`
                                }`}
                            >
                                <Moon className="w-4 h-4" /> Dark
                            </button>
                        </div>
                    </div>
                </section>

                {/* Settings Section */}
                <section className={`${s.card} rounded-[24px] p-6 shadow-xl`}>
                    <h3 className={`text-xl font-bold ${s.accent} mb-6 flex items-center gap-3`}>
                        <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-blue-500/20'} flex items-center justify-center`}>
                            <Type className="w-5 h-5" />
                        </div>
                        Font Scaler Configuration
                    </h3>

                    {/* Arabic Font scale */}
                    <div className={`flex flex-col gap-4 mb-8 pb-8 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                        <div className="flex justify-between items-center">
                            <span className={`font-semibold ${s.text}`}>Arabic Size</span>
                            <span className={`${s.accent} font-bold ${theme === 'dark' ? 'bg-white/5' : 'bg-blue-50 border border-blue-200'} px-3 py-1 rounded-full text-sm`}>{arabicFontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="20" max="80"
                            value={arabicFontSize}
                            onChange={(e) => setArabicFontSize(Number(e.target.value))}
                            className={`w-full appearance-none h-2 rounded-full outline-none cursor-pointer transition-all
                                ${theme === 'dark' ? 'bg-white/10 [&::-webkit-slider-thumb]:bg-cyan-400' : 'bg-slate-200 [&::-webkit-slider-thumb]:bg-blue-600'}
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md`}
                        />
                        <div className={`p-4 rounded-xl ${s.sectionAlt} border ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} flex items-center justify-center mt-2`}>
                            <span className="font-arabic" style={{ fontSize: `${arabicFontSize}px`, color: theme === 'dark' ? '#22d3ee' : '#2563eb' }}>بِسْمِ ٱللَّهِ</span>
                        </div>
                    </div>

                    {/* Translation Font scale */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className={`font-semibold ${s.text}`}>Translation Size</span>
                            <span className={`${s.accent} font-bold ${theme === 'dark' ? 'bg-white/5' : 'bg-blue-50 border border-blue-200'} px-3 py-1 rounded-full text-sm`}>{translationFontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="12" max="32"
                            value={translationFontSize}
                            onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                            className={`w-full appearance-none h-2 rounded-full outline-none cursor-pointer transition-all
                                ${theme === 'dark' ? 'bg-white/10 [&::-webkit-slider-thumb]:bg-amber-400' : 'bg-slate-200 [&::-webkit-slider-thumb]:bg-indigo-500'}
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md`}
                        />
                        <div className={`p-4 rounded-xl ${s.sectionAlt} border ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} flex items-center justify-center mt-2 text-center`}>
                            <span className={`${s.text} group-hover:-translate-y-1 transition-transform`} style={{ fontSize: `${translationFontSize}px` }}>In the Name of Allah, the Most Beneficent, the Most Merciful</span>
                        </div>
                    </div>
                </section>

                {/* Data Backup & Restore Section */}
                <section className={`${s.card} rounded-[24px] p-6 shadow-xl`}>
                    <h3 className={`text-xl font-bold ${s.accent} mb-6 flex items-center gap-3`}>
                        <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-blue-500/20'} flex items-center justify-center`}>
                            <Upload className="w-5 h-5" />
                        </div>
                        Data Management
                    </h3>
                    
                    <p className={`${s.textSecondary} text-sm mb-6 leading-relaxed`}>
                        Securely backup all your Salah logs, Focus sessions, daily notes, Quran bookmarks, and settings to a local file. You can restore them on any device.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={handleExportData}
                            className={`${s.buttonSecondary} py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2`}
                        >
                            <Download className="w-4 h-4" /> Backup Data
                        </button>
                        
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`${s.buttonPrimary} py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-transparent`}
                        >
                            <Upload className="w-4 h-4" /> Restore Data
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

                {/* Navigation Links */}
                <section className={`${s.card} border rounded-[24px] p-2 shadow-xl overflow-hidden`}>
                    {[
                        { to: "/", icon: HomeIcon, color: "emerald", label: "Back to Home" },
                        { to: "/collections", icon: Layers, color: "blue", label: "My Collections" },
                        { to: "/quran", icon: BookOpen, color: "amber", label: "Al-Quran Library" },
                    ].map(({ to, icon: Icon, color, label }, i, arr) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-4 p-4 transition-colors ${
                                i < arr.length - 1
                                    ? `border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`
                                    : ''
                            } ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                        >
                            <div className={`w-10 h-10 rounded-full bg-${color}-500/10 flex items-center justify-center text-${color}-${theme === 'dark' ? '400' : '600'}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`font-semibold text-lg flex-1 ${s.text}`}>{label}</span>
                            <ChevronRight className={`w-4 h-4 ${s.textSecondary} opacity-40`} />
                        </Link>
                    ))}
                </section>

            </div>
        </div>
    );
}
