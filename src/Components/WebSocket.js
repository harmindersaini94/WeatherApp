import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Enable CORS for frontend communication
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

const weatherApiKey = 'YOUR_WEATHER_API_KEY';
const weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather';

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('fetchWeather', (location) => {
    axios.get(`${weatherApiUrl}?q=${location}&appid=${weatherApiKey}`)
      .then(response => {
        socket.emit('weatherData', response.data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        socket.emit('weatherError', { message: 'Unable to fetch weather data' });
      });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
