import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AsmaUlHusnaCard from "../components/HomeComponents/AsmaUlHusnaCard";
import CurrentTime from "../components/HomeComponents/CurrentTime";
import DailyCard from "../components/HomeComponents/DailyCard";
import Header from "../components/HomeComponents/Header";
import SalahTime from "../components/HomeComponents/SalahTime";
import SandITime from "../components/HomeComponents/SandITime";
import useCustomFunction from "../hooks/useCustomFunction";
import { getLocationName } from "../utils/api.js";
import { useTheme } from "../contexts/ThemeContext";
import { Layers, ChevronRight } from "lucide-react";

export default function Home() {
  const { getGeolocation } = useCustomFunction();
  const [locationName, setLocationName] = useState("");
  const [time, setTime] = useState({});
  const [coords, setCoords] = useState(null);
  const [nextPrayerTime, setNextPrayerTime] = useState("");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [localTimeZone, setLocalTimeZone] = useState("");
  const [prayerName, setPrayerName] = useState("");

  const formatTime = (date, timeZone) => {
    return moment(date).tz(timeZone).format("hh:mm A");
  };

  const getAllTime = (latitude, longitude) => {
    const coordinates = new Coordinates(latitude, longitude);
    const date = new Date();
    const params = CalculationMethod.UmmAlQura();
    params.adjustments.maghrib = 2;
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    const localTimeZone = moment.tz.guess();
    const results = {
      suhoor: formatTime(prayerTimes.fajr - 3, localTimeZone),
      fajr: formatTime(prayerTimes.fajr, localTimeZone),
      sunrise: formatTime(prayerTimes.sunrise, localTimeZone),
      dhuhr: formatTime(prayerTimes.dhuhr, localTimeZone),
      asr: formatTime(prayerTimes.asr, localTimeZone),
      maghrib: formatTime(prayerTimes.maghrib, localTimeZone),
      isha: formatTime(prayerTimes.isha, localTimeZone),
      timeZone: localTimeZone,
    };
    return { prayerTimes, localTimeZone, results };
  };

  const getNextPrayerTime = (prayerTimes, localTimeZone) => {
    const nextPrayer = prayerTimes.nextPrayer();
    setPrayerName(nextPrayer);
    const now = moment.tz(localTimeZone);
    const nextPrayerMoment = moment(prayerTimes[nextPrayer]).tz(localTimeZone);
    const duration = moment.duration(nextPrayerMoment.diff(now));
    const countdown = `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
    return { countdown, nextPrayer };
  };

  useEffect(() => {
    const loadData = async () => {
      if (
        localStorage.getItem("position") &&
        localStorage.getItem("locationName")
      ) {
        const { latitude, longitude } = JSON.parse(
          localStorage.getItem("position"),
        );
        setCoords({ latitude, longitude });
        const { prayerTimes, localTimeZone, results } = getAllTime(
          latitude,
          longitude,
        );
        setTime(results);
        setLocationName(JSON.parse(localStorage.getItem("locationName")));
        setPrayerTimes(prayerTimes);
        setLocalTimeZone(localTimeZone);
      } else {
        const pos = await getGeolocation();
        setCoords(pos);
        fetchLocationAndTime(pos.latitude, pos.longitude);
        console.log("Fetching data from API");
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (prayerTimes && localTimeZone) {
      const interval = setInterval(() => {
        const { countdown } = getNextPrayerTime(prayerTimes, localTimeZone);
        setNextPrayerTime(countdown);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [prayerTimes, localTimeZone]);

  const fetchLocationAndTime = async (latitude, longitude) => {
    const { prayerTimes, localTimeZone, results } = getAllTime(
      latitude,
      longitude,
    );
    const name = await getLocationName(latitude, longitude);
    setTime(results);
    setLocationName(name);
    setNextPrayerTime("");
    localStorage.setItem("locationName", JSON.stringify(name));
    setPrayerTimes(prayerTimes);
    setLocalTimeZone(localTimeZone);
  };

  const { theme, s } = useTheme();

  return (
    <div className={`z-10 relative px-4 w-full max-w-xl lg:max-w-[1440px] mx-auto transition-all duration-500 ${s.text}`}>
      <Header
        location={locationName}
        getGeolocation={getGeolocation}
        fetchLocationAndTime={fetchLocationAndTime}
      />
      <div className="w-full pb-16 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Area: Time & Prayers (Sticky on Desktop) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className={`${s.card} border rounded-[32px] p-8 shadow-2xl relative overflow-hidden group hidden lg:block`}>
              <div className={`absolute -right-20 -top-20 w-60 h-60 ${theme === 'dark' ? 'bg-cyan-500/5' : 'bg-blue-500/5'} rounded-full blur-[80px] group-hover:scale-110 transition-all duration-700`}></div>
              <CurrentTime />
            </div>

            {/* Mobile Time View (Simple) */}
            <div className="lg:hidden">
              <CurrentTime />
            </div>

            <SalahTime
              time={time}
              nextPrayerTime={nextPrayerTime}
              prayerName={prayerName}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
            <div className={`${s.card} border rounded-[32px] p-4 lg:p-8 shadow-xl relative overflow-hidden`}>
              <div className={`absolute -left-20 -bottom-20 w-60 h-60 ${theme === 'dark' ? 'bg-cyan-500/5' : 'bg-blue-500/5'} rounded-full blur-[80px] pointer-events-none`}></div>
              <SandITime time={time} />
            </div>

            {/* Grid of Interaction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* My Collections - Small Card */}
              <Link to="/collections" className={`group relative w-full flex items-center justify-between rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-2 p-6 min-h-[140px] border shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-[#052C2D]/80 to-[#021B1A]/90 backdrop-blur-xl border-emerald-500/20 hover:shadow-[0_15px_40px_rgba(52,211,153,0.2)] hover:border-emerald-500/50' : 'bg-white border-emerald-200 hover:shadow-[0_15px_40px_rgba(52,211,153,0.12)] hover:border-emerald-400'}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="flex flex-col gap-2 z-10 w-2/3">
                      <h3 className={`text-xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white/90 group-hover:text-amber-300' : 'text-slate-800 group-hover:text-emerald-700'}`}>
                          Collections
                      </h3>
                      <p className={`text-sm transition-colors ${theme === 'dark' ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-emerald-600 group-hover:text-emerald-800'}`}>
                          Saved Ayahs & Duas
                      </p>
                      <div className={`w-10 h-1 rounded-full mt-2 group-hover:w-16 transition-all duration-500 ${theme === 'dark' ? 'bg-emerald-500/50 group-hover:bg-amber-400' : 'bg-emerald-200 group-hover:bg-emerald-500'}`} />
                  </div>

                  <div className={`z-10 p-4 rounded-2xl border transition-all group-hover:-rotate-3 group-hover:scale-110 shadow-lg relative ${theme === 'dark' ? 'bg-white/5 border-white/10 group-hover:bg-white/10' : 'bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100'}`}>
                      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 -z-10" />
                      <Layers className={`w-10 h-10 transition-colors drop-shadow-lg ${theme === 'dark' ? 'text-emerald-400 group-hover:text-amber-300' : 'text-emerald-500 group-hover:text-emerald-700'}`} />
                  </div>
              </Link>

              {/* Names of Allah Card */}
              <div className="w-full">
                <AsmaUlHusnaCard />
              </div>

              {/* Daily Tracker Card */}
              <div className="w-full">
                <DailyCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
