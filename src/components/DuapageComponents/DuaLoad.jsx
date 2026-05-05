import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import AlQuranLoadShimmer from "../AlQuranpageComponents/AlQuranLoadShimmer";
import DuaItemCard from "./DuaItemCard";
import { useSettings } from "../../contexts/SettingsContext";

export default function DuaLoad() {
  const [duas, setDuas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMemorizeMode, setIsMemorizeMode] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { dataName } = useParams();

  const { memorizedDuaIds, toggleMemorizedDua } = useSettings();
  const duaMeta = {
    FortyRabbanaDua: { id: 1, name: "৪০ রাব্বানা দোয়া" },
    FortyMotivationalAyah: { id: 2, name: "৪০টি মোটিভেশনাল আয়াত" },
    AfterSalahDua: { id: 3, name: "সালাত পরবর্তী দোয়া" },
  };
  console.log(dataName);
  const meta = duaMeta[dataName];
  const id = meta?.id;
  const name = meta?.name;

  // Read

  const openIndexedDB = () => {
    const openRequest = indexedDB.open("DuaDB", 1);

    openRequest.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("duas")) {
        const store = db.createObjectStore("duas", { keyPath: "id" });
        store.createIndex("id", "id", { unique: true });
      }
    };

    openRequest.onsuccess = async (e) => {
      const db = e.target.result;

      // If the DB exists but is missing the "duas" store (broken state),
      // close it, delete it, and reopen to trigger onupgradeneeded properly.
      if (!db.objectStoreNames.contains("duas")) {
        db.close();
        const deleteRequest = indexedDB.deleteDatabase("DuaDB");
        deleteRequest.onsuccess = () => {
          console.log("Deleted broken DuaDB, reopening...");
          openIndexedDB(); // Retry — this time onupgradeneeded will fire
        };
        deleteRequest.onerror = () => {
          setIsLoading(false);
          setLoadError(true);
        };
        return;
      }

      // Open a read transaction to get local data
      const readTransaction = db.transaction(["duas"], "readonly");
      const store = readTransaction.objectStore("duas");
      const duaRequest = store.get(id);

      duaRequest.onsuccess = async (e) => {
        const localData = e.target.result?.data;

        // If offline, just use local data
        if (!navigator.onLine) {
          console.log("Offline — using local data");
          if (localData) {
            setDuas(localData);
          } else {
            setLoadError(true);
          }
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `https://api-taqwatrack.onrender.com/${dataName}`
          );
          const apiData = await response.json();

          const isSame = JSON.stringify(localData) === JSON.stringify(apiData);

          if (!isSame) {
            // Now open a NEW transaction to write
            const writeTransaction = db.transaction(["duas"], "readwrite");
            const writeStore = writeTransaction.objectStore("duas");
            writeStore.put({ id: id, data: apiData });

            console.log("Updated data in IndexedDB");
            setDuas(apiData);
          } else {
            console.log("No changes — using local data");
            setDuas(localData);
          }
        } catch (err) {
          console.error("API fetch error:", err);
          if (localData) {
            setDuas(localData);
          } else {
            setLoadError(true);
          }
        }

        setIsLoading(false);
      };
    };

    openRequest.onerror = (e) => {
      console.error("Error opening IndexedDB", e);
      setIsLoading(false);
      setLoadError(true);
    };
  };

  useEffect(() => {
    if (dataName) {
      openIndexedDB();
    } else {
      console.error("dataName is required");
    }
  }, [dataName]);

  const filteredDuas = useMemo(() => {
    if (!duas) return [];
    if (!searchQuery) return duas;
    const q = searchQuery.toLowerCase();
    return duas.filter(d =>
      (d.bangla_translation && d.bangla_translation.toLowerCase().includes(q)) ||
      (d.bangla_pronunciation && d.bangla_pronunciation.toLowerCase().includes(q)) ||
      ((d.dua_number || d.ayah_number)?.toString() === q)
    );
  }, [duas, searchQuery]);

  return isLoading ? (
    <AlQuranLoadShimmer name={name} />
  ) : loadError || !duas ? (
    <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white flex flex-col items-center justify-center gap-6">
        <div className="text-center">
            <i className={`fa-solid ${!navigator.onLine ? 'fa-wifi' : 'fa-triangle-exclamation'} text-5xl text-red-400/60 mb-4`}></i>
            <h2 className="text-2xl font-bold text-white/80 mb-2">Unable to Load Duas</h2>
            <p className="text-white/40 max-w-sm">
                {!navigator.onLine 
                    ? "You are offline. Please connect to the internet to download the Dua data. It will be saved offline for future use."
                    : "The server is starting up (this can take up to 30 seconds on first load). Please tap 'Try Again' in a moment."
                }
            </p>
        </div>
        <button onClick={() => { setLoadError(false); setIsLoading(true); openIndexedDB(); }} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-all shadow-lg shadow-emerald-500/30">
            <i className="fa-solid fa-rotate-right mr-2"></i> Try Again
        </button>
    </div>
  ) : (
    <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white">
      <div className="w-full bg-[#021B1A]/90 backdrop-blur-xl border-b border-white/10 p-4 fixed top-0 left-0 z-50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-emerald-400 font-bold text-[1.1rem] drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
          {name}
        </h2>

        <div className="flex items-center gap-4">
          {isMemorizeMode && duas && (
            <div className="bg-black/30 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
              <span className="text-[0.65rem] uppercase font-bold text-white/50 tracking-wider">Hifz</span>
              <span className="text-amber-300 text-sm font-bold tracking-widest">
                {duas.filter(a => memorizedDuaIds.includes(`${dataName}_${a.dua_number || a.ayah_number}`)).length}
                <span className="text-white/30 text-xs"> /{duas.length}</span>
              </span>
            </div>
          )}

          <button
            onClick={() => setIsMemorizeMode(!isMemorizeMode)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${isMemorizeMode ? 'bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-white/10'}`}
          >
            <span className="sr-only">Toggle Memorize Mode</span>
            <span className={`${isMemorizeMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white/70'} inline-block h-5 w-5 transform rounded-full transition-transform duration-300`} />
            {!isMemorizeMode && <span className="absolute right-1 text-[0.55rem] font-bold text-white/50 pointer-events-none">OFF</span>}
          </button>
        </div>
      </div>

      <button
        className="w-full sm:w-auto p-3 px-6 mt-4 mb-6 rounded-full border-none bg-emerald-600/80 hover:bg-emerald-500 text-white cursor-pointer transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur text-[1.1rem] mx-auto block hover:scale-105"
        onClick={() => history.back()}
      >
        <i className="fa-solid fa-circle-left mr-2"></i> Go To DuaList
      </button>

      <div className="relative mt-8 mb-6 mx-auto z-10 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i className="fa-solid fa-search text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors"></i>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all"
          placeholder="Search Translation or Number..."
        />
      </div>

      <ul className="flex flex-col gap-4 pb-20">
        {filteredDuas && filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => {
            const uid = `${dataName}_${dua.dua_number || dua.ayah_number}`;
            return (
              <DuaItemCard
                key={crypto.randomUUID()}
                dua={dua}
                dataName={dataName}
                uniqueId={uid}
                isMemorizeMode={isMemorizeMode}
                isMemorized={memorizedDuaIds.includes(uid)}
                onToggleMemorized={toggleMemorizedDua}
              />
            );
          })
        ) : (
          <div className="text-center text-white/50 text-lg mt-10">No duas found.</div>
        )}
      </ul>
    </div>
  );
}
