import { useEffect, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const GlobalAudioPlayer = () => {
  const { store, dispatch } = useGlobalReducer();
  const audioRef = useRef(null);

  const { currentPlaylist, currentTrackIndex, isPlaying } = store;

  const getPreview = (sound) => {
    return sound.previews?.["preview-lq-mp3"] || sound.previews?.["preview-hq-mp3"] || sound.previews?.["preview-lq-ogg"];
  };

  // Cambia la pista cuando cambia el índice o la playlist
  useEffect(() => {
    if (!currentPlaylist || !audioRef.current) return;
    const preview = getPreview(currentPlaylist.sounds[currentTrackIndex]);
    if (preview) {
      audioRef.current.src = preview;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentPlaylist, currentTrackIndex]);

  // Reacciona al estado isPlaying
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleEnded = () => {
    if (!currentPlaylist) return;
    if (currentTrackIndex < currentPlaylist.sounds.length - 1) {
      dispatch({ type: "set_track_index", payload: currentTrackIndex + 1 });
    } else {
      dispatch({ type: "set_playing", payload: false });
    }
  };

  const playNext = () => {
    if (!currentPlaylist || currentTrackIndex >= currentPlaylist.sounds.length - 1) return;
    dispatch({ type: "set_track_index", payload: currentTrackIndex + 1 });
  };

  const playPrevious = () => {
    if (!currentPlaylist || currentTrackIndex <= 0) return;
    dispatch({ type: "set_track_index", payload: currentTrackIndex - 1 });
  };

  if (!currentPlaylist) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: "var(--color-btn-primary-bg)",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      gap: "12px"
    }}>
      <button onClick={playPrevious} style={{ background: "var(--color-surface)", border: "none", fontSize: "20px", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>⏮</button>
      <audio ref={audioRef} controls onEnded={handleEnded} style={{ width: "600px" }} />
      <button onClick={playNext} style={{ background: "var(--color-surface)", border: "none", fontSize: "20px", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>⏭</button>
    </div>
  );
};