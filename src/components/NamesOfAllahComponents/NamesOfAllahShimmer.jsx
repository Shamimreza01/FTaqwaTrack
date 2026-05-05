export default function NamesOfAllahShimmer() {
    return (
        <div className="font-sans py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white">
            <div className="w-full text-center bg-[#021B1A]/80 backdrop-blur-xl border-b border-white/10 text-emerald-400 p-4 font-bold text-xl fixed top-0 left-0 z-20 shadow-md">
                <div className="w-48 h-6 bg-white/10 rounded-full animate-pulse mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-6 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-md min-h-[160px] flex flex-col gap-4 relative overflow-hidden">
                        {/* Shimmer gradient */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>

                        <div className="flex justify-between items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/10"></div>
                            <div className="w-1/3 h-8 bg-white/10 rounded-lg"></div>
                        </div>
                        <div className="w-full h-px bg-white/5 my-2"></div>
                        <div className="w-1/2 h-5 bg-white/10 rounded-md"></div>
                        <div className="w-full h-8 bg-white/10 rounded-md mt-2"></div>
                        <div className="w-3/4 h-8 bg-white/10 rounded-md"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
