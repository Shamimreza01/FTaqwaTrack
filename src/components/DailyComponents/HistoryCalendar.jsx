import moment from "moment";
import { useTheme } from "../../contexts/ThemeContext";
import { CalendarDays } from "lucide-react";

export default function HistoryCalendar({ type, dataMap, trackingStart }) {
    const { theme, s } = useTheme();

    const currentMonth = moment().format('MMMM YYYY');
    const daysInMonth = moment().daysInMonth();
    const startDay = moment().startOf('month').day(); // 0 = Sunday

    const blanks = Array(startDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getDayData = (day) => {
        const dateStr = moment().date(day).format('YYYY-MM-DD');
        return dataMap[dateStr] || 0;
    };

    // Returns Tailwind classes appropriate for both light and dark themes
    const getColor = (val) => {
        if (type === 'salah') {
            if (val === 0) return theme === 'dark'
                ? 'bg-white/5 border border-white/5 text-white/20 hover:border-white/20'
                : 'bg-slate-100 border border-slate-200 text-slate-300 hover:border-slate-300';
            if (val < 20) return theme === 'dark'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-400/50'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:border-emerald-400';
            if (val < 50) return theme === 'dark'
                ? 'bg-emerald-500/50 text-emerald-100 border border-emerald-500/50'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-300';
            return theme === 'dark'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400'
                : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border border-emerald-400';
        }
        if (type === 'notes') {
            if (val === 0) return theme === 'dark'
                ? 'bg-white/5 border border-white/5 text-white/20 hover:border-white/20'
                : 'bg-slate-100 border border-slate-200 text-slate-300 hover:border-slate-300';
            if (val < 50) return theme === 'dark'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-400/50'
                : 'bg-amber-50 text-amber-600 border border-amber-200 hover:border-amber-400';
            if (val < 200) return theme === 'dark'
                ? 'bg-amber-500/50 text-amber-100 border border-amber-500/50'
                : 'bg-amber-100 text-amber-700 border border-amber-300';
            return theme === 'dark'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 border border-amber-400'
                : 'bg-amber-500 text-white shadow-md shadow-amber-500/20 border border-amber-400';
        }
        // focus (default)
        if (val === 0) return theme === 'dark'
            ? 'bg-white/5 border border-white/5 text-white/20 hover:border-white/20'
            : 'bg-slate-100 border border-slate-200 text-slate-300 hover:border-slate-300';
        if (val < 15) return theme === 'dark'
            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-400/50'
            : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:border-indigo-400';
        if (val < 45) return theme === 'dark'
            ? 'bg-indigo-500/50 text-indigo-100 border border-indigo-500/50'
            : 'bg-indigo-100 text-indigo-700 border border-indigo-300';
        return theme === 'dark'
            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400'
            : 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 border border-indigo-400';
    };

    const accentColor = {
        salah: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
        notes: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
        focus: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600',
    }[type] || 'text-blue-500';

    const getSummaryLabel = () => {
        if (type === 'salah') return 'Total Points';
        if (type === 'focus') return 'Total Mins';
        return 'Total Chars';
    };

    const todayRingColor = theme === 'dark'
        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#020617]'
        : 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white';

    return (
        <div className={`${s.card} border rounded-[32px] p-8 shadow-xl mt-8`}>
            <div className="flex items-center justify-between mb-6">
                <h4 className={`font-bold ${s.text} text-lg flex items-center gap-3`}>
                    <CalendarDays className={`w-5 h-5 ${accentColor}`} />
                    {currentMonth} History
                </h4>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`head-${i}`} className={`text-center text-[10px] font-black ${s.textSecondary} opacity-50 mb-1 uppercase tracking-widest`}>{d}</div>
                ))}
                {blanks.map((_, i) => <div key={`blank-${i}`} className="aspect-square" />)}
                {days.map(d => {
                    const val = getDayData(d);
                    const isToday = d === moment().date();
                    const dateObj = moment().date(d);
                    const isPastOrToday = dateObj.isSameOrBefore(moment(), 'day');
                    const isAfterStart = trackingStart ? dateObj.isSameOrAfter(moment(trackingStart), 'day') : true;
                    const showRedDot = type === 'salah' && isPastOrToday && isAfterStart && val < 5;

                    return (
                        <div
                            key={d}
                            className={`relative aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110 cursor-pointer ${getColor(val)} ${isToday ? todayRingColor : ''}`}
                            title={`${dateObj.format('MMM D')}: ${val} ${type === 'salah' ? 'pts' : (type === 'notes' ? 'chars' : 'mins')}`}
                        >
                            {d}
                            {showRedDot && (
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.8)] animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={`flex items-center justify-between mt-6 pt-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <span className={`text-[10px] font-bold ${s.textSecondary} opacity-50 uppercase tracking-widest`}>This Month</span>
                <span className={`text-sm font-black ${accentColor}`}>
                    {`${Object.keys(dataMap)
                        .filter(k => moment(k).isSame(moment(), 'month'))
                        .reduce((a, b) => a + dataMap[b], 0)} ${getSummaryLabel()}`}
                </span>
            </div>
        </div>
    );
}
