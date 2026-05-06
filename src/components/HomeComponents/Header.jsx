import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { MapPin, Search, X, Loader2 } from "lucide-react";
import { searchCity } from "../../utils/api";

export default function Header({
  location,
  getGeolocation,
  fetchLocationAndTime,
}) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef(null);
  const { theme, s } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsEditing(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        const results = await searchCity(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchLocation = async () => {
    if (isEditing) return;
    setLoading(true);
    const loc = await getGeolocation();
    if (loc) {
        await fetchLocationAndTime(loc.latitude, loc.longitude);
    }
    setLoading(false);
  };

  const handleSelectCity = async (city) => {
    setIsEditing(false);
    setSearchQuery("");
    setLoading(true);
    await fetchLocationAndTime(city.lat, city.lon);
    setLoading(false);
  };

  return (
    <div className="pt-6 pb-2 flex justify-center w-full relative z-50">
      <div
        ref={wrapperRef}
        className={`relative flex items-center gap-3 ${s.nav} border rounded-full px-5 py-2.5 shadow-lg transition-all duration-300 w-full max-w-sm ${isEditing ? 'ring-2 ring-emerald-500' : `cursor-pointer hover:${s.cardHover}`}`}
        onClick={() => { if (!isEditing) setIsEditing(true); }}
      >
        <div className={`flex items-center justify-center ${loading && !isEditing ? 'animate-pulse' : ''}`}>
          {isEditing ? (
             <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
          ) : (
             <MapPin className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-emerald-600'} drop-shadow-md`} />
          )}
        </div>

        <div className="overflow-hidden relative flex-1 min-w-[120px]">
          <AnimatePresence mode="wait">
            {isEditing ? (
               <motion.div
                 key="input"
                 initial={{ opacity: 0, x: 10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
               >
                 <input
                   autoFocus
                   type="text"
                   placeholder="Search city..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className={`w-full bg-transparent border-none outline-none text-sm font-bold ${s.text} placeholder-${theme === 'dark' ? 'white/30' : 'slate-400'}`}
                 />
               </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm font-bold ${s.text} opacity-60 whitespace-nowrap`}
              >
                Locating...
              </motion.div>
            ) : (
              <motion.div
                key="location"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm font-bold ${s.text} truncate pr-6`}
              >
                {location || "Unknown Location"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isEditing && (
           <button 
             className={`absolute right-4 p-1 rounded-full hover:bg-black/10 transition-colors ${s.textSecondary}`} 
             onClick={(e) => { e.stopPropagation(); setIsEditing(false); setSearchQuery(""); }}
           >
             <X className="w-4 h-4" />
           </button>
        )}
        
        {!isEditing && (
           <button 
             className={`absolute right-4 p-1.5 rounded-full ${theme === 'dark' ? 'bg-white/10 hover:bg-emerald-500/30' : 'bg-slate-100 hover:bg-emerald-100'} transition-colors group`} 
             onClick={(e) => { e.stopPropagation(); fetchLocation(); }}
             title="Use GPS Location"
           >
             <MapPin className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-cyan-400 group-hover:text-emerald-400' : 'text-emerald-600'}`} />
           </button>
        )}

        {/* Autocomplete Dropdown */}
        <AnimatePresence>
          {isEditing && (searchQuery.length >= 3 || isSearching) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute top-[120%] left-0 w-full rounded-2xl ${s.card} border ${theme === 'dark' ? 'border-white/10 shadow-2xl shadow-black/50' : 'border-slate-200 shadow-xl'} overflow-hidden py-2 z-50 max-h-60 overflow-y-auto`}
            >
              {isSearching ? (
                <div className={`p-4 text-center text-sm font-bold flex justify-center items-center gap-2 ${s.textSecondary} opacity-60`}>
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCity(city)}
                    className={`w-full text-left px-4 py-3 text-sm hover:${theme === 'dark' ? 'bg-white/10' : 'bg-slate-50'} transition-colors border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} last:border-0`}
                  >
                    <div className={`font-bold ${s.text}`}>{city.city || city.name}</div>
                    <div className={`text-[10px] ${s.textSecondary} opacity-60 truncate`}>{city.formatted}</div>
                  </button>
                ))
              ) : (
                <div className={`p-4 text-center text-sm font-bold ${s.textSecondary} opacity-60`}>
                  No cities found.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
