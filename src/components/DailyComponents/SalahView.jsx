import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import HistoryCalendar from "./HistoryCalendar";

const SALAH_LIST = [
    { id: "fajr", name: "Fajr", icon: "fa-sun" },
    { id: "dhuhr", name: "Dhuhr", icon: "fa-sun-bright" },
    { id: "asr", name: "Asr", icon: "fa-cloud-sun" },
    { id: "maghrib", name: "Maghrib", icon: "fa-moon" },
    { id: "isha", name: "Isha", icon: "fa-stars" }
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

const getTaqwaLevel = (points) => {
    if (points === 0) return { label: "Needs Effort", color: "text-white/40", bg: "bg-white/5 border-white/10", icon: "fa-seedling" };
    if (points < 5) return { label: "Keep Going", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: "fa-seedling" };
    if (points === 5) return { label: "Good Start", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: "fa-leaf" };
    if (points < 135) return { label: "Excellent", color: "text-emerald-300", bg: "bg-emerald-500/20 border-emerald-400/30", icon: "fa-tree" };
    return { label: "Perfect Taqwa", color: "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]", bg: "bg-amber-500/10 border-amber-500/30", icon: "fa-crown" };
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
    const todayQuote = ISLAMIC_QUOTES[moment().dayOfYear() % ISLAMIC_QUOTES.length];
    const todayTaqwa = getTaqwaLevel(stats.todayPoints);

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
                <div className={`backdrop-blur-xl border p-6 rounded-3xl flex items-center justify-between ${todayTaqwa.bg}`}>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <i className="fa-solid fa-mosque text-2xl text-emerald-400"></i>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-black text-emerald-400/60 tracking-widest mb-1">Today's Salah Points</p>
                            <div className="flex items-end gap-2">
                                <p className="text-4xl font-black text-white leading-none">{stats.todayPoints}</p>
                                <p className="text-sm font-bold text-white/40 mb-1">PTS</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <i className={`fa-solid ${todayTaqwa.icon} ${todayTaqwa.color}`}></i>
                            <span className={`text-sm font-black uppercase tracking-widest ${todayTaqwa.color}`}>{todayTaqwa.label}</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-medium">Taqwa Level</p>
                    </div>
                </div>

                {/* Motivational Quote (If missed any) */}
                {stats.todayPoints < 5 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                            <i className="fa-solid fa-quote-left text-sm"></i>
                        </div>
                        <p className="text-amber-100/90 text-sm italic font-medium">"{todayQuote}"</p>
                    </div>
                )}

                <div className="bg-[#052C2D]/40 backdrop-blur-xl border border-emerald-500/10 rounded-[32px] p-6 lg:p-10 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-white tracking-wide">Tracker</h3>
                    </div>

                    <div className="grid grid-cols-12 gap-4 mb-4 text-[10px] font-black text-white/40 uppercase tracking-widest text-center">
                        <div className="col-span-6 text-left pl-4">Prayer</div>
                        <div className="col-span-3">Jamat (27)</div>
                        <div className="col-span-3">Single (1)</div>
                    </div>

                    <div className="space-y-3">
                        {SALAH_LIST.map((salah) => {
                            const isJamat = salahState[salah.id] === 'jamat';
                            const isSingle = salahState[salah.id] === 'single';

                            return (
                            <div key={salah.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 grid grid-cols-12 items-center gap-4 hover:bg-white/[0.08] transition-all group">
                                <div className="col-span-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                        <i className={`fa-solid ${salah.icon} text-emerald-400`}></i>
                                    </div>
                                    <span className="text-lg font-bold text-white/90">{salah.name}</span>
                                </div>

                                <div className="col-span-3 flex justify-center">
                                    <button 
                                        onClick={() => handleSalahUpdate(salah.id, isJamat ? null : 'jamat')}
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isJamat ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/40' : 'bg-black/20 border-white/10 hover:border-emerald-500/50 text-transparent hover:bg-emerald-500/10'}`}
                                    >
                                        <i className="fa-solid fa-check text-xs"></i>
                                    </button>
                                </div>

                                <div className="col-span-3 flex justify-center">
                                    <button 
                                        onClick={() => handleSalahUpdate(salah.id, isSingle ? null : 'single')}
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSingle ? 'bg-emerald-700 border-emerald-500 text-white shadow-lg shadow-emerald-700/40' : 'bg-black/20 border-white/10 hover:border-emerald-700/50 text-transparent hover:bg-emerald-700/10'}`}
                                    >
                                        <i className="fa-solid fa-check text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>

                {/* Salah Feed */}
                <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-clock-rotate-left text-white/40"></i>
                        Recent Salah Log
                    </h4>
                    <div className="space-y-4">
                        {salahFeed.length > 0 ? salahFeed.map((item, idx) => {
                            const pts = item.totalPoints;
                            const lvl = getTaqwaLevel(pts);
                            return (
                            <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                                        <i className="fa-solid fa-mosque text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white/90">{moment(item.date).format('MMMM D, YYYY')}</p>
                                        <p className={`text-[10px] font-bold ${lvl.color} mt-0.5`}><i className={`fa-solid ${lvl.icon} mr-1`}></i>{lvl.label}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-emerald-400">+{pts}</p>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">PTS</p>
                                </div>
                            </div>
                        )}) : (
                            <p className="text-center text-white/20 py-10 italic">No recent salah activity</p>
                        )}
                    </div>
                </div>

            </div>

            <div className="lg:col-span-5 flex flex-col">
                <div className="bg-gradient-to-br from-[#020617] to-emerald-950/40 border border-white/5 rounded-[32px] p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                            <i className="fa-solid fa-chart-area text-emerald-400"></i>
                            Trends
                        </h4>
                        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                            <button onClick={() => setTimeRange(14)} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${timeRange === 14 ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>14D</button>
                            <button onClick={() => setTimeRange(30)} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${timeRange === 30 ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>30D</button>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pointsHistory}>
                                <defs>
                                    <linearGradient id="colorSalah" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} dy={10} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} itemStyle={{ fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="points" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSalah)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <HistoryCalendar type="salah" dataMap={salahHistoryMap} trackingStart={trackingStart} />
            </div>
        </motion.div>
    );
}
