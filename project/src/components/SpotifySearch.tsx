import { useEffect, useState } from 'react';
import { fetchSpotifyToken, searchSpotify } from '../utils/spotify';

function SpotifySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await fetchSpotifyToken();
      const data = await searchSpotify(query, token);
      setResults(data.tracks?.items || []);
    } catch (err) {
      setError('Failed to fetch tracks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Spotify Track Search</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song, artist, etc."
          className="border p-2 w-full rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-red-600 hover:bg-black-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {results.map((track) => (
          <li
            key={track.id}
            className="border rounded p-3 shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              {track.album?.images?.[0] && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="w-16 h-16 rounded"
                />
              )}
              <div>
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm text-gray-600">
                  {track.artists.map((a: any) => a.name).join(', ')}
                </p>
                {track.preview_url && (
                  <audio controls className="mt-1">
                    <source src={track.preview_url} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpotifySearch;
