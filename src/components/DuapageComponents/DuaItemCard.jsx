import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { useTheme } from "../../contexts/ThemeContext";
import BookmarkIcon from "../../Icons/BookmarkIcon";
import HeartIcon from "../../Icons/HeartIcon";

export default function DuaItemCard({
  dua,
  dataName,
  uniqueId,
  isMemorizeMode,
  isMemorized,
  onToggleMemorized,
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const {
    arabicFontSize,
    translationFontSize,
    duaBookmarkId,
    toggleDuaBookmark,
    favoriteDuaIds,
    toggleFavoriteDua,
  } = useSettings();
  const { theme, s } = useTheme();

  const isBookmarked = duaBookmarkId === uniqueId;
  const isFavorited = favoriteDuaIds.includes(uniqueId);

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
      className={`relative p-6 rounded-2xl border backdrop-blur-md shadow-sm transition-all duration-300 flex flex-col gap-5
          ${isMemorized ? (theme === "dark" ? "bg-emerald-900/40 border-emerald-500/50 shadow-[#10b98133]" : "bg-emerald-50 border-emerald-300 shadow-emerald-500/10") : `${s.card} ${theme === "dark" ? "border-white/10 hover:bg-white/10" : "border-slate-200 hover:bg-slate-50 hover:border-emerald-300"}`}
          ${isMemorizeMode && !isRevealed ? "cursor-pointer" : ""}
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
                onToggleMemorized(uniqueId);
              }}
              className={`px-3 py-1 rounded-full text-[0.65rem] font-bold font-sans uppercase tracking-wider backdrop-blur-md transition-all border flex items-center gap-1 shadow-sm
                        ${
                          isMemorized
                            ? "bg-emerald-500 text-white border-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                            : theme === "dark"
                              ? "bg-black/40 text-white/50 border-white/20 hover:bg-black/60 hover:text-white"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-800"
                        }
                    `}
            >
              <i
                className={`fa-solid ${isMemorized ? "fa-check-circle" : "fa-circle"}`}
              ></i>
              {isMemorized ? "Memorized" : "Hifz"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {!isMemorizeMode || isRevealed ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="flex flex-col gap-5 relative z-10 w-full"
          >
            <div
              className={`${theme === "dark" ? "text-white" : "text-slate-800"} leading-relaxed text-right font-arabic pt-2 transition-all duration-300`}
              style={{ fontSize: `${arabicFontSize}px` }}
            >
              {dua.arabic}
            </div>

            <div
              className={`${theme === "dark" ? "text-white/80 border-white/10" : "text-slate-600 border-slate-200"} leading-relaxed border-t pt-5 transition-all duration-300`}
              style={{ fontSize: `${translationFontSize}px` }}
            >
              <span
                className={`font-bold mr-3 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
              >
                {dua.dua_number || dua.ayah_number}.
              </span>
              {dua.bangla_translation}
              <div
                className={`${theme === "dark" ? "text-white/60" : "text-slate-500"} text-sm mt-3 italic`}
              >
                {dua.bangla_pronunciation}
              </div>
            </div>

            <div
              className={`flex flex-col sm:flex-row items-center gap-4 border-t ${theme === "dark" ? "border-white/5" : "border-slate-100"} pt-4 mt-2 justify-between`}
            >
              {dua.audio_link && navigator.onLine ? (
                <div
                  className={`flex-1 w-full max-w-[200px] rounded-xl overflow-hidden shadow-inner ${theme === "dark" ? "bg-white/10" : "bg-slate-100"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <audio
                    controls
                    className={`w-full h-12 outline-none ${theme === "dark" ? "invert contrast-150 grayscale sepia hue-rotate-180 opacity-80 mix-blend-screen" : "opacity-80"}`}
                  >
                    <source src={dua.audio_link} type="audio/mpeg" />
                  </audio>
                </div>
              ) : (
                <div className="flex-1">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border max-w-[40%] text-right truncate ${theme === "dark" ? "text-emerald-500/80 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-700 bg-emerald-100 border-emerald-300"}`}
                  >
                    {dua.reference}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteDua(uniqueId);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${isFavorited ? (theme === "dark" ? "bg-red-500/20 border-red-500/50 text-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-red-100 border-red-300 text-red-600 scale-110 shadow-sm") : theme === "dark" ? "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-800"}`}
                >
                  <HeartIcon
                    className={`w-5 h-5 transition-colors ${isFavorited ? (theme === "dark" ? "text-red-500" : "text-red-600") : theme === "dark" ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-800"}`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDuaBookmark(uniqueId);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${isBookmarked ? (theme === "dark" ? "bg-amber-500/20 border-amber-500/50 text-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "bg-amber-100 border-amber-300 text-amber-600 scale-110 shadow-sm") : theme === "dark" ? "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-800"}`}
                >
                  <BookmarkIcon
                    className={`w-5 h-5 transition-colors ${isBookmarked ? (theme === "dark" ? "text-amber-500" : "text-amber-600") : theme === "dark" ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-800"}`}
                  />
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
            <div
              className={`absolute right-4 text-[40px] font-arabic ${theme === "dark" ? "opacity-10" : "opacity-5"} blur-md select-none ${theme === "dark" ? "text-white" : "text-slate-800"}`}
            >
              {dua.arabic.substring(0, 30)}...
            </div>

            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center border mb-2 group-hover:scale-110 transition-transform duration-300 z-10 ${theme === "dark" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`}
            >
              <i
                className={`fa-solid fa-eye text-xl transition-colors ${theme === "dark" ? "text-emerald-400/50 group-hover:text-emerald-400" : "text-emerald-500/60 group-hover:text-emerald-600"}`}
              ></i>
            </div>
            <p
              className={`font-medium tracking-wide text-sm z-10 ${theme === "dark" ? "text-emerald-400/50" : "text-emerald-600/70"}`}
            >
              Tap to reveal Dua
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
