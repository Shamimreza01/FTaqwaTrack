import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

export default function NameCard({ nameData, isMemorizeMode, isMemorized, onToggleMemorized }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const { theme, s } = useTheme();

    const toggleAudio = (e) => {
        e.stopPropagation(); // prevent reveal click
        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleReveal = () => {
        if (isMemorizeMode && !isRevealed) {
            setIsRevealed(true);
        }
    };

    // Reset reveal state if memorize mode is toggled
    useEffect(() => {
        if (!isMemorizeMode) setIsRevealed(true);
        else setIsRevealed(false);
    }, [isMemorizeMode]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleReveal}
            className={`group relative p-6 rounded-[24px] border backdrop-blur-md shadow-sm transition-all duration-300 overflow-hidden flex flex-col gap-4 
        ${isMemorized ? (theme === 'dark' ? 'bg-emerald-900/40 border-emerald-500/50 shadow-[#10b98133]' : 'bg-emerald-50 border-emerald-300 shadow-emerald-500/10') : `${s.card} ${theme === 'dark' ? 'border-white/10 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-50 hover:border-emerald-300'}`}
        ${isMemorizeMode && !isRevealed ? 'cursor-pointer' : ''}
      `}
        >
            <audio
                ref={audioRef}
                src={nameData.audio_url}
                onEnded={() => setIsPlaying(false)}
                preload="none"
            />

            <div className="flex justify-between items-start w-full relative z-10">
                <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border 
                ${isMemorized ? 'bg-emerald-500 text-white border-emerald-400' : (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300')}`}>
                        {nameData.number}
                    </span>
                    <button
                        onClick={toggleAudio}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : (theme === 'dark' ? 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800')}`}
                    >
                        <i className={`fa-solid ${isPlaying ? 'fa-stop' : 'fa-play'} text-xs`}></i>
                    </button>
                </div>

                <div className={`text-[36px] md:text-[44px] leading-tight text-right font-arabic ${theme === 'dark' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-emerald-600'} min-h-[60px]`}>
                    {nameData.arabic}
                </div>
            </div>

            <div className={`w-full h-px bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-white/10' : 'via-slate-200'} to-transparent my-1`}></div>

            <AnimatePresence mode="wait">
                {(!isMemorizeMode || isRevealed) ? (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        className="flex flex-col gap-3 relative z-10"
                    >
                        <div>
                            <h3 className={`text-xl font-bold tracking-wide ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>{nameData.transliteration}</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-white/90' : 'text-slate-700'}`}>{nameData.english}</p>
                        </div>

                        <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>{nameData.bangla}</h4>
                            <p className={`text-sm mt-1 leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>{nameData.bangla_meaning}</p>
                            <p className={`text-[0.75rem] mt-2 italic ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>{nameData.bangla_details}</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center py-6 relative z-10"
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border mb-3 group-hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                            <i className={`fa-solid fa-eye text-2xl transition-colors ${theme === 'dark' ? 'text-emerald-400/50 group-hover:text-emerald-400' : 'text-emerald-500/60 group-hover:text-emerald-600'}`}></i>
                        </div>
                        <p className={`font-medium tracking-wide ${theme === 'dark' ? 'text-emerald-400/50' : 'text-emerald-600/70'}`}>Tap to reveal meaning</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <AnimatePresence>
                    {isMemorizeMode && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleMemorized(nameData.number);
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider backdrop-blur-md transition-all border flex items-center gap-2 shadow-md
                        ${isMemorized
                                    ? 'bg-emerald-500 text-white border-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                                    : (theme === 'dark' ? 'bg-black/40 text-white/50 border-white/20 hover:bg-black/60 hover:text-white' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-800')}
                    `}
                        >
                            <i className={`fa-solid ${isMemorized ? 'fa-check-circle' : 'fa-circle'}`}></i>
                            {isMemorized ? 'Memorized' : 'Mark Memorized'}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

        </motion.div>
    );
}
