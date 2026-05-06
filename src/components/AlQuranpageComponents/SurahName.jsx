import { useTheme } from "../../contexts/ThemeContext";
export default function SurahName({ surah }) {
  const { theme, s } = useTheme();
  return (
    <li
      className={`cursor-pointer p-4 rounded-2xl ${s.card} border ${theme === "dark" ? "border-white/10 hover:bg-white/10 hover:border-emerald-500/30" : "border-slate-200 hover:bg-slate-50 hover:border-emerald-400"} backdrop-blur-md shadow-sm transition-all hover:-translate-y-1 flex items-center justify-between group`}
    >
      <div className="flex gap-3 items-center">
        <span
          className={`w-8 h-8 rounded-full ${theme === "dark" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white" : "bg-emerald-100 text-emerald-700 border-emerald-300 group-hover:bg-emerald-600 group-hover:text-white"} flex items-center justify-center font-bold text-sm border transition-colors`}
        >
          {surah.number}
        </span>
        <span
          className={`font-semibold ${theme === "dark" ? "text-white/90" : "text-slate-800"}`}
        >
          {surah.englishName}
        </span>
      </div>
      <span
        className={`text-xl ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"} font-arabic`}
      >
        {surah.name}
      </span>
    </li>
  );
}
