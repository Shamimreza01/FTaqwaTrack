import AlQuranCard from "../components/AlQuranpageComponents/AlQuranCard";
import { useTheme } from "../contexts/ThemeContext";
import QuranBookIcon from "../Icons/QuranBookIcon";
import LanguageIcon from "../Icons/LanguageIcon";
import GlobeIcon from "../Icons/GlobeIcon";
import ArabicCalligraphyIcon from "../Icons/ArabicCalligraphyIcon";

export default function ItemCardContainer() {
  const { theme, s } = useTheme();

  return (
    <div className={`min-h-full font-sans ${s.text} relative z-10`}>
      <div className={`w-full text-center ${s.nav} border-b ${theme === 'dark' ? 'border-white/10' : 'border-emerald-100'} p-4 font-bold text-xl fixed top-0 left-0 z-20 shadow-lg`}>
        <span className={theme === 'dark' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'text-emerald-700'}>
          All Quran Collection
        </span>
      </div>

      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center p-4 pt-[90px] pb-[100px] max-w-5xl mx-auto">
        <AlQuranCard
          edition={"fullQuran"}
          name="আল-কোরআন আরবি বাংলা ও অডিও"
          IconComponent={QuranBookIcon}
        />
        <AlQuranCard
          edition={"bn.bengali"}
          name={"আল-কোরআন বাংলা "}
          IconComponent={LanguageIcon}
        />
        <AlQuranCard
          edition={"en.yusufali"}
          name={"Al-Quran English Translation"}
          IconComponent={GlobeIcon}
        />
        <AlQuranCard
          edition={"quran-uthmani"}
          name={"Al-Quran Arabic Non-Arab"}
          IconComponent={ArabicCalligraphyIcon}
        />
      </div>
    </div>
  );
}
