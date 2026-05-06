import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Home, BookOpen, HandHelping, Calendar, Menu } from "lucide-react";

export default function BottomNav() {
  const { theme, s } = useTheme();
  
  const tabs = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Quran", icon: BookOpen, path: "/quran" },
    { name: "Dua", icon: HandHelping, path: "/learn-dua" },
    { name: "Daily", icon: Calendar, path: "/daily" },
    { name: "Menu", icon: Menu, path: "/menu" }
  ];

  return (
    <div className="fixed bottom-6 w-full flex justify-center z-50 px-4 pointer-events-none">
      <div className={`flex justify-around items-center ${s.nav} border p-2 rounded-full shadow-2xl w-full max-w-sm pointer-events-auto relative overflow-hidden`}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                isActive 
                  ? (theme === 'dark' ? "text-cyan-400" : "text-emerald-600") 
                  : `${s.text} opacity-50 hover:opacity-100 hover:bg-white/5`
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`} />
                <span className={`text-[0.6rem] font-bold absolute bottom-1.5 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  {tab.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className={`absolute bottom-0 w-1 h-1 ${theme === 'dark' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]' : 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)]'} rounded-full`}
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
