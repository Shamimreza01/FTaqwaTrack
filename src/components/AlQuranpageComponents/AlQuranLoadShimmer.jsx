import { useState } from "react";

export default function AlQuranLoadShimmer({ name }) {
  const [selectedSurah, setSelectedSurah] = useState(null);
  return (
    <div className="font-[system-ui] py-[80px] px-4 max-w-4xl mx-auto min-h-screen text-white">
      {selectedSurah ? (
        <>
          <div className="w-full h-16 bg-[#021B1A]/90 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 z-[2] shimmer opacity-50"></div>
          <button className="w-48 h-12 mt-4 mb-6 rounded-full border-none bg-white/10 mx-auto block shimmer opacity-30"></button>
          <ul className="flex flex-col gap-4 pb-20">
            {Array.from(Array(15).keys()).map((ele, index) => (
              <li key={index} className="h-40 rounded-2xl bg-white/5 border border-white/10 shimmer-ayah opacity-40">
                {setSelectedSurah(null)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2 className="w-full text-center bg-[#021B1A]/80 backdrop-blur-xl border-b border-white/10 text-emerald-400 p-4 font-bold text-xl fixed top-0 left-0 z-10 shadow-md">{`📖 Loading Quran...`}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20 mt-4">
            {Array.from(Array(20).keys()).map((ele, index) => (
              <li className="h-16 rounded-2xl bg-white/5 border border-white/10 shimmer opacity-30" key={index}></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
