import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [arabicFontSize, setArabicFontSize] = useState(() => {
        const saved = localStorage.getItem('quranArabicFontSize');
        return saved ? Number(saved) : 40;
    });

    const [translationFontSize, setTranslationFontSize] = useState(() => {
        const saved = localStorage.getItem('quranTranslationFontSize');
        return saved ? Number(saved) : 16;
    });

    const [bookmarkId, setBookmarkId] = useState(() => {
        return localStorage.getItem('quranBookmarkAyah') || null;
    });

    const [favoriteAyahIds, setFavoriteAyahIds] = useState(() => {
        const saved = localStorage.getItem('quranFavoriteAyahs');
        return saved ? JSON.parse(saved) : [];
    });

    const [duaBookmarkId, setDuaBookmarkId] = useState(() => {
        return localStorage.getItem('duaBookmarkItem') || null;
    });

    const [favoriteDuaIds, setFavoriteDuaIds] = useState(() => {
        const saved = localStorage.getItem('quranFavoriteDuas');
        return saved ? JSON.parse(saved) : [];
    });

    const [memorizedDuaIds, setMemorizedDuaIds] = useState(() => {
        const saved = localStorage.getItem('memorizedDuasHifz');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('quranArabicFontSize', arabicFontSize);
    }, [arabicFontSize]);

    useEffect(() => {
        localStorage.setItem('quranTranslationFontSize', translationFontSize);
    }, [translationFontSize]);

    useEffect(() => {
        if (bookmarkId) {
            localStorage.setItem('quranBookmarkAyah', bookmarkId);
        } else {
            localStorage.removeItem('quranBookmarkAyah');
        }
    }, [bookmarkId]);

    useEffect(() => {
        localStorage.setItem('quranFavoriteAyahs', JSON.stringify(favoriteAyahIds));
    }, [favoriteAyahIds]);

    useEffect(() => {
        if (duaBookmarkId) {
            localStorage.setItem('duaBookmarkItem', duaBookmarkId);
        } else {
            localStorage.removeItem('duaBookmarkItem');
        }
    }, [duaBookmarkId]);

    useEffect(() => {
        localStorage.setItem('quranFavoriteDuas', JSON.stringify(favoriteDuaIds));
    }, [favoriteDuaIds]);

    useEffect(() => {
        localStorage.setItem('memorizedDuasHifz', JSON.stringify(memorizedDuaIds));
    }, [memorizedDuaIds]);

    const toggleFavorite = (id) => {
        setFavoriteAyahIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleBookmark = (id) => {
        setBookmarkId(prev => prev === id ? null : id);
    };

    const toggleFavoriteDua = (id) => {
        setFavoriteDuaIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleDuaBookmark = (id) => {
        setDuaBookmarkId(prev => prev === id ? null : id);
    };

    const toggleMemorizedDua = (id) => {
        setMemorizedDuaIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <SettingsContext.Provider value={{
            arabicFontSize, setArabicFontSize,
            translationFontSize, setTranslationFontSize,
            bookmarkId, toggleBookmark,
            favoriteAyahIds, toggleFavorite,
            duaBookmarkId, toggleDuaBookmark,
            favoriteDuaIds, toggleFavoriteDua,
            memorizedDuaIds, toggleMemorizedDua
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
