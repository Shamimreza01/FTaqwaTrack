import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  location,
  getGeolocation,
  fetchLocationAndTime,
}) {
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);
    const location = await getGeolocation();
    await fetchLocationAndTime(location.latitude, location.longitude);
    setLoading(false);
  };

  return (
    <div className="pt-6 pb-2 flex justify-center w-full">
      <div
        className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-white/15 transition-all duration-300 w-fit max-w-full"
        onClick={fetchLocation}
      >
        <div className={`flex items-center justify-center ${loading ? 'animate-pulse' : ''}`}>
          <i className="fa-solid fa-location-dot text-emerald-400 text-lg drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"></i>
        </div>

        <div className="overflow-hidden relative flex-1 min-w-[120px] max-w-[200px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-medium text-white/80 whitespace-nowrap"
              >
                Locating...
              </motion.div>
            ) : (
              <motion.div
                key="location"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-white truncate"
              >
                {location || "Unknown Location"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
