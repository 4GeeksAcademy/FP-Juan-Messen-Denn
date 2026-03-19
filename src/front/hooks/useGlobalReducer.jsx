import { useContext, useReducer, createContext, useEffect, useRef } from "react";
import storeReducer, { initialStore } from "../store";

const StoreContext = createContext();

const POMODORO_KEY = "pomify_pomodoro";

const loadPomodoro = () => {
    try {
        const saved = sessionStorage.getItem(POMODORO_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const savePomodoro = (pomodoro) => {
    try {
        sessionStorage.setItem(POMODORO_KEY, JSON.stringify(pomodoro));
    } catch {}
};

const getInitialStore = () => {
    const base = initialStore();
    const savedPomodoro = loadPomodoro();
    if (savedPomodoro) {
        return { ...base, pomodoro: { ...savedPomodoro, isRunning: false } };
    }
    return base;
};

const persistingReducer = (store, action) => {
    const next = storeReducer(store, action);
    if (next.pomodoro !== store.pomodoro) {
        savePomodoro(next.pomodoro);
    }
    return next;
};

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(persistingReducer, getInitialStore());
    const phaseLeftRef = useRef(store.pomodoro.phaseLeft);
    const storeRef = useRef(store);
    const audioRef = useRef(null);

    useEffect(() => {
        storeRef.current = store;
        phaseLeftRef.current = store.pomodoro.phaseLeft;
    }, [store]);

    // Tick del pomodoro
    useEffect(() => {
        const interval = setInterval(() => {
            if (!storeRef.current.pomodoro.isRunning) return;
            dispatch({ type: "pomodoro_tick" });
            if (phaseLeftRef.current <= 1) {
                dispatch({ type: "pomodoro_phase_end" });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Cambia la pista cuando cambia playlist o índice
    useEffect(() => {
        const { currentPlaylist, currentTrackIndex } = storeRef.current;
        if (!currentPlaylist || !audioRef.current) return;
        const sound = currentPlaylist.sounds[currentTrackIndex];
        const preview = sound?.previews?.["preview-lq-mp3"] || sound?.previews?.["preview-hq-mp3"] || sound?.previews?.["preview-lq-ogg"];
        if (preview) {
            audioRef.current.src = preview;
            audioRef.current.load();
            audioRef.current.play().catch(() => {});
        }
    }, [store.currentPlaylist, store.currentTrackIndex]);

    // Pausa o reanuda
    useEffect(() => {
        if (!audioRef.current) return;
        if (store.isPlaying) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }, [store.isPlaying]);

    return (
        <StoreContext.Provider value={{ store, dispatch, audioRef }}>
            <audio
                ref={audioRef}
                onEnded={() => {
                    const { currentPlaylist, currentTrackIndex } = storeRef.current;
                    if (!currentPlaylist) return;
                    if (currentTrackIndex < currentPlaylist.sounds.length - 1) {
                        dispatch({ type: "set_track_index", payload: currentTrackIndex + 1 });
                    } else {
                        dispatch({ type: "set_playing", payload: false });
                    }
                }}
                style={{ display: "none" }}
            />
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const { dispatch, store, audioRef } = useContext(StoreContext);
    return { dispatch, store, audioRef };
}