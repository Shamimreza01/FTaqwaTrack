import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import HistoryCalendar from "./HistoryCalendar";
import { useTheme } from "../../contexts/ThemeContext";
import { 
    Sun, SunDim, CloudSun, Moon, Sparkles, 
    Bell, Sprout, Leaf, TreeDeciduous, Crown, 
    Quote, Check, History, LineChart 
} from "lucide-react";

const SALAH_LIST = [
    { id: "fajr", name: "Fajr", icon: Sun },
    { id: "dhuhr", name: "Dhuhr", icon: SunDim },
    { id: "asr", name: "Asr", icon: CloudSun },
    { id: "maghrib", name: "Maghrib", icon: Moon },
    { id: "isha", name: "Isha", icon: Sparkles }
];

const ISLAMIC_QUOTES = [
    "Take one step towards Allah, He will come to you running.",
    "Verily, with hardship comes ease. (Quran 94:5)",
    "Do not lose hope, nor be sad. (Quran 3:139)",
    "Allah is with the patient. (Quran 2:153)",
    "And whoever puts their trust in Allah, He will be enough for them. (Quran 65:3)",
    "The most beloved of deeds to Allah are those that are most consistent, even if it is small. (Hadith)",
    "Call upon Me; I will respond to you. (Quran 40:60)",
    "Sufficient for us is Allah, and He is the best Disposer of affairs. (Quran 3:173)"
];

const getTaqwaLevel = (points, theme) => {
    const accent = theme === 'dark' ? 'text-cyan-400' : 'text-emerald-600';
    const accentBg = theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-emerald-50 border-emerald-200 shadow-sm';

    if (points === 0) return { label: "Needs Effort", color: theme === 'dark' ? "text-white/40" : "text-slate-400", bg: theme === 'dark' ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200", icon: Sprout };
    if (points < 5) return { label: "Keep Going", color: theme === 'dark' ? "text-amber-400" : "text-amber-600", bg: theme === 'dark' ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-200", icon: Sprout };
    if (points === 5) return { label: "Good Start", color: theme === 'dark' ? "text-emerald-400" : "text-emerald-600", bg: theme === 'dark' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200", icon: Leaf };
    if (points < 135) return { label: "Excellent", color: accent, bg: accentBg, icon: TreeDeciduous };
    return { label: "Perfect Taqwa", color: theme === 'dark' ? "text-amber-400 drop-shadow-md" : "text-amber-600", bg: theme === 'dark' ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200 shadow-sm", icon: Crown };
};

export default function SalahView({
    salahState,
    handleSalahUpdate,
    salahFeed,
    stats,
    pointsHistory,
    salahHistoryMap,
    timeRange,
    setTimeRange,
    trackingStart
}) {
    const { theme, s } = useTheme();
    const todayQuote = ISLAMIC_QUOTES[moment().dayOfYear() % ISLAMIC_QUOTES.length];
    const todayTaqwa = getTaqwaLevel(stats.todayPoints, theme);

    return (
        <motion.div 
            key="salah-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
            <div className="lg:col-span-7 flex flex-col gap-8" id="salah-share-card">
                
                {/* Top Stats for Salah */}
                <div className={`backdrop-blur-xl border p-6 rounded-3xl flex items-center justify-between ${todayTaqwa.bg} transition-all duration-500`}>
                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${theme === 'dark' ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-emerald-100 border-emerald-200'} flex items-center justify-center border`}>
                            <Bell className={`w-7 h-7 ${theme === 'dark' ? 'text-cyan-400' : 'text-emerald-600'}`} />
                        </div>
                        <div>
                            <p className={`text-[10px] uppercase font-black ${theme === 'dark' ? 'text-cyan-400/60' : 'text-emerald-600/70'} tracking-widest mb-1`}>Today's Salah Points</p>
                            <div className="flex items-end gap-2">
                                <p className={`text-4xl font-black ${s.text} leading-none`}>{stats.todayPoints}</p>
                                <p className={`text-sm font-bold ${s.textSecondary} opacity-40 mb-1`}>PTS</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <todayTaqwa.icon className={`w-4 h-4 ${todayTaqwa.color}`} />
                            <span className={`text-sm font-black uppercase tracking-widest ${todayTaqwa.color}`}>{todayTaqwa.label}</span>
                        </div>
                        <p className={`text-[10px] ${s.textSecondary} opacity-40 font-bold`}>Taqwa Level</p>
                    </div>
                </div>

                {/* Motivational Quote (If missed any) */}
                {stats.todayPoints < 5 && (
                    <div className={`${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border rounded-2xl p-4 flex items-center gap-4`}>
                        <div className={`w-10 h-10 shrink-0 rounded-full ${theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'} flex items-center justify-center`}>
                            <Quote className="w-4 h-4" />
                        </div>
                        <p className={`${theme === 'dark' ? 'text-amber-100/90' : 'text-amber-800'} text-sm italic font-bold`}>"{todayQuote}"</p>
                    </div>
                )}

                <div className={`${s.card} border rounded-[32px] p-6 lg:p-10 shadow-2xl`}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-2xl font-black ${s.text} tracking-tight`}>Tracker</h3>
                    </div>

                    <div className={`grid grid-cols-12 gap-4 mb-4 text-[10px] font-black ${s.textSecondary} opacity-40 uppercase tracking-widest text-center`}>
                        <div className="col-span-6 text-left pl-4">Prayer</div>
                        <div className="col-span-3">Jamat (27)</div>
                        <div className="col-span-3">Single (1)</div>
                    </div>

                    <div className="space-y-3">
                        {SALAH_LIST.map((salah) => {
                            const isJamat = salahState[salah.id] === 'jamat';
                            const isSingle = salahState[salah.id] === 'single';

                            return (
                            <div key={salah.id} className={`${s.sectionAlt} border ${theme === 'dark' ? 'border-white/5 hover:bg-gray-800/70' : 'border-slate-200 hover:bg-white'} rounded-2xl p-4 grid grid-cols-12 items-center gap-4 transition-all group hover:shadow-sm`}>
                                <div className="col-span-6 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'} flex items-center justify-center border group-hover:scale-110 transition-transform`}>
                                        <salah.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-lg font-bold ${s.text}`}>{salah.name}</span>
                                </div>

                                <div className="col-span-3 flex justify-center">
                                    <button 
                                        onClick={() => handleSalahUpdate(salah.id, isJamat ? null : 'jamat')}
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isJamat ? (theme === 'dark' ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg' : 'bg-emerald-500 border-emerald-400 text-white shadow-sm') : (theme === 'dark' ? 'bg-black/20 border-white/10 hover:border-cyan-500/50 text-transparent hover:bg-cyan-500/10' : 'bg-slate-100 border-slate-300 hover:border-emerald-400 text-transparent hover:bg-emerald-50')}`}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="col-span-3 flex justify-center">
                                    <button 
                                        onClick={() => handleSalahUpdate(salah.id, isSingle ? null : 'single')}
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSingle ? (theme === 'dark' ? 'bg-cyan-800 border-cyan-600 text-white shadow-lg' : 'bg-emerald-700 border-emerald-500 text-white shadow-sm') : (theme === 'dark' ? 'bg-black/20 border-white/10 hover:border-cyan-700/50 text-transparent hover:bg-cyan-700/10' : 'bg-slate-100 border-slate-300 hover:border-emerald-600 text-transparent hover:bg-emerald-50')}`}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>

                {/* Salah Feed */}
                <div className={`${s.card} border rounded-[32px] p-8`}>
                    <h4 className={`text-lg font-bold ${s.text} mb-6 flex items-center gap-2`}>
                        <History className={`w-5 h-5 ${s.textSecondary} opacity-40`} />
                        Recent Salah Log
                    </h4>
                    <div className="space-y-4">
                        {salahFeed.length > 0 ? salahFeed.map((item, idx) => {
                            const pts = item.totalPoints;
                            const lvl = getTaqwaLevel(pts, theme);
                            return (
                            <div key={idx} className={`flex items-center justify-between p-4 ${s.sectionAlt} rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border-white/5' : 'bg-emerald-50 text-emerald-600 border-emerald-200'} flex items-center justify-center border`}>
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${s.text}`}>{moment(item.date).format('MMMM D, YYYY')}</p>
                                        <p className={`text-[10px] font-bold ${lvl.color} mt-0.5 flex items-center gap-1`}><lvl.icon className="w-3 h-3" />{lvl.label}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-emerald-600'}`}>+{pts}</p>
                                    <p className={`text-[10px] ${s.textSecondary} opacity-30 uppercase tracking-widest font-bold`}>PTS</p>
                                </div>
                            </div>
                        )}) : (
                            <p className={`text-center ${s.textSecondary} opacity-20 py-10 italic`}>No recent salah activity</p>
                        )}
                    </div>
                </div>

            </div>

            <div className="lg:col-span-5 flex flex-col">
                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-cyan-950/20' : 'bg-white'} border rounded-[32px] p-8 shadow-xl`}>
                    <div className="flex items-center justify-between mb-6">
                        <h4 className={`font-bold ${s.text} text-lg flex items-center gap-2`}>
                            <LineChart className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-emerald-600'}`} />
                            Trends
                        </h4>
                        <div className={`flex ${s.sectionAlt} p-1 rounded-lg border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                            <button onClick={() => setTimeRange(14)} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${timeRange === 14 ? (theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-600 text-white') : `${s.textSecondary} opacity-40 hover:opacity-100`}`}>14D</button>
                            <button onClick={() => setTimeRange(30)} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${timeRange === 30 ? (theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-600 text-white') : `${s.textSecondary} opacity-40 hover:opacity-100`}`}>30D</button>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pointsHistory}>
                                <defs>
                                    <linearGradient id="colorSalah" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme === 'dark' ? "#22d3ee" : "#059669"} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={theme === 'dark' ? "#22d3ee" : "#059669"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)', fontSize: 10 }} dy={10} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff', border: theme === 'dark' ? 'none' : '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="points" stroke={theme === 'dark' ? "#22d3ee" : "#059669"} strokeWidth={4} fillOpacity={1} fill="url(#colorSalah)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <HistoryCalendar type="salah" dataMap={salahHistoryMap} trackingStart={trackingStart} />
            </div>
        </motion.div>
    );
}
