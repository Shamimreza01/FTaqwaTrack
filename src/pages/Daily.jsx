import { useState, useEffect } from "react";
import { openDB } from "idb";
import { AnimatePresence } from "framer-motion";
import moment from "moment";

import DailyHeader from "../components/DailyComponents/DailyHeader";
import SalahView from "../components/DailyComponents/SalahView";
import FocusView from "../components/DailyComponents/FocusView";
import NotesView from "../components/DailyComponents/NotesView";

const initDailyDB = async () => {
    return openDB("dailyDB", 3, {
        upgrade(db, oldVersion, newVersion) {
            if (!db.objectStoreNames.contains("focus_sessions")) {
                db.createObjectStore("focus_sessions", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("salah_records")) {
                db.createObjectStore("salah_records", { keyPath: "date" });
            }
            if (!db.objectStoreNames.contains("daily_notes")) {
                db.createObjectStore("daily_notes", { keyPath: "date" });
            }
        },
    });
};

export default function Daily() {
    const [activeTab, setActiveTab] = useState("salah");
    const [timeRange, setTimeRange] = useState(14);
    
    // Salah States
    const [salahState, setSalahState] = useState({});
    const [salahHistoryMap, setSalahHistoryMap] = useState({});
    
    // Focus States
    const [title, setTitle] = useState("Quran Reading");
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [focusHistoryMap, setFocusHistoryMap] = useState({});

    // Notes States
    const [todayNotes, setTodayNotes] = useState([]); // Array of notes for today
    const [noteHistoryMap, setNoteHistoryMap] = useState({});

    // Shared Analytics
    const [pointsHistory, setPointsHistory] = useState([]);
    const [historyFeed, setHistoryFeed] = useState([]);
    const [stats, setStats] = useState({ todayPoints: 0, todayMinutes: 0 });
    const [trackingStart, setTrackingStart] = useState(null);
    
    const today = moment().format("YYYY-MM-DD");

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadData();
    }, [timeRange]);

    const loadData = async () => {
        try {
            const db = await initDailyDB();
            
            // Load Today's Salah
            const todaySalah = await db.get("salah_records", today);
            if (todaySalah) {
                setSalahState(todaySalah.prayers || {});
            }

            // Load Today's Notes
            const todayNoteDoc = await db.get("daily_notes", today);
            if (todayNoteDoc && todayNoteDoc.notes) {
                // sort descending by timestamp
                setTodayNotes([...todayNoteDoc.notes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            } else {
                setTodayNotes([]);
            }

            // Load All Data for Analytics
            const allFocus = await db.getAll("focus_sessions");
            const groupedFocus = allFocus.reduce((acc, curr) => {
                if (!acc[curr.date]) acc[curr.date] = 0;
                acc[curr.date] += curr.durationMinutes;
                return acc;
            }, {});

            const allSalah = await db.getAll("salah_records");
            const groupedSalah = allSalah.reduce((acc, curr) => {
                acc[curr.date] = curr.totalPoints;
                return acc;
            }, {});

            const allNotes = await db.getAll("daily_notes");
            const groupedNotes = allNotes.reduce((acc, curr) => {
                // calculate total characters written on this date across all notes
                const totalChars = curr.notes?.reduce((sum, n) => sum + (n.content?.length || 0), 0) || 0;
                acc[curr.date] = totalChars;
                return acc;
            }, {});

            setSalahHistoryMap(groupedSalah);
            setFocusHistoryMap(groupedFocus);
            setNoteHistoryMap(groupedNotes);

            // Find earliest tracking date
            let earliestDate = today;
            [...allSalah, ...allFocus, ...allNotes].forEach(record => {
                const dateStr = record.date || record.timestamp?.split('T')[0];
                if (dateStr && moment(dateStr).isBefore(moment(earliestDate))) {
                    earliestDate = dateStr;
                }
            });
            setTrackingStart(earliestDate);

            // Create Chart Data based on timeRange
            const combinedHistory = [];
            for (let i = timeRange - 1; i >= 0; i--) {
                const d = moment().subtract(i, 'days').format('YYYY-MM-DD');
                combinedHistory.push({
                    date: moment(d).format('MMM D'),
                    fullDate: d,
                    minutes: parseFloat((groupedFocus[d] || 0).toFixed(1)),
                    points: groupedSalah[d] || 0
                });
            }
            setPointsHistory(combinedHistory);

            setStats({
                todayPoints: groupedSalah[today] || 0,
                todayMinutes: parseFloat((groupedFocus[today] || 0).toFixed(1))
            });

            const recentFocus = allFocus.slice(-15).map(f => ({ ...f, type: 'focus' }));
            const recentSalah = allSalah.slice(-15).map(s => ({ ...s, type: 'salah' }));
            const combinedFeed = [...recentFocus, ...recentSalah].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setHistoryFeed(combinedFeed);
        } catch (error) {
            console.error("IndexedDB error:", error);
        }
    };

    const handleSalahUpdate = async (salahId, type) => {
        const newPrayers = { ...salahState, [salahId]: type };
        setSalahState(newPrayers);

        let totalPoints = 0;
        Object.values(newPrayers).forEach(val => {
            if (val === 'jamat') totalPoints += 27;
            if (val === 'single') totalPoints += 1;
        });

        try {
            const db = await initDailyDB();
            await db.put("salah_records", {
                date: today,
                prayers: newPrayers,
                totalPoints: totalPoints,
                timestamp: new Date().toISOString()
            });
            loadData();
        } catch (error) {
            console.error("Failed to save Salah:", error);
        }
    };

    const handleSaveNote = async (noteTitle, noteContent) => {
        try {
            const db = await initDailyDB();
            const existingDoc = await db.get("daily_notes", today);
            const newNote = {
                id: Date.now().toString(),
                title: noteTitle,
                content: noteContent,
                timestamp: new Date().toISOString()
            };
            
            const updatedNotes = existingDoc && existingDoc.notes 
                ? [...existingDoc.notes, newNote] 
                : [newNote];

            // Migration safety: if old schema existed (single content field), optionally preserve it
            if (existingDoc && existingDoc.content && !existingDoc.notes) {
                updatedNotes.unshift({
                    id: "legacy",
                    title: "Imported Note",
                    content: existingDoc.content,
                    timestamp: existingDoc.timestamp || new Date().toISOString()
                });
            }

            await db.put("daily_notes", {
                date: today,
                notes: updatedNotes,
                timestamp: new Date().toISOString() // last updated
            });
            loadData();
        } catch (error) {
            console.error("Failed to save Note:", error);
        }
    };

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinishFocus = async () => {
        if (seconds < 10) return;
        setIsActive(false);
        const durationMinutes = parseFloat((seconds / 60).toFixed(2));
        
        try {
            const db = await initDailyDB();
            await db.add("focus_sessions", {
                date: today,
                title: title || "Deep Focus",
                durationMinutes: durationMinutes,
                timestamp: new Date().toISOString()
            });
            setSeconds(0);
            loadData();
        } catch (error) {
            console.error("Failed to save Focus:", error);
        }
    };

    const handleDeleteFocus = async (id) => {
        try {
            const db = await initDailyDB();
            await db.delete("focus_sessions", id);
            loadData();
        } catch (error) {
            console.error("Failed to delete Focus:", error);
        }
    };

    const handleDeleteNote = async (noteId, dateStr) => {
        try {
            const db = await initDailyDB();
            const existingDoc = await db.get("daily_notes", dateStr);
            if (existingDoc && existingDoc.notes) {
                const updatedNotes = existingDoc.notes.filter(n => n.id !== noteId);
                await db.put("daily_notes", {
                    date: dateStr,
                    notes: updatedNotes,
                    timestamp: new Date().toISOString()
                });
                loadData();
            }
        } catch (error) {
            console.error("Failed to delete Note:", error);
        }
    };

    const salahFeed = historyFeed.filter(f => f.type === 'salah').slice(0, 5);
    const focusFeed = historyFeed.filter(f => f.type === 'focus').slice(0, 5);

    return (
        <div className="font-sans py-24 px-4 max-w-7xl mx-auto min-h-screen text-white relative z-10">
            <DailyHeader 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                trackingStart={trackingStart} 
            />

            <AnimatePresence mode="wait">
                {activeTab === 'salah' && (
                    <SalahView 
                        salahState={salahState}
                        handleSalahUpdate={handleSalahUpdate}
                        salahFeed={salahFeed}
                        stats={stats}
                        pointsHistory={pointsHistory}
                        salahHistoryMap={salahHistoryMap}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        trackingStart={trackingStart}
                    />
                )}

                {activeTab === 'focus' && (
                    <FocusView 
                        title={title}
                        setTitle={setTitle}
                        seconds={seconds}
                        isActive={isActive}
                        setIsActive={setIsActive}
                        handleFinishFocus={handleFinishFocus}
                        handleDeleteFocus={handleDeleteFocus}
                        formatTime={formatTime}
                        focusFeed={focusFeed}
                        stats={stats}
                        pointsHistory={pointsHistory}
                        focusHistoryMap={focusHistoryMap}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                    />
                )}

                {activeTab === 'notes' && (
                    <NotesView 
                        todayNotes={todayNotes}
                        handleSaveNote={handleSaveNote}
                        handleDeleteNote={handleDeleteNote}
                        noteHistoryMap={noteHistoryMap}
                        today={today}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
