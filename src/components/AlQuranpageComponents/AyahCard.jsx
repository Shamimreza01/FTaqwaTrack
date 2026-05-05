import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";

export default function AyahCard({ ayah, isMemorizeMode, isMemorized, onToggleMemorized }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const { arabicFontSize, translationFontSize, bookmarkId, toggleBookmark, favoriteAyahIds, toggleFavorite } = useSettings();

    const isBookmarked = bookmarkId === ayah.number.toString();
    const isFavorited = favoriteAyahIds.includes(ayah.number);

    const handleReveal = () => {
        if (isMemorizeMode && !isRevealed) {
            setIsRevealed(true);
        }
    };

    useEffect(() => {
        if (!isMemorizeMode) setIsRevealed(true);
        else setIsRevealed(false);
    }, [isMemorizeMode]);

    return (
        <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleReveal}
            className={`relative p-6 rounded-2xl border backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300 flex flex-col gap-5
          ${isMemorized ? 'bg-emerald-900/40 border-emerald-500/50 shadow-[#10b98133]' : 'bg-white/5 border-white/10 hover:bg-white/10'}
          ${isMemorizeMode && !isRevealed ? 'cursor-pointer' : ''}
        `}
        >

            {/* Memorization Mark Overlay */}
            <div className="absolute top-4 left-6 z-20">
                <AnimatePresence>
                    {isMemorizeMode && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleMemorized(ayah.number); // Ayah global number across Quran, uniquely identifies it!
                            }}
                            className={`px-3 py-1 rounded-full text-[0.65rem] font-bold font-sans uppercase tracking-wider backdrop-blur-md transition-all border flex items-center gap-1 shadow-lg
                        ${isMemorized
                                    ? 'bg-emerald-500 text-white border-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                    : 'bg-black/40 text-white/50 border-white/20 hover:bg-black/60 hover:text-white'}
                    `}
                        >
                            <i className={`fa-solid ${isMemorized ? 'fa-check-circle' : 'fa-circle'}`}></i>
                            {isMemorized ? 'Memorized' : 'Hifz'}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                {(!isMemorizeMode || isRevealed) ? (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        className="flex flex-col gap-5 relative z-10 w-full"
                    >
                        <div
                            className="leading-relaxed text-right font-arabic pt-2 transition-all duration-300"
                            style={{ fontSize: `${arabicFontSize}px` }}
                        >
                            {ayah.textArabic}
                            {ayah.sajda && <span className="mx-2 text-[0.35em] font-bold bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/30 inline-block align-middle mb-2">Sajda</span>}
                            <span className={`inline-flex w-[1.5em] h-[1.5em] ml-2 rounded-full border items-center justify-center text-[0.4em] font-bold
                    ${isMemorized ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300'}
                  `}>
                                {ayah.numberInSurah}
                            </span>
                        </div>

                        <div
                            className="text-white/80 leading-relaxed border-t border-white/10 pt-5 transition-all duration-300"
                            style={{ fontSize: `${translationFontSize}px` }}
                        >
                            {ayah.textBangla}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-white/5 pt-4 mt-2">
                            {ayah.audioLink && (
                                <div className="flex-1 w-full rounded-xl overflow-hidden shadow-inner bg-white/10" onClick={(e) => e.stopPropagation()}>
                                    <audio controls className="w-full h-12 invert contrast-150 grayscale sepia hue-rotate-180 opacity-80 mix-blend-screen outline-none">
                                        <source src={ayah.audioLink} type="audio/mpeg" />
                                    </audio>
                                </div>
                            )}

                            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(ayah.number); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${isFavorited ? 'bg-red-500/20 border-red-500/50 text-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <i className={`fa-solid fa-heart`}></i>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleBookmark(ayah.number.toString()); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${isBookmarked ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <i className={`fa-solid fa-bookmark`}></i>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex w-full flex-col items-center justify-center py-6 relative z-10 min-h-[120px]"
                    >
                        <div className="absolute right-4 text-[40px] font-arabic opacity-10 blur-md select-none">{ayah.textArabic.substring(0, 30)}...</div>

                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-2 group-hover:scale-110 transition-transform duration-300 z-10">
                            <i className="fa-solid fa-eye text-emerald-400/50 text-xl group-hover:text-emerald-400 transition-colors"></i>
                        </div>
                        <p className="text-emerald-400/50 font-medium tracking-wide text-sm z-10">Tap to reveal Ayah</p>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.li>
    );
}
