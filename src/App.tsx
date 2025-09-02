import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");

  const API_KEY =  process.env.REACT_APP_WEATHER_KEY;
; 

  const getWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!res.ok) throw new Error("Ciudad no encontrada");

      const data = await res.json();
      setWeather(data);
      setError("");
    } catch (err: any) {
      setWeather(null);
      setError(err.message);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-blue-400 to-indigo-600 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-6">🌤️ Weather App</h1>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Escribe una ciudad..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 rounded-lg text-black"
        />
        <button
          onClick={getWeather}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-200">{error}</p>}

      {weather && (
        <div className="bg-white text-black p-6 rounded-xl shadow-lg w-80 text-center">
          <h2 className="text-2xl font-bold mb-2">{weather.name}</h2>
          <p className="text-lg">🌡️ {weather.main.temp}°C</p>
          <p className="text-lg">💧 Humedad: {weather.main.humidity}%</p>
          <p className="italic">☁️ {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
