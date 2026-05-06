import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Calendar } from "lucide-react";

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState({});
  const { theme, s } = useTheme();
  const localTimeZone = moment.tz.guess();

  useEffect(() => {
    const updateDateTime = () => {
      const now = moment().tz(localTimeZone);

      setCurrentTime(now.format("hh:mm"));
      setCurrentDate({
        date: now.date(),
        month: now.format("MMMM"),
        year: now.year(),
        dayName: now.format("dddd"),
        amPm: now.format("A")
      });
    };

    const intervalId = setInterval(updateDateTime, 1000);
    updateDateTime();

    return () => clearInterval(intervalId);
  }, [localTimeZone]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-baseline justify-center gap-2">
        <h1 className={`text-7xl font-black tracking-tight ${s.text} drop-shadow-md`}>
          {currentTime || "00:00"}
        </h1>
        <span className={`text-2xl font-bold ${s.accent} uppercase tracking-widest`}>{currentDate.amPm}</span>
      </div>

      <div className={`mt-4 ${s.sectionAlt} border ${theme === 'dark' ? 'border-cyan-500/30' : 'border-blue-500/20'} backdrop-blur-sm px-6 py-2 rounded-full shadow-inner flex items-center gap-3 transition-all duration-500`}>
        <Calendar className={`w-4 h-4 ${s.accent}`} />
        <span className={`text-sm font-bold ${s.text} tracking-wide`}>
          {currentDate.dayName ? `${currentDate.dayName}, ${currentDate.date} ${currentDate.month} ${currentDate.year}` : "Loading..."}
        </span>
      </div>
    </div>
  );
}
