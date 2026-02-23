import axios from "axios";
import { useEffect, useState } from "react";
import {
  Droplet,
  GlassWater,
  Sun,
  Wind,
  CloudRain,
  Search,
} from "lucide-react";

const popularCities = [
  "London", "Paris", "Berlin", "Rome", "Madrid",
  "Barcelona", "Milan", "Munich", "Hamburg", "Lyon",
  "Vienna", "Amsterdam", "Prague", "Budapest", "Warsaw",
  "Zurich", "Geneva", "Brussels", "Copenhagen", "Stockholm",
  "Oslo", "Helsinki", "Dublin", "Lisbon", "Athens",
  "Nice", "Venice", "Florence", "Krakow", "Seville",
  "Porto", "Edinburgh", "Manchester", "Marseille", "Chernivtsi",
  "Frankfurt", "Naples", "Valencia", "Split", "Kyiv"
];

const App = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 0) {
      const matches = popularCities
        .filter((c) =>
          c.toLowerCase().startsWith(value.toLowerCase())
        )
        .slice(0, 8);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const getWeatherData = async (cityName = city) => {
    const selectedCity = popularCities.find(
      (c) => c.toLowerCase() === cityName.toLowerCase()
    );

    if (!selectedCity) {
      alert("Please select a valid city from suggestions.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedCity}&aqi=no`
      );

      setWeatherData(response.data);
      setCity("");
      setSuggestions([]);

    } catch (error) {
      console.error("Weather API error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    getWeatherData(suggestion);
  };

  const getWeatherIcon = (conditionText) => {
    if (conditionText.includes("sun") || conditionText.includes("clear"))
      return <Sun size={80} strokeWidth={1.5} />;
    if (conditionText.includes("rain"))
      return <CloudRain size={80} strokeWidth={1.5} />;
    if (conditionText.includes("cloud"))
      return <CloudRain size={80} strokeWidth={1.5} />;
    if (conditionText.includes("snow"))
      return <CloudRain className="rotate-45" size={80} strokeWidth={1.5} />;
    if (conditionText.includes("mist") || conditionText.includes("fog"))
      return <Wind size={80} strokeWidth={1.5} />;

    return <Sun size={80} strokeWidth={1.5} />;
  };

  useEffect(() => {
    getWeatherData("London");
  }, []);

  return (
    <div className="relative flex justify-center items-center px-4 min-h-screen bg-weather-gradient">
      <div className="max-w-5xl w-full shadow-2xl p-8 bg-weather-gradient backdrop-blur-sm rounded-2xl space-y-6 border border-white/20">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <h1 className="font-bold text-4xl text-white tracking-wide">
            WeatherNow
          </h1>

          <div className="w-full md:w-auto relative">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Enter a city"
                value={city}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") getWeatherData();
                }}
                className="px-4 py-2 w-full bg-white/20 placeholder-white text-white border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button
                className="p-3 cursor-pointer"
                onClick={() => getWeatherData()}
              >
                <Search size={28} className="text-white" />
              </button>
            </div>

            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white text-black mt-2 rounded-xl overflow-hidden shadow-md max-h-48 overflow-y-auto">
                {suggestions.map((s) => (
                  <li
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-white text-center text-xl animate-pulse">
            Loading weather...
          </div>
        )}

        {/* Weather Display */}
        {weatherData && !loading && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center bg-weather-gradient backdrop-blur-sm rounded-xl p-6 shadow-xl space-y-4 md:space-y-0">

              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-start justify-center md:justify-start space-x-2">
                  <h2 className="text-7xl md:text-8xl text-white font-bold">
                    {Math.round(weatherData.current.temp_c)}
                  </h2>
                  <span className="text-3xl md:text-5xl text-white">°C</span>
                </div>

                <h3 className="text-white text-xl md:text-2xl font-medium">
                  {weatherData.location.name}, {weatherData.location.country}
                </h3>

                <h4 className="text-white text-lg md:text-xl capitalize">
                  {weatherData.current.condition.text}
                </h4>
              </div>

              <div className="text-white">
                {getWeatherIcon(
                  weatherData.current.condition.text.toLowerCase()
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <WeatherBox
                icon={<Droplet size={32} />}
                title="Humidity"
                value={`${weatherData.current.humidity}%`}
              />
              <WeatherBox
                icon={<GlassWater size={32} />}
                title="Pressure"
                value={`${weatherData.current.pressure_mb} mb`}
              />
              <WeatherBox
                icon={<Wind size={32} />}
                title="Wind Speed"
                value={`${weatherData.current.wind_kph} km/h`}
              />
              <WeatherBox
                icon={<Sun size={32} />}
                title="Feels Like"
                value={`${Math.round(weatherData.current.feelslike_c)} °C`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WeatherBox = ({ icon, title, value }) => (
  <div className="backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center space-y-2 border border-white/20 hover:scale-105 transition-transform">
    <div className="text-white">{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default App;
