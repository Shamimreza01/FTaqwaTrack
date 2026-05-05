import { useState, useEffect } from "react";
import { openDB } from "idb";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import moment from "moment";

const initFocusDB = async () => {
    return openDB("focusDB", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("sessions")) {
                const store = db.createObjectStore("sessions", { keyPath: "id", autoIncrement: true });
                store.createIndex("date", "date", { unique: false });
            }
        },
    });
};

export default function DailyFocus() {
    const [title, setTitle] = useState("Quran Reading");
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [sessionData, setSessionData] = useState([]);

    // Load historical sessions
    useEffect(() => {
        const loadHistory = async () => {
            const db = await initFocusDB();
            const tx = db.transaction("sessions", "readonly");
            const store = tx.objectStore("sessions");
            const allSessions = await store.getAll();

            // Group by date for Graph
            const grouped = allSessions.reduce((acc, curr) => {
                if (!acc[curr.date]) acc[curr.date] = 0;
                acc[curr.date] += curr.durationMinutes;
                return acc;
            }, {});

            // Create last 30 days array
            const chartData = [];
            for (let i = 29; i >= 0; i--) {
                const d = moment().subtract(i, 'days').format('YYYY-MM-DD');
                chartData.push({
                    date: moment(d).format('MMM D'),
                    minutes: grouped[d] || 0
                });
            }
            setSessionData(chartData);
        };
        loadHistory();
    }, []);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinish = async () => {
        if (seconds === 0) return;
        setIsActive(false);
        const durationMinutes = parseFloat((seconds / 60).toFixed(2));

        const db = await initFocusDB();
        await db.add("sessions", {
            date: moment().format("YYYY-MM-DD"),
            title: title || "Deep Focus",
            durationMinutes: durationMinutes,
            timestamp: new Date().toISOString()
        });

        // Hard refresh logic mapping
        const tx = db.transaction("sessions", "readonly");
        const allSessions = await tx.objectStore("sessions").getAll();

        const grouped = allSessions.reduce((acc, curr) => {
            if (!acc[curr.date]) acc[curr.date] = 0;
            acc[curr.date] += curr.durationMinutes;
            return acc;
        }, {});

        const chartData = [];
        for (let i = 29; i >= 0; i--) {
            const d = moment().subtract(i, 'days').format('YYYY-MM-DD');
            chartData.push({
                date: moment(d).format('MMM D'),
                minutes: parseFloat((grouped[d] || 0).toFixed(2))
            });
        }
        setSessionData(chartData);
        setSeconds(0);
    };

    return (
        <div className="font-sans py-[100px] px-4 max-w-4xl mx-auto min-h-screen text-white relative z-10">
            {/* Header */}
            <div className="w-full bg-[#021B1A]/80 backdrop-blur-xl border-b border-emerald-500/10 p-4 fixed top-0 left-0 z-50 shadow-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h2 className="text-emerald-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        <i className="fa-solid fa-bullseye mr-2"></i>Daily Focus
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-20">
                {/* Timer Section */}
                <div className="bg-gradient-to-b from-[#052C2D]/80 to-[#021B1A]/90 p-8 rounded-3xl border border-emerald-500/20 shadow-2xl flex flex-col items-center relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-60"></div>

                    <h3 className="text-sm uppercase tracking-widest text-emerald-400 font-bold mb-6 z-10">Focus Session</h3>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What are you focusing on?"
                        className="w-full max-w-[250px] bg-black/30 border border-emerald-500/30 rounded-xl px-4 py-2 text-center text-emerald-100 font-medium focus:outline-none focus:border-emerald-400 transition-colors z-10 mb-8"
                    />

                    {/* Circular Timer UI */}
                    <div className="relative w-64 h-64 flex items-center justify-center z-10 mb-10">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                className="stroke-black/40"
                                strokeWidth="8"
                                fill="none"
                            />
                            <motion.circle
                                cx="128"
                                cy="128"
                                r="120"
                                className="stroke-emerald-500"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={isActive ? 0 : 2 * Math.PI * 120 * (1 - (seconds % 60) / 60)}
                                animate={isActive ? { strokeDashoffset: [2 * Math.PI * 120, 0] } : {}}
                                transition={isActive ? { duration: 60, repeat: Infinity, ease: "linear" } : {}}
                            />
                        </svg>
                        <div className="text-5xl font-light tracking-wider drop-shadow-lg text-white">
                            {formatTime(seconds)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 z-10">
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30' : 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:bg-emerald-400 hover:scale-105'}`}
                        >
                            <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'} text-xl ml-${isActive ? '0' : '1'}`}></i>
                        </button>

                        <AnimatePresence>
                            {seconds > 0 && !isActive && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    onClick={handleFinish}
                                    className="px-6 h-16 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full transition-all duration-300 flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-flag-checkered"></i> Finish
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="bg-[#052C2D]/40 backdrop-blur-md p-6 rounded-3xl border border-emerald-500/20 w-full h-full min-h-[400px] flex flex-col items-center">
                    <div className="w-full flex items-center gap-3 mb-6 block pb-4 border-b border-emerald-500/10">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <i className="fa-solid fa-chart-area text-emerald-400"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-wide">Monthly Activity</h3>
                            <p className="text-xs font-medium text-emerald-400/80">Accumulated Focus Minutes</p>
                        </div>
                    </div>

                    <div className="w-full h-full min-h-[300px] mt-4 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sessionData}>
                                <defs>
                                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                                    dy={10}
                                    minTickGap={20}
                                />
                                <YAxis
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(5, 44, 45, 0.9)', borderColor: 'rgba(52, 211, 153, 0.3)', borderRadius: '12px', padding: '10px' }}
                                    itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.7)', paddingBottom: '4px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="minutes"
                                    stroke="#34d399"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMinutes)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}
