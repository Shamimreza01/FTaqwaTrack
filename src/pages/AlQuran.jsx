import AlQuranCard from "../components/AlQuranpageComponents/AlQuranCard";
import QuranBookIcon from "../Icons/QuranBookIcon";
import LanguageIcon from "../Icons/LanguageIcon";
import GlobeIcon from "../Icons/GlobeIcon";
import ArabicCalligraphyIcon from "../Icons/ArabicCalligraphyIcon";

export default function ItemCardContainer() {
  return (
    <div className="min-h-full font-sans text-white relative z-10">
      <div className="w-full text-center bg-[#021B1A]/80 backdrop-blur-xl border-b border-white/10 text-emerald-400 p-4 font-bold text-xl fixed top-0 left-0 z-20 shadow-lg">
        All Quran Collection
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
