export const initialStore = () => {
  return {
    message: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null }
    ],
    currentPlaylist: null,
    currentTrackIndex: 0,
    isPlaying: false
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return { ...store, message: action.payload };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    case 'set_playlist':
      return {
        ...store,
        currentPlaylist: action.payload,
        currentTrackIndex: 0,
        isPlaying: true
      };

    case 'set_track_index':
      return { ...store, currentTrackIndex: action.payload };

    case 'set_playing':
      return { ...store, isPlaying: action.payload };

    default:
      throw Error('Unknown action.');
  }
}