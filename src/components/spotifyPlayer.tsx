// components/SpotifyPlayer.tsx
const SpotifyPlayer = () => {
  return (
    <div
      style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
    >
      <iframe
        style={{ borderRadius: '12px' }}
        src="https://open.spotify.com/embed/playlist/4FSHMpz18dKJuCIVJj3i06?utm_source=generator"
        width="30%"
        height="100"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify playlist player"
      ></iframe>
    </div>
  )
}

export default SpotifyPlayer
