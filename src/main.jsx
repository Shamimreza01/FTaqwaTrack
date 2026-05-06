import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";

import Home from "./pages/Home";
import Daily from "./pages/Daily";
import NamesOfAllah from "./pages/NamesOfAllah";
import Menu from "./pages/Menu";
import Collections from "./pages/Collections";
import ItemCardContainer from "./pages/AlQuran";
import DuaCardContainer from "./pages/Dua";

import QuranEditionList from "./components/AlQuranpageComponents/QuranEditionList";
import QuranEditionView from "./components/AlQuranpageComponents/QuranEditionView";
import QuranSurahList from "./components/AlQuranpageComponents/QuranSurahList";
import QuranSurahView from "./components/AlQuranpageComponents/QuranSurahView";
import DuaLoad from "./components/DuapageComponents/DuaLoad";
import UnderConstruction from "./components/ErrorPage/UnderConstruction";

import { registerSW } from 'virtual:pwa-register';

// Register Service Worker with auto-update for offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Silently auto-update without disrupting UX
    console.log('[PWA] New content available, updating...');
  },
  onOfflineReady() {
    console.log('[PWA] App is ready for offline use.');
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <UnderConstruction />,
    children: [
      { path: "/", element: <Home /> },
      // Quran routes — all lowercase for consistency
      { path: "/quran", element: <ItemCardContainer /> },
      { path: "/quran/:edition", element: <QuranEditionList /> },
      { path: "/quran/:edition/:surahId", element: <QuranEditionView /> },
      { path: "/quran/fullQuran", element: <QuranSurahList name="আল-কোরআন আরবি বাংলা ও অডিও" /> },
      { path: "/quran/fullQuran/:surahId", element: <QuranSurahView /> },
      // Dua routes
      { path: "/learn-dua", element: <DuaCardContainer /> },
      { path: "/learn-dua/:dataName", element: <DuaLoad /> },
      // Other pages
      { path: "/99-names", element: <NamesOfAllah /> },
      { path: "/menu", element: <Menu /> },
      { path: "/collections", element: <Collections /> },
      { path: "/daily", element: <Daily /> },
    ],
  },
]);

const rootElement = document.querySelector("#root");
const root = createRoot(rootElement);

root.render(
  <SettingsProvider>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </SettingsProvider>
);
