import React, { useEffect, useState } from "react";
import { searchSounds } from "./freesound";
import { useNavigate } from "react-router-dom";
import "./freesound.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const SoundList = () => {
  const [playlistsData, setPlaylistsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const playlists = [
    { name: "Relax", query: "relax ambient meditation calm", coverImage: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg" },
    { name: "Truenos", query: "thunder", coverImage: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" },
    { name: "Viento", query: "wind", coverImage: "https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg" },
    { name: "Mar", query: "ocean", coverImage: "https://images.pexels.com/photos/533923/pexels-photo-533923.jpeg" },
    { name: "Bosque", query: "forest", coverImage: "https://images.pexels.com/photos/15286/pexels-photo.jpg" },
    { name: "Ciudad", query: "city ambience", coverImage: "https://images.pexels.com/photos/373965/pexels-photo-373965.jpeg" }
  ];

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const results = await Promise.all(
          playlists.map(async (pl) => {
            const sounds = await searchSounds(pl.query);
            const filtered = sounds
              .filter(s => s.previews?.["preview-lq-mp3"] || s.previews?.["preview-hq-mp3"] || s.previews?.["preview-lq-ogg"])
              .slice(0, 25);
            return { ...pl, sounds: filtered };
          })
        );
        setPlaylistsData(results);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las playlists");
      }
      setLoading(false);
    };
    loadPlaylists();
  }, []);

  const getPreview = (sound) => {
    return sound.previews?.["preview-lq-mp3"] || sound.previews?.["preview-hq-mp3"] || sound.previews?.["preview-lq-ogg"];
  };

  const openModal = (pl) => {
    setSelectedPlaylist(pl);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedPlaylist(null), 350);
  };

  const handlePlayInPlace = (pl) => {
    dispatch({ type: "set_playlist", payload: pl });
    dispatch({ type: "set_playing", payload: false });
  };

  const handleSelect = (pl) => {
    dispatch({ type: "set_playlist", payload: pl });
    dispatch({ type: "set_playing", payload: false });
    navigate("/home");
  };

  if (loading) return <p>Cargando playlists...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <button
        onClick={() => navigate("/home")}
        style={{
          margin: "1rem 0 0 1rem",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1.5px solid var(--color-divider)",
          background: "transparent",
          color: "var(--color-text-primary)",
          cursor: "pointer",
          fontSize: "0.9rem"
        }}
      >
        ← Back to home
      </button>

      <div className="sound-playlists container mt-5">
        <h1>Sound Playlists</h1>

        <div className="row">
          {playlistsData.map((pl) => (
            <div key={pl.name} className="col-md-4 mb-4">
              <div className="playlist-card h-100 shadow-sm">
                <div className="playlist-image-container">
                  <img src={pl.coverImage} alt={pl.name} />
                  <button className="play-button" onClick={() => handlePlayInPlace(pl)}>▶</button>
                  <div className="overlay">{pl.name}</div>
                </div>
                <div className="card-body">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openModal(pl)}
                  >
                    Ver
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleSelect(pl)}
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPlaylist && (
          <div
            className={`sound-modal-overlay ${modalVisible ? "visible" : ""}`}
            onClick={closeModal}
          >
            <div
              className={`modal-playlist ${modalVisible ? "visible" : ""}`}
              onClick={e => e.stopPropagation()}
            >
              <button className="close-modal" onClick={closeModal}>✕</button>
              <h2>{selectedPlaylist.name}</h2>
              <div className="modal-sounds">
                {selectedPlaylist.sounds.map((sound, index) => {
                  const previewUrl = getPreview(sound);
                  if (!previewUrl) return null;
                  return (
                    <div
                      key={sound.id}
                      className="modal-sound-item"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <p>{sound.name}</p>
                      <audio controls>
                        <source src={previewUrl} />
                      </audio>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};