import DuaCard from "../components/DuapageComponents/DuaCard";
import HandsPrayingIcon from "../Icons/HandsPrayingIcon";
import MosqueIcon from "../Icons/MosqueIcon";
import StarSparkleIcon from "../Icons/StarSparkleIcon";

export default function DuaCardContainer() {
  return (
    <div className="min-h-full font-sans text-white relative z-10">
      <div className="w-full text-center bg-[#021B1A]/80 backdrop-blur-xl border-b border-white/10 text-emerald-400 p-4 font-bold text-xl fixed top-0 left-0 z-20 shadow-lg">
        Dua Collection
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
