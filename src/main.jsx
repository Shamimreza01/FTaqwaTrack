import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import QuranEditionList from "./components/AlQuranpageComponents/QuranEditionList";
import QuranEditionView from "./components/AlQuranpageComponents/QuranEditionView";
import QuranSurahList from "./components/AlQuranpageComponents/QuranSurahList";
import QuranSurahView from "./components/AlQuranpageComponents/QuranSurahView";
import { SettingsProvider } from "./contexts/SettingsContext";
import DuaLoad from "./components/DuapageComponents/DuaLoad";
import UnderConstruction from "./components/ErrorPage/UnderConstruction";
import ItemCardContainer from "./pages/AlQuran";
import DuaCardContainer from "./pages/Dua";
import Home from "./pages/Home";
import NamesOfAllah from "./pages/NamesOfAllah";
import Menu from "./pages/Menu";
import Collections from "./pages/Collections";
import Daily from "./pages/Daily";


//service worker reg
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register(new URL("./serviceWorker.js", import.meta.url))
//       .then((reg) => {
//         console.log("Service Worker registered successfully:", reg);
//       })
//       .catch((err) => {
//         console.error("Service Worker registration failed:", err);
//       });
//   });
// }

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <UnderConstruction />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/Quran",
        element: <ItemCardContainer />,
      },
      {
        path: "/quran/:edition",
        element: <QuranEditionList />,
      },
      {
        path: "/quran/:edition/:surahId",
        element: <QuranEditionView />,
      },
      {
        path: "/quran/fullQuran",
        element: <QuranSurahList name="আল-কোরআন আরবি বাংলা ও অডিও" />
      },
      {
        path: "/quran/fullQuran/:surahId",
        element: <QuranSurahView />
      },
      {
        path: "/learn-dua",
        element: <DuaCardContainer />,
      },
      {
        path: "/learn-dua/:dataName",
        element: <DuaLoad />,
      },
      {
        path: "/99-names",
        element: <NamesOfAllah />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/collections",
        element: <Collections />
      },
      {
        path: "/daily",
        element: <Daily />
      }
    ],
  },
]);
const rootElement = document.querySelector("#root");

const root = createRoot(rootElement);
root.render(
  <SettingsProvider>
    <RouterProvider router={router} />
  </SettingsProvider>
);
