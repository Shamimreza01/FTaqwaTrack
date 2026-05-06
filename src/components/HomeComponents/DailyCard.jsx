import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { CalendarDays } from "lucide-react";

export default function DailyCard() {
    const { theme, s } = useTheme();
    return (
        <Link
            to="/daily"
            className={`group relative w-full flex items-center justify-between rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-2 p-6 min-h-[140px] border shadow-lg ${
                theme === 'dark'
                    ? 'bg-gradient-to-br from-[#0F172A]/80 to-[#020617]/90 backdrop-blur-xl border-indigo-500/20 hover:shadow-[0_15px_40px_rgba(99,102,241,0.2)] hover:border-indigo-500/50'
                    : 'bg-white border-indigo-200 hover:shadow-[0_15px_40px_rgba(99,102,241,0.12)] hover:border-indigo-400'
            }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex flex-col gap-2 z-10 w-2/3">
                <h3 className={`text-xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white/90 group-hover:text-cyan-300' : 'text-slate-800 group-hover:text-indigo-600'}`}>
                    Daily Tracker
                </h3>
                <p className={`text-sm transition-colors ${theme === 'dark' ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-indigo-500 group-hover:text-indigo-700'}`}>
                    Salah &amp; Focus Sessions
                </p>
                <div className={`w-10 h-1 rounded-full mt-2 group-hover:w-16 transition-all duration-500 ${theme === 'dark' ? 'bg-indigo-500/50 group-hover:bg-cyan-400' : 'bg-indigo-200 group-hover:bg-indigo-500'}`} />
            </div>

            <div className={`z-10 p-4 rounded-2xl border transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg relative ${theme === 'dark' ? 'bg-white/5 border-white/10 group-hover:bg-white/10' : 'bg-indigo-50 border-indigo-200 group-hover:bg-indigo-100'}`}>
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 -z-10" />
                <CalendarDays className={`w-10 h-10 transition-colors drop-shadow-lg ${theme === 'dark' ? 'text-indigo-400 group-hover:text-cyan-300' : 'text-indigo-500 group-hover:text-indigo-700'}`} />
            </div>
        </Link>
    );
}
