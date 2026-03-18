import { useContext, useReducer, createContext, useEffect } from "react";
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
        return { ...base, pomodoro: savedPomodoro };
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

    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext);
    return { dispatch, store };
}