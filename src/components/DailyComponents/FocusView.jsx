import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import HistoryCalendar from "./HistoryCalendar";
import { useTheme } from "../../contexts/ThemeContext";
import { 
    Coffee, Flame, Zap, Activity, Target, 
    Pause, Play, CheckCircle2, Trash2, 
    History, LineChart 
} from "lucide-react";

const getFocusLevel = (minutes, theme) => {
    if (minutes === 0) return { label: "No Focus", color: theme === 'dark' ? "text-white/40" : "text-slate-400", bg: theme === 'dark' ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200", icon: Coffee };
    if (minutes < 30) return { label: "Warming Up", color: theme === 'dark' ? "text-indigo-400" : "text-indigo-600", bg: theme === 'dark' ? "bg-indigo-500/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-200", icon: Flame };
    if (minutes < 60) return { label: "Deep Work", color: theme === 'dark' ? "text-indigo-300" : "text-indigo-500", bg: theme === 'dark' ? "bg-indigo-500/20 border-indigo-400/30" : "bg-indigo-100 border-indigo-300", icon: Zap };
    return { label: "Flow State", color: theme === 'dark' ? "text-purple-400 drop-shadow-md" : "text-purple-600 shadow-sm", bg: theme === 'dark' ? "bg-purple-500/10 border-purple-500/30" : "bg-purple-50 border-purple-200", icon: Activity };
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
    const { theme, s } = useTheme();
    const todayFocus = getFocusLevel(stats.todayMinutes, theme);

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
                <div className={`backdrop-blur-xl border p-6 rounded-3xl flex items-center justify-between ${todayFocus.bg} transition-all duration-500`}>
                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${theme === 'dark' ? 'bg-indigo-500/20 border-indigo-500/30' : 'bg-indigo-100 border-indigo-200'} flex items-center justify-center border`}>
                            <Target className={`w-7 h-7 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                        <div>
                            <p className={`text-[10px] uppercase font-black ${theme === 'dark' ? 'text-indigo-400/60' : 'text-indigo-600/70'} tracking-widest mb-1`}>Today's Focus Time</p>
                            <div className="flex items-end gap-2">
                                <p className={`text-4xl font-black ${s.text} leading-none`}>{stats.todayMinutes}</p>
                                <p className={`text-sm font-bold ${s.textSecondary} opacity-40 mb-1`}>MIN</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <todayFocus.icon className={`w-4 h-4 ${todayFocus.color}`} />
                            <span className={`text-sm font-black uppercase tracking-widest ${todayFocus.color}`}>{todayFocus.label}</span>
                        </div>
                        <p className={`text-[10px] ${s.textSecondary} opacity-40 font-bold`}>Focus Level</p>
                    </div>
                </div>

                <div className={`${theme === 'dark' ? 'bg-[#0F172A]/40' : 'bg-white'} backdrop-blur-xl border border-indigo-500/10 rounded-[32px] p-10 shadow-2xl flex flex-col items-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60"></div>
                    
                    <h3 className="text-sm uppercase tracking-widest text-indigo-400 font-black mb-8 z-10">Deep Focus Mode</h3>
                    
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={50}
                        className={`w-full max-w-[300px] ${s.input} border rounded-2xl px-6 py-3 text-center ${s.text} font-bold focus:outline-none transition-all z-10 mb-10 text-lg shadow-inner`}
                        placeholder="Enter focus goal..."
                    />

                    <div className="relative w-72 h-72 flex items-center justify-center z-10 mb-12">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="144" cy="144" r="136" className={theme === 'dark' ? "stroke-white/5" : "stroke-black/5"} strokeWidth="12" fill="none" />
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
                        <div className={`text-6xl font-light tracking-tighter ${s.text} drop-shadow-2xl`}>
                            {formatTime(seconds)}
                        </div>
                    </div>

                    <div className="flex gap-6 z-10">
                        <button 
                            onClick={() => setIsActive(!isActive)}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isActive ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/40' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-110 shadow-indigo-500/30'}`}
                        >
                            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                        </button>
                        
                        {seconds > 0 && !isActive && (
                            <button 
                                onClick={handleFinishFocus}
                                className="px-8 h-20 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-full shadow-2xl shadow-indigo-500/30 transition-all hover:scale-105 flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-6 h-6" /> LOG IT
                            </button>
                        )}
                    </div>
                </div>

                {/* Focus Feed */}
                <div className={`${s.card} border rounded-[32px] p-8`}>
                    <h4 className={`text-lg font-bold ${s.text} mb-6 flex items-center gap-2`}>
                        <History className={`w-5 h-5 ${s.textSecondary} opacity-40`} />
                        Recent Focus Log
                    </h4>
                    <div className="space-y-4">
                        {focusFeed.length > 0 ? focusFeed.map((item, idx) => {
                            const mins = item.durationMinutes;
                            const lvl = getFocusLevel(mins, theme);
                            return (
                            <div key={idx} className={`flex items-center justify-between p-4 ${s.sectionAlt} rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-200'} flex items-center justify-center border`}>
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${s.text}`}>{item.title || "Deep Focus"}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <p className={`text-[10px] font-bold ${lvl.color} flex items-center gap-1`}><lvl.icon className="w-3 h-3" />{lvl.label}</p>
                                            <button 
                                                onClick={() => handleDeleteFocus(item.id)}
                                                className="w-5 h-5 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                                title="Delete Session"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-black ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>+{mins}</p>
                                    <p className={`text-[10px] ${s.textSecondary} opacity-30 uppercase tracking-widest font-bold`}>MINS</p>
                                    <p className={`text-[10px] ${s.textSecondary} opacity-40 mt-1 font-bold`}>{moment(item.timestamp).format('MMM D, h:mm a')}</p>
                                </div>
                            </div>
                        )}) : (
                            <p className={`text-center ${s.textSecondary} opacity-20 py-10 italic`}>No recent focus activity</p>
                        )}
                    </div>
                </div>

            </div>

            <div className="lg:col-span-5 flex flex-col">
                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-indigo-950/20' : 'bg-white'} border rounded-[32px] p-8 shadow-xl`}>
                    <div className="flex items-center justify-between mb-6">
                        <h4 className={`font-bold ${s.text} text-lg flex items-center gap-2`}>
                            <LineChart className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                            Trends
                        </h4>
                        <div className={`flex ${s.sectionAlt} p-1 rounded-lg border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                            <button onClick={() => setTimeRange(14)} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${timeRange === 14 ? 'bg-indigo-500 text-white shadow-sm' : `${s.textSecondary} opacity-40 hover:opacity-100`}`}>14D</button>
                            <button onClick={() => setTimeRange(30)} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${timeRange === 30 ? 'bg-indigo-500 text-white shadow-sm' : `${s.textSecondary} opacity-40 hover:opacity-100`}`}>30D</button>
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
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)', fontSize: 10 }} dy={10} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff', border: theme === 'dark' ? 'none' : '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
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
