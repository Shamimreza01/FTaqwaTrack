export default function SandITime({ time }) {
  const { suhoor, maghrib } = time;
  return (
    <div className="flex justify-center gap-4 w-full">
      <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:scale-105">
        <i className="fa-regular fa-moon text-amber-200 text-2xl mb-2 drop-shadow-[0_0_8px_rgba(253,230,138,0.6)]"></i>
        <div className="text-sm text-white/70 tracking-wide font-medium">Suhoor</div>
        <div className="text-xl font-bold text-white tracking-widest mt-1">{suhoor || "--:--"}</div>
      </div>

      <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:scale-105">
        <i className="fa-solid fa-sun text-amber-400 text-2xl mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"></i>
        <div className="text-sm text-white/70 tracking-wide font-medium">Iftar</div>
        <div className="text-xl font-bold text-white tracking-widest mt-1">{maghrib || "--:--"}</div>
      </div>
    </div>
  );
}
