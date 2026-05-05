import moment from "moment";

export default function HistoryCalendar({ type, dataMap, trackingStart }) {
    const currentMonth = moment().format('MMMM YYYY');
    const daysInMonth = moment().daysInMonth();
    const startDay = moment().startOf('month').day(); // 0 is Sunday
    
    const blanks = Array(startDay).fill(null);
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    
    const getDayData = (day) => {
        const dateStr = moment().date(day).format('YYYY-MM-DD');
        return dataMap[dateStr] || 0;
    };

    const getColor = (val) => {
        if (type === 'salah') {
            if (val === 0) return 'bg-white/5 border border-white/5 text-white/20 hover:border-white/20';
            if (val < 20) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-400/50';
            if (val < 50) return 'bg-emerald-500/50 text-emerald-100 border border-emerald-500/50 hover:bg-emerald-500/60';
            return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400';
        } else if (type === 'notes') {
            if (val === 0) return 'bg-white/5 border border-white/5 text-white/20 hover:border-white/20';
            if (val < 50) return 'bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-400/50';
            if (val < 200) return 'bg-amber-500/50 text-amber-100 border border-amber-500/50 hover:bg-amber-500/60';
            return 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 border border-amber-400';
        } else {
            if (val === 0) return 'bg-white/5 border border-white/5 text-white/20 hover:border-white/20';
            if (val < 15) return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-400/50';
            if (val < 45) return 'bg-indigo-500/50 text-indigo-100 border border-indigo-500/50 hover:bg-indigo-500/60';
            return 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400';
        }
    };

    const getIcon = () => {
        if (type === 'salah') return 'fa-calendar-days text-emerald-400';
        if (type === 'notes') return 'fa-calendar-days text-amber-400';
        return 'fa-calendar-days text-indigo-400';
    };

    const getSummaryLabel = () => {
        if (type === 'salah') return 'Total Points';
        if (type === 'focus') return 'Total Mins';
        return 'Total Chars';
    };

    return (
        <div className="bg-[#020617]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-xl mt-8">
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-white text-lg flex items-center gap-3">
                    <i className={`fa-solid ${getIcon()}`}></i>
                    {currentMonth} History
                </h4>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={`head-${i}`} className="text-center text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">{d}</div>
                ))}
                {blanks.map((_, i) => <div key={`blank-${i}`} className="aspect-square"></div>)}
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
                            className={`relative aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110 cursor-pointer ${getColor(val)} ${isToday ? 'ring-2 ring-white ring-offset-2 ring-offset-[#020617]' : ''}`}
                            title={`${dateObj.format('MMM D')}: ${val} ${type === 'salah' ? 'pts' : (type === 'notes' ? 'chars' : 'mins')}`}
                        >
                            {d}
                            {showRedDot && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)] animate-pulse"></span>
                            )}
                        </div>
                    )
                })}
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Summary</span>
                <span className="text-sm font-black text-white">
                    {`${Object.keys(dataMap).filter(k => moment(k).isSame(moment(), 'month')).reduce((a,b) => a + dataMap[b], 0)} ${getSummaryLabel()}`}
                </span>
            </div>
        </div>
    );
}
