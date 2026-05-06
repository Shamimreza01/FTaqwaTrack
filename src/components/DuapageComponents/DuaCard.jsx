import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export default function DuaCard({ edition, name, IconComponent }) {
  const { theme, s } = useTheme();

  return (
    <Link
      to={`/learn-dua/${edition}`}
      className={`group border w-full sm:w-[calc(50%-12px)] md:w-[260px] rounded-[24px] overflow-hidden flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-2 min-h-[200px] 
      ${theme === 'dark' ? 'border-emerald-500/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-emerald-900/20 hover:shadow-[0_15px_40px_rgba(52,211,153,0.15)] hover:border-emerald-500/40' : `${s.card} hover:${s.cardHover} border-emerald-500/20 hover:border-emerald-500/40 shadow-sm hover:shadow-lg`}`}
    >
      <div className="w-full h-full p-8 flex items-center justify-center relative overflow-hidden flex-1">
        {/* Decorative Background Element */}
        <div className={`absolute w-[150%] h-[150%] blur-[80px] rounded-full transition-colors duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'bg-emerald-500/5 group-hover:bg-amber-500/10' : 'bg-emerald-500/5 group-hover:bg-teal-500/10'}`}></div>

        {/* Dynamic SVG Illustration via Prop */}
        {IconComponent && (
          <IconComponent className={`w-16 h-16 ${theme === 'dark' ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] group-hover:text-amber-300 group-hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'text-emerald-600 group-hover:text-teal-600'} transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-2 z-10 relative`} />
        )}
      </div>

      <div className={`w-full px-5 pb-6 pt-4 flex flex-col justify-end items-center gap-3 relative z-10 border-t ${theme === 'dark' ? 'border-white/5 bg-black/10' : 'border-slate-100 bg-slate-50/50'}`}>
        <p className={`text-center text-[1rem] font-bold ${theme === 'dark' ? 'text-white/90 group-hover:text-amber-300' : 'text-slate-800 group-hover:text-teal-700'} transition-colors duration-300 leading-snug`}>
          {name}
        </p>
        <div className={`w-8 h-1 rounded-full group-hover:w-16 transition-all duration-500 ${theme === 'dark' ? 'bg-emerald-500/50 group-hover:bg-amber-400' : 'bg-emerald-300 group-hover:bg-teal-500'}`}></div>
      </div>
    </Link>
  );
}
