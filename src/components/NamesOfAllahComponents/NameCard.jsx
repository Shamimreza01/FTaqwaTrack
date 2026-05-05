import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NameCard({ nameData, isMemorizeMode, isMemorized, onToggleMemorized }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);

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
            className={`group relative p-6 rounded-[24px] border backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden flex flex-col gap-4 
        ${isMemorized ? 'bg-emerald-900/40 border-emerald-500/50 shadow-[#10b98133]' : 'bg-white/5 border-white/10 hover:bg-white/10'}
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
                ${isMemorized ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                        {nameData.number}
                    </span>
                    <button
                        onClick={toggleAudio}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
                    >
                        <i className={`fa-solid ${isPlaying ? 'fa-stop' : 'fa-play'} text-xs`}></i>
                    </button>
                </div>

                <div className="text-[36px] md:text-[44px] leading-tight text-right font-arabic text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] min-h-[60px]">
                    {nameData.arabic}
                </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"></div>

            <AnimatePresence mode="wait">
                {(!isMemorizeMode || isRevealed) ? (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        className="flex flex-col gap-3 relative z-10"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-amber-300 tracking-wide">{nameData.transliteration}</h3>
                            <p className="text-white/90 text-sm">{nameData.english}</p>
                        </div>

                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <h4 className="text-lg font-bold text-emerald-300">{nameData.bangla}</h4>
                            <p className="text-white/70 text-sm mt-1 leading-relaxed">{nameData.bangla_meaning}</p>
                            <p className="text-white/50 text-[0.75rem] mt-2 italic">{nameData.bangla_details}</p>
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
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-3 group-hover:scale-110 transition-transform duration-300">
                            <i className="fa-solid fa-eye text-emerald-400/50 text-2xl group-hover:text-emerald-400 transition-colors"></i>
                        </div>
                        <p className="text-emerald-400/50 font-medium tracking-wide">Tap to reveal meaning</p>
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
                            className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider backdrop-blur-md transition-all border flex items-center gap-2 shadow-lg
                        ${isMemorized
                                    ? 'bg-emerald-500 text-white border-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                                    : 'bg-black/40 text-white/50 border-white/20 hover:bg-black/60 hover:text-white'}
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
