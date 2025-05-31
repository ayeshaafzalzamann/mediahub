// src/utils/spotify.ts

// Fetch the access token from your backend
export async function fetchSpotifyToken(): Promise<string> {
  const res = await fetch('http://localhost:5000/spotify-token');
  const data = await res.json();

  if (!data.access_token) {
    throw new Error('Failed to retrieve Spotify token');
  }

  return data.access_token;
}

// Search Spotify for tracks using the token
export async function searchSpotify(query: string, token: string) {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Spotify search results');
  }

  return await res.json();
}