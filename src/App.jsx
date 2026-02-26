import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError("City not found or API error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen px-4 bg-weather-gradient">

      <div className="w-full max-w-5xl p-8 space-y-6 border shadow-2xl rounded-3xl 
                      bg-white/10 backdrop-blur-md border-white/20">

        {/* 🌍 Header */}
        <h1 className="text-5xl font-bold text-white tracking-wide text-center">
          WeatherNow
        </h1>

        {/* 🔎 Search */}
        <div className="flex justify-center gap-3">
          <input
            type="text"
            placeholder="Enter a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
            className="px-5 py-3 w-72 rounded-xl bg-white/20 
                       text-white placeholder-white border border-white/30 
                       focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          <button
            onClick={getWeather}
            className="px-5 py-3 rounded-xl bg-white text-green-700 
                       font-semibold hover:scale-105 transition-transform"
          >
            Search
          </button>
        </div>

        {/* ⏳ Loading */}
        {loading && (
          <div className="text-white text-center text-xl animate-pulse">
            Loading weather...
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <div className="text-center bg-red-500/20 text-red-100 
                          border border-red-400 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        {/* 🌤 Weather Data */}
        {weather && !loading && (
          <div className="flex flex-col items-center space-y-6">

            {/* Main Card */}
            <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl 
                            shadow-xl text-center w-96 border border-white/20">

              <h2 className="text-2xl font-semibold text-white mb-2">
                {weather.location.name}, {weather.location.country}
              </h2>

              <div className="flex justify-center items-start">
                <span className="text-7xl font-bold text-white">
                  {Math.round(weather.current.temp_c)}
                </span>
                <span className="text-3xl text-white mt-2">°C</span>
              </div>

              <p className="capitalize text-lg text-white mt-2">
                {weather.current.condition.text}
              </p>

              <img
                src={weather.current.condition.icon}
                alt="weather icon"
                className="mx-auto mt-4"
              />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">

              <WeatherBox
                title="Feels Like"
                value={`${Math.round(weather.current.feelslike_c)}°C`}
              />

              <WeatherBox
                title="Humidity"
                value={`${weather.current.humidity}%`}
              />

              <WeatherBox
                title="Wind"
                value={`${weather.current.wind_kph} km/h`}
              />

              <WeatherBox
                title="Pressure"
                value={`${weather.current.pressure_mb} mb`}
              />

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const WeatherBox = ({ title, value }) => (
  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 
                  shadow-xl text-center border border-white/20
                  hover:scale-105 transition-transform text-white">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default App;
