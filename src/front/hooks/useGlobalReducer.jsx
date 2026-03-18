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



// // Import necessary hooks and functions from React.
// import { useContext, useReducer, createContext } from "react";
// import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.

// // Create a context to hold the global state of the application
// // We will call this global state the "store" to avoid confusion while using local states
// const StoreContext = createContext()

// // Define a provider component that encapsulates the store and warps it in a context provider to 
// // broadcast the information throught all the app pages and components.
// export function StoreProvider({ children }) {
//     // Initialize reducer with the initial state.
//     const [store, dispatch] = useReducer(storeReducer, initialStore())
//     // Provide the store and dispatch method to all child components.
//     return <StoreContext.Provider value={{ store, dispatch }}>
//         {children}
//     </StoreContext.Provider>
// }

// // Custom hook to access the global state and dispatch function.
// export default function useGlobalReducer() {
//     const { dispatch, store } = useContext(StoreContext)
//     return { dispatch, store };
// }

