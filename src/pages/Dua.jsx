import DuaCard from "../components/DuapageComponents/DuaCard";
import { useTheme } from "../contexts/ThemeContext";
import HandsPrayingIcon from "../Icons/HandsPrayingIcon";
import MosqueIcon from "../Icons/MosqueIcon";
import StarSparkleIcon from "../Icons/StarSparkleIcon";

export default function DuaCardContainer() {
  const { theme, s } = useTheme();

  return (
    <div className={`min-h-full font-sans ${s.text} relative z-10`}>
      <div className={`w-full text-center ${s.nav} border-b ${theme === 'dark' ? 'border-white/10' : 'border-emerald-100'} p-4 font-bold text-xl fixed top-0 left-0 z-20 shadow-lg`}>
        <span className={theme === 'dark' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'text-emerald-700'}>
          Dua Collection
        </span>
      </div>

      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center p-4 pt-[90px] pb-[100px] max-w-5xl mx-auto">
        <DuaCard
          edition={"FortyRabbanaDua"}
          name="৪০ রাব্বানা দোয়া"
          IconComponent={HandsPrayingIcon}
        />
        <DuaCard
          edition={"AfterSalahDua"}
          name="সালাত পরবর্তী দোয়া"
          IconComponent={MosqueIcon}
        />
        <DuaCard
          edition={"FortyMotivationalAyah"}
          name="40 Motivational ayah with Bangla"
          IconComponent={StarSparkleIcon}
        />
      </div>
    </div>
  );
}
