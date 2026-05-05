import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import HistoryCalendar from "./HistoryCalendar";

const getFocusLevel = (minutes) => {
    if (minutes === 0) return { label: "No Focus", color: "text-white/40", bg: "bg-white/5 border-white/10", icon: "fa-mug-hot" };
    if (minutes < 30) return { label: "Warming Up", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", icon: "fa-fire-flame-simple" };
    if (minutes < 60) return { label: "Deep Work", color: "text-indigo-300", bg: "bg-indigo-500/20 border-indigo-400/30", icon: "fa-fire" };
    return { label: "Flow State", color: "text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]", bg: "bg-purple-500/10 border-purple-500/30", icon: "fa-bolt" };
};

export default function FocusView({
    title,
    setTitle,
    seconds,
    isActive,
    setIsActive,
    handleFinishFocus,
    handleDeleteFocus,
    formatTime,
    focusFeed,
    stats,
    pointsHistory,
    focusHistoryMap,
    timeRange,
    setTimeRange
}) {
    const todayFocus = getFocusLevel(stats.todayMinutes);

    return (
        <motion.div 
            key="focus-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
            <div className="lg:col-span-7 flex flex-col gap-8" id="focus-share-card">
                
                {/* Top Stats for Focus */}
                <div className={`backdrop-blur-xl border p-6 rounded-3xl flex items-center justify-between ${todayFocus.bg}`}>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <i className="fa-solid fa-bullseye text-2xl text-indigo-400"></i>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-black text-indigo-400/60 tracking-widest mb-1">Today's Focus Time</p>
                            <div className="flex items-end gap-2">
                                <p className="text-4xl font-black text-white leading-none">{stats.todayMinutes}</p>
                                <p className="text-sm font-bold text-white/40 mb-1">MIN</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <i className={`fa-solid ${todayFocus.icon} ${todayFocus.color}`}></i>
                            <span className={`text-sm font-black uppercase tracking-widest ${todayFocus.color}`}>{todayFocus.label}</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-medium">Focus Level</p>
                    </div>
                </div>

                <div className="bg-[#0F172A]/40 backdrop-blur-xl border border-indigo-500/10 rounded-[32px] p-10 shadow-2xl flex flex-col items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60"></div>
                    
                    <h3 className="text-sm uppercase tracking-widest text-indigo-400 font-black mb-8 z-10">Deep Focus Mode</h3>
                    
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={50}
                        className="w-full max-w-[300px] bg-black/40 border border-indigo-500/30 rounded-2xl px-6 py-3 text-center text-white font-bold focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all z-10 mb-10 text-lg shadow-inner"
                        placeholder="Enter focus goal..."
                    />

                    <div className="relative w-72 h-72 flex items-center justify-center z-10 mb-12">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="144" cy="144" r="136" className="stroke-white/5" strokeWidth="12" fill="none" />
                            <motion.circle 
                                cx="144" 
                                cy="144" 
                                r="136" 
                                className="stroke-indigo-500" 
                                strokeWidth="12" 
                                fill="none" 
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 136}
                                animate={isActive ? { strokeDashoffset: [2 * Math.PI * 136, 0] } : { strokeDashoffset: 2 * Math.PI * 136 }}
                                transition={isActive ? { duration: 60, repeat: Infinity, ease: "linear" } : {}}
                            />
                        </svg>
                        <div className="text-6xl font-light tracking-tighter text-white drop-shadow-2xl">
                            {formatTime(seconds)}
                        </div>
                    </div>

                    <div className="flex gap-6 z-10">
                        <button 
                            onClick={() => setIsActive(!isActive)}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isActive ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/40' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-110 shadow-indigo-500/30'}`}
                        >
                            <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'} text-2xl`}></i>
                        </button>
                        
                        {seconds > 0 && !isActive && (
                            <button 
                                onClick={handleFinishFocus}
                                className="px-8 h-20 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-full shadow-2xl shadow-indigo-500/30 transition-all hover:scale-105 flex items-center gap-3"
                            >
                                <i className="fa-solid fa-flag-checkered text-xl"></i> LOG IT
                            </button>
                        )}
                    </div>
                </div>

                {/* Focus Feed */}
                <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-clock-rotate-left text-white/40"></i>
                        Recent Focus Log
                    </h4>
                    <div className="space-y-4">
                        {focusFeed.length > 0 ? focusFeed.map((item, idx) => {
                            const mins = item.durationMinutes;
                            const lvl = getFocusLevel(mins);
                            return (
                            <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                                        <i className="fa-solid fa-bullseye text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white/90">{item.title || "Deep Focus"}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <p className={`text-[10px] font-bold ${lvl.color}`}><i className={`fa-solid ${lvl.icon} mr-1`}></i>{lvl.label}</p>
                                            <button 
                                                onClick={() => handleDeleteFocus(item.id)}
                                                className="w-5 h-5 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                                title="Delete Session"
                                            >
                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-indigo-400">+{mins}</p>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">MINS</p>
                                    <p className="text-[10px] text-white/20 mt-1">{moment(item.timestamp).format('MMM D, h:mm a')}</p>
                                </div>
                            </div>
                        )}) : (
                            <p className="text-center text-white/20 py-10 italic">No recent focus activity</p>
                        )}
                    </div>
                </div>

            </div>

            <div className="lg:col-span-5 flex flex-col">
                <div className="bg-gradient-to-br from-[#020617] to-indigo-950/40 border border-white/5 rounded-[32px] p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                            <i className="fa-solid fa-chart-area text-indigo-400"></i>
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
                                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} dy={10} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} itemStyle={{ fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorFocus)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <HistoryCalendar type="focus" dataMap={focusHistoryMap} />
            </div>
        </motion.div>
    );
}
