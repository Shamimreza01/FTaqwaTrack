import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function SandITime({ time }) {
  const { suhoor, maghrib } = time;
  const { theme, s } = useTheme();

  return (
    <div className="flex justify-center gap-4 w-full">
      <div className={`flex-1 ${s.card} border rounded-[20px] p-4 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-105`}>
        <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-200' : 'text-blue-400'} mb-2 drop-shadow-md`} />
        <div className={`text-xs font-bold ${s.textSecondary} uppercase tracking-widest opacity-60`}>Suhoor</div>
        <div className={`text-xl font-black ${s.text} tracking-widest mt-1`}>{suhoor || "--:--"}</div>
      </div>

      <div className={`flex-1 ${s.card} border rounded-[20px] p-4 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-105`}>
        <Sun className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-400' : 'text-orange-500'} mb-2 drop-shadow-md`} />
        <div className={`text-xs font-bold ${s.textSecondary} uppercase tracking-widest opacity-60`}>Iftar</div>
        <div className={`text-xl font-black ${s.text} tracking-widest mt-1`}>{maghrib || "--:--"}</div>
      </div>
    </div>
  );
}
