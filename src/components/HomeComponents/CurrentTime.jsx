import moment from "moment-timezone";
import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState({});
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
        <h1 className="text-7xl font-light tracking-tight text-white drop-shadow-md">
          {currentTime || "00:00"}
        </h1>
        <span className="text-2xl font-medium text-emerald-400 uppercase tracking-widest">{currentDate.amPm}</span>
      </div>

      <div className="mt-4 bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-sm px-6 py-1.5 rounded-full shadow-inner flex items-center gap-2">
        <i className="fa-regular fa-calendar text-emerald-400 text-sm"></i>
        <span className="text-sm font-medium text-emerald-50 tracking-wide">
          {currentDate.dayName ? `${currentDate.dayName}, ${currentDate.date} ${currentDate.month} ${currentDate.year}` : "Loading..."}
        </span>
      </div>
    </div>
  );
}
