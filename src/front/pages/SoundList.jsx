import React, { useEffect, useState, useRef } from "react"
import { searchSounds } from "../services/freesound"
import "../index.css"

export const SoundList = () => {

  const [playlistsData, setPlaylistsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const audioRef = useRef(null)

  const playlists = [
    { name: "Relax", query: "relax ambient meditation calm", coverImage: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg" },
    { name: "Truenos", query: "thunder", coverImage: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" },
    { name: "Viento", query: "wind", coverImage: "https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg" },
    { name: "Mar", query: "ocean", coverImage: "https://images.pexels.com/photos/533923/pexels-photo-533923.jpeg" },
    { name: "Bosque", query: "forest", coverImage: "https://images.pexels.com/photos/15286/pexels-photo.jpg" },
    { name: "Ciudad", query: "city ambience", coverImage: "https://images.pexels.com/photos/373965/pexels-photo-373965.jpeg" }
  ]

  useEffect(() => {

    const loadPlaylists = async () => {

      try {

        const results = await Promise.all(
          playlists.map(async (pl) => {

            const sounds = await searchSounds(pl.query)

            const filtered = sounds
              .filter(
                (s) =>
                  s.previews?.["preview-lq-mp3"] ||
                  s.previews?.["preview-hq-mp3"] ||
                  s.previews?.["preview-lq-ogg"]
              )
              .slice(0, 25)

            return { ...pl, sounds: filtered }

          })
        )

        setPlaylistsData(results)

      } catch (err) {

        console.error(err)
        setError("No se pudieron cargar las playlists")

      }

      setLoading(false)

    }

    loadPlaylists()

  }, [])

  const getPreview = (sound) => {

    return (
      sound.previews?.["preview-lq-mp3"] ||
      sound.previews?.["preview-hq-mp3"] ||
      sound.previews?.["preview-lq-ogg"]
    )

  }

  const playPlaylist = (playlist) => {

    setCurrentPlaylist(playlist)
    setCurrentTrackIndex(0)
  }

  useEffect(() => {

    if (!currentPlaylist) return

    const audio = audioRef.current

    const preview = getPreview(currentPlaylist.sounds[currentTrackIndex])

    if (preview) {

      audio.src = preview
      audio.play()
    }

  }, [currentTrackIndex, currentPlaylist])

  const handleEnded = () => {

    if (!currentPlaylist) return

    if (currentTrackIndex < currentPlaylist.sounds.length - 1) {

      setCurrentTrackIndex(currentTrackIndex + 1)

    }

  }

  const playNext = () => {

    if (!currentPlaylist) return

    if (currentTrackIndex < currentPlaylist.sounds.length - 1) {

      setCurrentTrackIndex(currentTrackIndex + 1)

    }

  }

  const playPrevious = () => {

    if (!currentPlaylist) return

    if (currentTrackIndex > 0) {

      setCurrentTrackIndex(currentTrackIndex - 1)

    }

  }

  if (loading) return <p>Cargando playlists...</p>
  if (error) return <p className="text-danger">{error}</p>

  return (

    <div className="sound-playlists container mt-5">

      <h1>Sound Playlists</h1>

      <div className="row">

        {playlistsData.map((pl) => (

          <div key={pl.name} className="col-md-4 mb-4">

            <div className="playlist-card h-100 shadow-sm">

              <div className="playlist-image-container">

                <img src={pl.coverImage} alt={pl.name} />

                <button
                  className="play-button"
                  onClick={() => playPlaylist(pl)}
                >
                  ▶
                </button>

                <div className="overlay">{pl.name}</div>

              </div>

              <div className="card-body">

                <button
                  className="btn btn-primary btn-sm mt-3"
                  onClick={() => setSelectedPlaylist(pl)}
                >
                  Ver Playlist
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {selectedPlaylist && (

        <div className="playlist-modal">

          <div className="playlist-modal-content">

            <button
              className="close-modal"
              onClick={() => setSelectedPlaylist(null)}
            >
              X
            </button>

            <h2>{selectedPlaylist.name}</h2>

            {selectedPlaylist.sounds.map((sound) => {

              const previewUrl = getPreview(sound)

              if (!previewUrl) return null

              return (

                <div key={sound.id} style={{ marginBottom: "15px" }}>

                  <p>{sound.name}</p>

                  <audio controls>

                    <source src={previewUrl} />

                  </audio>

                </div>

              )

            })}

          </div>

        </div>

      )}

      {currentPlaylist && (

        <div className="global-player">

          <button
            className="player-btn"
            onClick={playPrevious}
          >
            ⏮
          </button>

          <audio
            ref={audioRef}
            controls
            onEnded={handleEnded}
          />

          <button
            className="player-btn"
            onClick={playNext}
          >
            ⏭
          </button>

        </div>

      )}

    </div>
  )
}