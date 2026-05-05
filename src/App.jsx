import { Outlet } from "react-router-dom";
import BottomNav from "./components/HomeComponents/BottomNav";
import MenuProvider from "./contexts/MenuContext";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#021B1A] via-[#052C2D] to-[#0A192F] pb-[100px] overflow-x-hidden relative font-sans text-white">
      {/* Decorative Blur Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[30vw] h-[30vw] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="z-10 relative w-full h-full">
        <MenuProvider>
          <Outlet />
          <BottomNav />
        </MenuProvider>
      </div>
    </div>
  );
}
