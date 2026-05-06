import { useState } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import HistoryCalendar from "./HistoryCalendar";
import { useTheme } from "../../contexts/ThemeContext";
import { PenLine, Save, BookOpen, Trash2 } from "lucide-react";

export default function NotesView({
    todayNotes,
    handleSaveNote,
    handleDeleteNote,
    noteHistoryMap,
    today
}) {
    const { theme, s } = useTheme();
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");

    const onSave = () => {
        if (!noteContent.trim() && !noteTitle.trim()) return;
        handleSaveNote(noteTitle, noteContent);
        setNoteTitle("");
        setNoteContent("");
    };

    return (
        <motion.div
            key="notes-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
            <div className="lg:col-span-7 flex flex-col gap-8">
                {/* New Note Editor */}
                <div className={`${s.card} border rounded-[32px] p-6 lg:p-10 shadow-2xl flex flex-col`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-2xl font-bold ${s.text} tracking-wide flex items-center gap-3`}>
                            <PenLine className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                            New Note
                        </h3>
                        <button
                            onClick={onSave}
                            className={`${theme === 'dark'
                                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                            } text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2`}
                        >
                            <Save className="w-4 h-4" />
                            Save Note
                        </button>
                    </div>
                    <p className={`${theme === 'dark' ? 'text-amber-400/60' : 'text-amber-700/70'} text-sm mb-6 font-medium`}>
                        Write down your daily lessons, duas, or moments of gratitude.
                    </p>

                    <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        maxLength={100}
                        placeholder="Note Title (Optional)"
                        className={`w-full ${s.input} border rounded-t-2xl p-4 text-lg font-bold focus:outline-none transition-all`}
                    />
                    <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        maxLength={5000}
                        placeholder="Alhamdulillah for everything today..."
                        className={`w-full ${s.input} border border-t-0 rounded-b-2xl p-6 focus:outline-none transition-all resize-none font-medium leading-relaxed min-h-[250px]`}
                    />

                    <div className={`mt-4 flex justify-end text-xs font-bold ${s.textSecondary} uppercase tracking-widest opacity-50`}>
                        {noteContent.length} / 5000 Characters
                    </div>
                </div>

                {/* Today's Notes List */}
                {todayNotes && todayNotes.length > 0 && (
                    <div className={`${s.card} border rounded-[32px] p-8`}>
                        <h4 className={`text-lg font-bold ${s.text} mb-6 flex items-center gap-2`}>
                            <BookOpen className={`w-5 h-5 ${s.textSecondary} opacity-50`} />
                            Today's Entries ({todayNotes.length})
                        </h4>
                        <div className="space-y-4">
                            {todayNotes.map((note) => (
                                <div key={note.id} className={`p-6 ${s.sectionAlt} rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className={`font-bold text-lg ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                                            {note.title || "Untitled Note"}
                                        </h5>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] ${s.textSecondary} opacity-50 uppercase tracking-widest font-bold`}>
                                                {moment(note.timestamp).format('h:mm A')}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteNote(note.id, today)}
                                                className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                                title="Delete Note"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className={`${s.textSecondary} text-sm leading-relaxed whitespace-pre-wrap`}>
                                        {note.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:col-span-5 flex flex-col">
                <HistoryCalendar type="notes" dataMap={noteHistoryMap} />
            </div>
        </motion.div>
    );
}
