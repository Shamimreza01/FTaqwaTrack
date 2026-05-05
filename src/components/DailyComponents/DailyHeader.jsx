import moment from "moment";

export default function DailyHeader({ activeTab, setActiveTab, trackingStart }) {
    return (
        <div className="flex flex-col items-center justify-center gap-6 mb-16 text-center">
            <div>
                <h1 className="text-5xl font-black tracking-tight text-white mb-3">
                    Daily Hub
                </h1>
                <p className="text-white/40 font-medium mb-4">Build your spiritual and productive habits.</p>
                
                {trackingStart && (
                    <div className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
                        <i className="fa-solid fa-clock-rotate-left text-white/40 text-xs"></i>
                        <span className="text-xs font-bold text-white/60">
                            Tracking since: <span className="text-white">{moment(trackingStart).format('MMM D, YYYY')}</span> 
                            <span className="text-emerald-400 ml-1">({moment().diff(moment(trackingStart), 'days') + 1} Days)</span>
                        </span>
                    </div>
                )}
            </div>

            <div className="bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 flex gap-2 w-full max-w-2xl shadow-2xl overflow-x-auto hide-scrollbar">
                <button 
                    onClick={() => setActiveTab('salah')}
                    className={`min-w-[120px] flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'salah' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                    <i className="fa-solid fa-mosque"></i> Salah
                </button>
                <button 
                    onClick={() => setActiveTab('focus')}
                    className={`min-w-[120px] flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'focus' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                    <i className="fa-solid fa-bullseye"></i> Focus
                </button>
                <button 
                    onClick={() => setActiveTab('notes')}
                    className={`min-w-[120px] flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'notes' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                    <i className="fa-solid fa-book-open"></i> Notes
                </button>
            </div>
        </div>
    );
}
