import { createContext, useState } from "react";
const MenuContext = createContext();
export default function MenuProvider({ children }) {
  const [arabicFS, setArabicFS] = useState("20px");
  const [banglaFS, setBanglaFS] = useState("13px");
  const [englishFS, setEnglishFS] = useState("14px");

  return (
    <MenuContext.Provider
      value={{
        arabicFS,
        setArabicFS,
        banglaFS,
        setBanglaFS,
        englishFS,
        setEnglishFS,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
