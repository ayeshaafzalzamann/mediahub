import express from 'express';
import axios from 'axios';
import qs from 'qs';
import cors from 'cors';

const app = express();
app.use(cors());

const client_id = '25fa69f5b0cb4dd4bdc5ad52b7a9eb0e';
const client_secret = '0d12edc792cc4f1eb615ed2427c51d55';

// Endpoint to get Spotify token
app.get('/spotify-token', async (req, res) => {
  try {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({ grant_type: 'client_credentials' });

    const response = await axios.post(tokenUrl, data, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Spotify token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
