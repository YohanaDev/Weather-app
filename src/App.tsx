import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_WEATHER_KEY;

  const getWeather = async (cityName?: string) => {
    try {
      if (!cityName) return;

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`;

      const res = await fetch(url);

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
    <div
      style={{
        backgroundImage: weather
          ? weather.main.temp < 10
            ? "url('/backgrounds/cold.jfif')"
            : weather.main.temp < 25
            ? "url('/backgrounds/warm.jfif')"
            : "url('/backgrounds/hot.jfif')"
          : "linear-gradient(to right, #60a5fa, #4f46e5)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen flex flex-col items-center justify-center text-white p-4 transition-all duration-700 relative"
    >
     
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          🌤️ Weather App
        </h1>

        <div className="flex flex-col md:flex-row w-full justify-center items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Escribe una ciudad..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-3 rounded-lg text-black w-full md:w-auto flex-1"
          />
          <button
            onClick={() => getWeather(city)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg w-full md:w-auto"
          >
            Buscar
          </button>
        </div>

        {error && <p className="text-red-300 text-center">{error}</p>}

        {weather && (
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-sm text-center space-y-3">
            <h2 className="text-2xl font-bold">{weather.name}</h2>
            <p className="text-lg">🌡️ {weather.main.temp}°C</p>
            <p className="text-lg">🤔 Sensación: {weather.main.feels_like}°C</p>
            <p className="text-lg">💧 Humedad: {weather.main.humidity}%</p>
            <p className="text-lg">💨 Viento: {weather.wind.speed} m/s</p>
            <p className="italic capitalize">☁️ {weather.weather[0].description}</p>

            <div className="flex justify-between text-xs sm:text-sm mt-4">
              <p>🌅 {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>🌇 {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>

            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
