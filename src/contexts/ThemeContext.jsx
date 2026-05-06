import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const themeStyles = {
  light: {
    // Backgrounds
    bg: "bg-[#FAFAFA]",
    nav: "bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-sm",
    sectionAlt: "bg-slate-50/50",
    footer: "bg-white border-slate-200/60",

    // Cards
    card: "bg-white/70 backdrop-blur-xl border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]",
    cardHover: "bg-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border-emerald-500/20",

    // Typography
    text: "text-slate-800",
    textSecondary: "text-slate-500",

    // Accent / Brand
    accent: "text-emerald-600",
    accentGradient: "from-emerald-600 to-teal-600",

    // Buttons
    buttonPrimary: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25",
    buttonSecondary: "border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100",

    // Form inputs
    input: "bg-white border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400",
  },
  dark: {
    // Backgrounds
    bg: "bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950/60",
    nav: "bg-gray-900/85 backdrop-blur-md border-cyan-500/20",
    sectionAlt: "bg-gray-800/40",
    footer: "bg-gray-900 border-cyan-500/20",

    // Cards
    card: "bg-gray-800/50 backdrop-blur-lg border-cyan-500/15",
    cardHover: "bg-gray-800/70",

    // Typography
    text: "text-white",
    textSecondary: "text-gray-300",

    // Accent / Brand
    accent: "text-cyan-400",
    accentGradient: "from-cyan-400 to-blue-500",

    // Buttons
    buttonPrimary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20",
    buttonSecondary: "border border-cyan-400/50 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20",

    // Form inputs
    input: "bg-gray-700/60 border-cyan-500/30 focus:ring-cyan-400 text-white placeholder-gray-400",
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("taqwatrack-theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("taqwatrack-theme", theme);
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#030712'; // gray-950
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#f8fafc'; // slate-50
      document.body.style.color = '#1e293b'; // slate-800
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const s = themeStyles[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, s }}>
      {children}
    </ThemeContext.Provider>
  );
};
