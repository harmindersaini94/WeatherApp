import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000"); // Connect to backend server

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on('weatherData', (data) => {
      setWeatherData(data);
      setError(""); // Clear any previous errors
    });

    socket.on('weatherError', (err) => {
      setError(err.message);
      setWeatherData(null);
    });

    return () => {
      socket.off('weatherData');
      socket.off('weatherError');
    };
  }, []);

  const fetchWeather = () => {
    if (location) {
      socket.emit('fetchWeather', location);
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default App;
