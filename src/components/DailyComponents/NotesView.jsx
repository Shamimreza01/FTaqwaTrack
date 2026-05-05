import { useState } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import HistoryCalendar from "./HistoryCalendar";

export default function NotesView({
    todayNotes, // array of {id, title, content, timestamp}
    handleSaveNote,
    handleDeleteNote,
    noteHistoryMap,
    today
}) {
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
                <div className="bg-[#1A1105]/40 backdrop-blur-xl border border-amber-500/10 rounded-[32px] p-6 lg:p-10 shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                            <i className="fa-solid fa-pen-nib text-amber-400"></i>
                            New Note
                        </h3>
                        <button 
                            onClick={onSave}
                            className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-2"
                        >
                            <i className="fa-solid fa-floppy-disk"></i>
                            Save Note
                        </button>
                    </div>
                    <p className="text-amber-400/60 text-sm mb-6 font-medium">Write down your daily lessons, duas, or moments of gratitude.</p>
                    
                    <input 
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        maxLength={100}
                        placeholder="Note Title (Optional)"
                        className="w-full bg-black/40 border border-amber-500/20 rounded-t-2xl p-4 text-white text-lg font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/50"
                    />
                    <textarea 
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        maxLength={5000}
                        placeholder="Alhamdulillah for everything today..."
                        className="w-full bg-black/40 border border-amber-500/20 border-t-0 rounded-b-2xl p-6 text-white text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/50 resize-none font-medium leading-relaxed min-h-[250px]"
                    ></textarea>
                    
                    <div className="mt-4 flex justify-end text-xs font-bold text-white/30 uppercase tracking-widest">
                        {noteContent.length} Characters
                    </div>
                </div>

                {/* List of today's notes */}
                {todayNotes && todayNotes.length > 0 && (
                    <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-book text-white/40"></i>
                            Today's Entries ({todayNotes.length})
                        </h4>
                        <div className="space-y-4">
                            {todayNotes.map((note) => (
                                <div key={note.id} className="p-6 bg-black/20 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-bold text-amber-400 text-lg">{note.title || "Untitled Note"}</h5>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest">{moment(note.timestamp).format('h:mm A')}</span>
                                            <button 
                                                onClick={() => handleDeleteNote(note.id, today)}
                                                className="w-6 h-6 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                                title="Delete Note"
                                            >
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
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
