import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AsmaUlHusnaCard() {
    return (
        <Link
            to="/99-names"
            className="group relative w-full sm:w-[calc(50%-12px)] md:w-[320px] bg-gradient-to-br from-[#052C2D]/80 to-[#021B1A]/90 backdrop-blur-xl border border-emerald-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[24px] overflow-hidden flex items-center justify-between transition-all duration-300 hover:bg-emerald-900/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(52,211,153,0.2)] hover:border-emerald-500/50 p-6 min-h-[140px]"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="flex flex-col gap-2 z-10 w-2/3">
                <h3 className="text-xl font-bold text-white/90 group-hover:text-amber-300 transition-colors duration-300">
                    99 Names
                </h3>
                <p className="text-sm text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    Asma-ul-Husna
                </p>
                <div className="w-10 h-1 bg-emerald-500/50 rounded-full mt-2 group-hover:w-16 group-hover:bg-amber-400 transition-all duration-500"></div>
            </div>

            <div className="z-10 bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors group-hover:-rotate-3 group-hover:scale-110 shadow-lg relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 -z-10"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-emerald-400 group-hover:text-amber-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
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
