import { useTheme } from "../../contexts/ThemeContext";
export default function SurahSearchBar({ searchQuery, setSearchQuery }) {
  const { theme, s } = useTheme();
  return (
    <div className="relative mt-8 mb-6 mx-auto z-10 group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <i
          className={`fa-solid fa-search ${theme === "dark" ? "text-emerald-500/50 group-focus-within:text-emerald-400" : "text-emerald-600/50 group-focus-within:text-emerald-600"} transition-colors`}
        ></i>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full ${s.card} border ${theme === "dark" ? "border-white/10" : "border-slate-200"} rounded-full py-4 pl-12 pr-4 ${s.text} ${theme === "dark" ? "placeholder-white/40" : "placeholder-slate-400"} focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 backdrop-blur-md shadow-sm transition-all`}
        placeholder="Search surah name, number, or go to 36:15..."
      />
    </div>
  );
}
