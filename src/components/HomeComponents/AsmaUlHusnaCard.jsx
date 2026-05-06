import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export default function AsmaUlHusnaCard() {
    const { theme } = useTheme();
    return (
        <Link
            to="/99-names"
            className={`group relative w-full flex items-center justify-between rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-2 p-6 min-h-[140px] border shadow-lg ${
                theme === 'dark'
                    ? 'bg-gradient-to-br from-[#052C2D]/80 to-[#021B1A]/90 backdrop-blur-xl border-emerald-500/20 hover:shadow-[0_15px_40px_rgba(52,211,153,0.2)] hover:border-emerald-500/50'
                    : 'bg-white border-emerald-200 hover:shadow-[0_15px_40px_rgba(52,211,153,0.12)] hover:border-emerald-400'
            }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex flex-col gap-2 z-10 w-2/3">
                <h3 className={`text-xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white/90 group-hover:text-amber-300' : 'text-slate-800 group-hover:text-emerald-700'}`}>
                    99 Names
                </h3>
                <p className={`text-sm transition-colors ${theme === 'dark' ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-emerald-600 group-hover:text-emerald-800'}`}>
                    Asma-ul-Husna
                </p>
                <div className={`w-10 h-1 rounded-full mt-2 group-hover:w-16 transition-all duration-500 ${theme === 'dark' ? 'bg-emerald-500/50 group-hover:bg-amber-400' : 'bg-emerald-200 group-hover:bg-emerald-500'}`} />
            </div>

            <div className={`z-10 p-4 rounded-2xl border transition-all group-hover:-rotate-3 group-hover:scale-110 shadow-lg relative ${theme === 'dark' ? 'bg-white/5 border-white/10 group-hover:bg-white/10' : 'bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100'}`}>
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 -z-10" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                    className={`w-10 h-10 transition-colors drop-shadow-lg ${theme === 'dark' ? 'text-emerald-400 group-hover:text-amber-300' : 'text-emerald-500 group-hover:text-emerald-700'}`}
                >
                    <path d="m11.1 7.1 9.2 9.2" />
                    <path d="m20.3 16.3-9.2-9.2" />
                    <path d="m5.5 12.5 4.6 4.5" />
                    <path d="m10.1 17-4.6-4.5" />
                    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                </svg>
            </div>
        </Link>
    );
}
