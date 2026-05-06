import moment from "moment";
import { useTheme } from "../../contexts/ThemeContext";
import { History, Bell, Target, Notebook } from "lucide-react";

export default function DailyHeader({ activeTab, setActiveTab, trackingStart }) {
    const { theme, s } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center gap-6 mb-16 text-center">
            <div>
                <h1 className={`text-5xl font-black tracking-tight ${s.text} mb-3`}>
                    Daily Hub
                </h1>
                <p className={`${s.textSecondary} font-medium mb-4 opacity-60`}>Build your spiritual and productive habits.</p>
                
                {trackingStart && (
                    <div className={`inline-flex items-center justify-center gap-2 ${s.card} border px-4 py-2 rounded-full mb-6`}>
                        <History className={`w-3 h-3 ${s.textSecondary} opacity-60`} />
                        <span className={`text-xs font-bold ${s.textSecondary} opacity-80`}>
                            Tracking since: <span className={s.text}>{moment(trackingStart).format('MMM D, YYYY')}</span> 
                            <span className={`${theme === 'dark' ? 'text-cyan-400' : 'text-emerald-600'} ml-1`}>({moment().diff(moment(trackingStart), 'days') + 1} Days)</span>
                        </span>
                    </div>
                )}
            </div>

            <div className={`p-1.5 rounded-2xl border ${s.nav} flex gap-2 w-full max-w-2xl shadow-2xl overflow-x-auto hide-scrollbar`}>
                <button 
                    onClick={() => setActiveTab('salah')}
                    className={`min-w-[120px] flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'salah' ? (theme === 'dark' ? 'bg-cyan-500 text-white shadow-lg' : 'bg-emerald-600 text-white shadow-lg') : `${s.text} opacity-40 hover:opacity-100 hover:${s.cardHover}`}`}
                >
                    <Bell className="w-4 h-4" /> Salah
                </button>
                <button 
                    onClick={() => setActiveTab('focus')}
                    className={`min-w-[120px] flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'focus' ? 'bg-purple-500 text-white shadow-lg' : `${s.text} opacity-40 hover:opacity-100 hover:${s.cardHover}`}`}
                >
                    <Target className="w-4 h-4" /> Focus
                </button>
                <button 
                    onClick={() => setActiveTab('notes')}
                    className={`min-w-[120px] flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'notes' ? 'bg-amber-500 text-white shadow-lg' : `${s.text} opacity-40 hover:opacity-100 hover:${s.cardHover}`}`}
                >
                    <Notebook className="w-4 h-4" /> Notes
                </button>
            </div>
        </div>
    );
}
