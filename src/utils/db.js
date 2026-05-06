import { openDB } from "idb";

/**
 * Opens (and upgrades if needed) the shared TaqwaTrack dailyDB.
 * Version 3 schema: focus_sessions, salah_records, daily_notes
 * This is the single source of truth — imported by Daily.jsx and Menu.jsx.
 */
export const initDailyDB = async () => {
    return openDB("dailyDB", 3, {
        upgrade(db, oldVersion) {
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
