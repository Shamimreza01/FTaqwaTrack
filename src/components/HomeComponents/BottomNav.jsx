import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function BottomNav() {
  const tabs = [
    { name: "Home", icon: "fa-house", path: "/" },
    { name: "Quran", icon: "fa-book-open", path: "/quran" },
    { name: "Dua", icon: "fa-hands-praying", path: "/learn-dua" },
    { name: "Daily", icon: "fa-calendar-day", path: "/daily" },
    { name: "Menu", icon: "fa-bars", path: "/menu" }
  ];

  return (
    <div className="fixed bottom-6 w-full flex justify-center z-50 px-4 pointer-events-none">
      <div className="flex justify-around items-center bg-[#061924]/80 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-full max-w-sm pointer-events-auto relative">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${isActive ? "text-emerald-400" : "text-white/50 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i className={`fa-solid ${tab.icon} text-lg transition-transform duration-300 ${isActive ? '-translate-y-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : ''}`}></i>
                <span className={`text-[0.6rem] font-medium absolute bottom-1.5 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  {tab.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute bottom-0 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
