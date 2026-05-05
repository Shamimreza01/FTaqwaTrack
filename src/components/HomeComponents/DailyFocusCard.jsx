import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function DailyFocusCard() {
    return (
        <Link
            to="/daily-focus"
            className="group relative w-full sm:w-[calc(50%-12px)] md:w-[320px] bg-gradient-to-br from-[#0F172A]/80 to-[#020617]/90 backdrop-blur-xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[24px] overflow-hidden flex items-center justify-between transition-all duration-300 hover:bg-slate-900/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(99,102,241,0.2)] hover:border-indigo-500/50 p-6 min-h-[140px]"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="flex flex-col gap-2 z-10 w-2/3">
                <h3 className="text-xl font-bold text-white/90 group-hover:text-cyan-300 transition-colors duration-300">
                    Focus Timer
                </h3>
                <p className="text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Track your daily sessions
                </p>
                <div className="w-10 h-1 bg-indigo-500/50 rounded-full mt-2 group-hover:w-16 group-hover:bg-cyan-400 transition-all duration-500"></div>
            </div>

            <div className="z-10 bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors group-hover:rotate-12 group-hover:scale-110 shadow-lg relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 -z-10"></div>
                <i className="fa-solid fa-bullseye text-4xl text-indigo-400 group-hover:text-cyan-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"></i>
            </div>
        </Link>
    );
}
