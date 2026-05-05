import { Link } from "react-router-dom";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-sans text-white relative z-10 px-4 bg-gradient-to-br from-[#021B1A] via-[#052C2D] to-[#0A192F]">
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[-10%] w-[30vw] h-[30vw] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="bg-[#021B1A]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-w-2xl text-center flex flex-col items-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <i className="fa-solid fa-person-digging text-5xl text-amber-400"></i>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-emerald-400">
          Page Under Construction
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 font-light">
          Good things take time... Even Jannah wasn't built in a day! <span className="opacity-80">😅</span>
        </p>

        <div className="bg-white/5 border-l-4 border-emerald-500 p-6 rounded-r-xl text-left italic text-white/70 mb-8 max-w-xl shadow-inner">
          <p className="mb-3 text-[1.1rem] leading-relaxed">
            "And be patient, for indeed, Allah does not allow the reward of those
            who do good to be lost." <br /><span className="text-emerald-400/80 font-bold not-italic text-sm tracking-widest uppercase block mt-2">Quran 11:115</span>
          </p>
          <p className="text-sm border-t border-white/10 pt-3 text-white/50 not-italic">
            We are working hard. Insha'Allah it will be ready soon! 🛠️
          </p>
        </div>

        <Link
          to="/"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
        >
          <i className="fa-solid fa-house transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"></i>
          Return to Safety
        </Link>
      </div>
    </div>
  );
}
