import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_WEATHER_KEY;

  const getWeather = async (cityName?: string, lat?: number, lon?: number) => {
    try {
      let url = "";

      if (lat && lon) {
        // 🔹 Clima con geolocalización
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
      } else if (cityName) {
        // 🔹 Clima con nombre de ciudad
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`;
      }

      if (!url) return;

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

  // 📍 
  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("La geolocalización no es compatible con tu navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeather(undefined, position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError("No se pudo obtener tu ubicación");
      }
    );
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
      className="h-screen flex flex-col items-center justify-center text-white p-4 transition-all duration-700 relative"
    >
     
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 flex items-center gap-2 drop-shadow-lg">
          🌤️ Weather App
        </h1>

        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            placeholder="Escribe una ciudad..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 rounded-lg text-black"
          />
          <button
            onClick={() => getWeather(city)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg shadow-md"
          >
            Buscar
          </button>
          <button
            onClick={getLocationWeather}
            className="bg-green-400 hover:bg-green-500 text-black font-bold px-4 py-2 rounded-lg shadow-md"
          >
            📍 Mi Ubicación
          </button>
        </div>

        {error && <p className="text-red-200">{error}</p>}

        
        {weather && (
          <div className="backdrop-blur-md bg-white/20 text-white p-6 rounded-2xl shadow-2xl w-96 text-center space-y-4 border border-white/30 animate-fadeIn">
            <h2 className="text-3xl font-extrabold drop-shadow-md">{weather.name}</h2>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/30 rounded-xl p-3 shadow-md">
                🌡️ <p className="text-lg font-semibold">{weather.main.temp}°C</p>
              </div>
              <div className="bg-white/30 rounded-xl p-3 shadow-md">
                🤔 <p className="text-lg font-semibold">{weather.main.feels_like}°C</p>
              </div>
              <div className="bg-white/30 rounded-xl p-3 shadow-md">
                💧 <p className="text-lg font-semibold">{weather.main.humidity}%</p>
              </div>
              <div className="bg-white/30 rounded-xl p-3 shadow-md">
                💨 <p className="text-lg font-semibold">{weather.wind.speed} m/s</p>
              </div>
            </div>

            <p className="italic capitalize text-lg mt-3">
              ☁️ {weather.weather[0].description}
            </p>

            <div className="flex justify-between text-sm opacity-90 mt-3">
              <p>🌅 {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>🌇 {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>

            
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
              className="mx-auto mt-4 drop-shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
