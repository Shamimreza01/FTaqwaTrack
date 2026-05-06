import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Check, Moon, Bell } from "lucide-react";

export default function SalahTime({ time, nextPrayerTime, prayerName }) {
  const [hasNext, setHasNext] = useState(true);
  const { theme, s } = useTheme();

  useEffect(() => {
    if (nextPrayerTime === "0h 0m 0s" || !nextPrayerTime) {
      if (!nextPrayerTime) return; // Ignore on initial load
      setHasNext(false);
    } else {
      setHasNext(true);
    }
  }, [nextPrayerTime]);

  const parseCountdown = (str) => {
    if (!str) return 0;
    const hours = str.match(/(\d+)h/)?.[1] || 0;
    const minutes = str.match(/(\d+)m/)?.[1] || 0;
    const seconds = str.match(/(\d+)s/)?.[1] || 0;
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  const remainingSeconds = parseCountdown(nextPrayerTime);
  const totalDaySeconds = 24 * 3600;
  const progress = Math.min(remainingSeconds / totalDaySeconds, 1);

  const size = 160;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const prayerTimes = [
    { label: "Fajr", value: time.fajr, key: "fajr" },
    { label: "Sunrise", value: time.sunrise, key: "sunrise" },
    { label: "Dhuhr", value: time.dhuhr, key: "dhuhr" },
    { label: "Asr", value: time.asr, key: "asr" },
    { label: "Maghrib", value: time.maghrib, key: "maghrib" },
    { label: "Isha", value: time.isha, key: "isha" },
  ];

  return (
    <motion.div
      className={`w-full ${s.card} rounded-[32px] p-6 shadow-2xl border transition-all duration-500 relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
        <Moon className={`w-24 h-24 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} />
      </div>

      {/* Header with next prayer indicator */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 relative z-10 w-full justify-center">
        <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
          {hasNext && nextPrayerTime ? (
            <>
              <motion.svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                initial={{ rotate: -90 }}
                animate={{ rotate: -90 }}
                transition={{ duration: 0 }}
                className={`absolute drop-shadow-[0_0_15px_${theme === 'dark' ? 'rgba(34,211,238,0.4)' : 'rgba(37,99,235,0.3)'}]`}
              >
                {/* Background track */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                  strokeWidth={strokeWidth}
                />
                {/* Animated progress circle */}
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={`url(#accentGradient-${theme})`}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: circumference * (1 - progress) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id={`accentGradient-dark`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <linearGradient
                    id={`accentGradient-light`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </motion.svg>
              <div className="flex flex-col items-center justify-center z-10">
                <span className={`text-xs uppercase tracking-widest ${s.accent} font-black mb-1`}>Next</span>
                <span className={`text-xl font-bold tracking-wider ${s.text}`}>{prayerName}</span>
                <span className={`text-[0.65rem] tracking-widest ${s.textSecondary} opacity-60 mt-1 uppercase font-bold`}>{nextPrayerTime}</span>
              </div>
            </>
          ) : (
            <div className={`flex flex-col items-center justify-center w-full h-full rounded-full border-2 border-dashed border-white/20`}>
              <Check className={`w-8 h-8 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} mb-2`} />
              <span className={`text-sm font-bold ${s.textSecondary} opacity-60`}>Done</span>
            </div>
          )}
        </div>
      </div>

      {/* Prayer times grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 relative z-10 w-full">
        {prayerTimes.map((prayer, index) => {
          const isNext = prayer.label === prayerName && hasNext;
          return (
            <motion.div
              key={prayer.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              className={`rounded-[16px] px-2 py-3 flex flex-col justify-center items-center backdrop-blur-md transition-all duration-300 border ${
                isNext 
                  ? (theme === 'dark' ? 'bg-cyan-500/20 border-cyan-500/50 shadow-lg' : 'bg-blue-500/10 border-blue-500/30 shadow-md') 
                  : `bg-white/5 border-white/10 hover:${s.cardHover}`
              }`}
            >
              <div className={`text-[0.65rem] sm:text-xs uppercase tracking-wider font-black mb-1 ${isNext ? s.accent : s.textSecondary + ' opacity-60'}`}>
                {prayer.label}
              </div>
              <div className={`text-sm sm:text-base font-bold tracking-wide ${isNext ? s.text : s.textSecondary}`}>
                {prayer.value || "--:--"}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
}
