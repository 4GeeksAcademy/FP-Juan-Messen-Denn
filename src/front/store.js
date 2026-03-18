export const initialStore = () => {
    return {
        message: null,
        currentUser: null,
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case "set_hello":
            return { ...store, message: action.payload };

        case "set_user":
            return { ...store, currentUser: action.payload };

        case "logout":
            return { ...store, currentUser: null };

        default:
            throw Error("Unknown action: " + action.type);
    }
}