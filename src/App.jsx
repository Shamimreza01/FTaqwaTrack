import { Outlet } from "react-router-dom";
import BottomNav from "./components/HomeComponents/BottomNav";
import MenuProvider from "./contexts/MenuContext";
import { useTheme } from "./contexts/ThemeContext";

export default function App() {
  const { theme, s } = useTheme();
  return (
    <div className={`min-h-screen ${s.bg} pb-[100px] overflow-x-hidden relative font-sans ${s.text} transition-colors duration-500`}>
      {/* Decorative ambient blur orbs */}
      <div
        className={`fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none ${
          theme === 'dark' ? 'bg-emerald-500/8' : 'bg-emerald-500/5'
        }`}
      />
      <div
        className={`fixed top-[40%] right-[-10%] w-[30vw] h-[30vw] rounded-full blur-[80px] pointer-events-none ${
          theme === 'dark' ? 'bg-amber-500/5' : 'bg-teal-500/5'
        }`}
      />

      <div className="z-10 relative w-full h-full">
        <MenuProvider>
          <Outlet />
          <BottomNav />
        </MenuProvider>
      </div>
    </div>
  );
}
