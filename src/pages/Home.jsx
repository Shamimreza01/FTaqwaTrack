import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CurrentTime from "../components/HomeComponents/CurrentTime";
import Header from "../components/HomeComponents/Header";
import SalahTime from "../components/HomeComponents/SalahTime";
import SandITime from "../components/HomeComponents/SandITime";
import AsmaUlHusnaCard from "../components/HomeComponents/AsmaUlHusnaCard";
import DailyCard from "../components/HomeComponents/DailyCard";
import useCustomFunction from "../hooks/useCustomFunction";
import { getLocationName } from "../utils/api.js";

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
          localStorage.getItem("position")
        );
        setCoords({ latitude, longitude });
        const { prayerTimes, localTimeZone, results } = getAllTime(
          latitude,
          longitude
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
      longitude
    );
    const name = await getLocationName(latitude, longitude);
    setTime(results);
    setLocationName(name);
    setNextPrayerTime("");
    localStorage.setItem("locationName", JSON.stringify(name));
    setPrayerTimes(prayerTimes);
    setLocalTimeZone(localTimeZone);
  };

  return (
    <div className="z-10 relative px-4 w-full max-w-xl lg:max-w-[1440px] mx-auto transition-all duration-500">
      <Header
        location={locationName}
        getGeolocation={getGeolocation}
        fetchLocationAndTime={fetchLocationAndTime}
      />
      <div className="w-full pb-16 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Area: Time & Prayers (Sticky on Desktop) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="bg-emerald-950/20 backdrop-blur-xl border border-emerald-500/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group hidden lg:block">
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-all duration-700"></div>
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
            <div className="bg-gradient-to-br from-emerald-900/10 to-[#021B1A]/40 backdrop-blur-md border border-emerald-500/10 rounded-[32px] p-4 lg:p-8 shadow-xl">
              <SandITime time={time} />
            </div>

            {/* Grid of Interaction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* My Collections - Featured Card */}
              <Link to="/collections" className="md:col-span-2 group">
                <div className="h-full bg-gradient-to-r from-emerald-900/60 to-[#021B1A]/80 border border-emerald-500/30 rounded-[32px] p-6 lg:p-10 relative overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-400/20 transition-all duration-700"></div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:rotate-6 transition-all duration-500">
                          <i className="fa-solid fa-layer-group text-3xl lg:text-4xl text-emerald-400"></i>
                        </div>
                        <div>
                          <h3 className="text-2xl lg:text-4xl font-black text-white tracking-tight">My Collections</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Cloud Sync</span>
                             <span className="text-emerald-400/60 text-xs font-medium italic">Your spiritual journey, saved.</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-emerald-100/70 text-base lg:text-xl leading-relaxed max-w-2xl mt-2 font-medium">
                        Access all your bookmarked Ayahs, favorited Duas, and memorization progress in one centralized premium dashboard.
                      </p>
                    </div>
                    
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500 transition-all duration-500 self-end lg:self-center shadow-2xl group-hover:scale-110">
                      <i className="fa-solid fa-chevron-right text-emerald-400 group-hover:text-white text-2xl"></i>
                    </div>
                  </div>
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
