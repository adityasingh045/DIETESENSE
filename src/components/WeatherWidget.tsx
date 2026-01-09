import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Thermometer,
  MapPin,
} from "lucide-react";
import type { WeatherData } from "../lib/weather";

interface WeatherWidgetProps {
  weather: WeatherData;
}

type SimpleWeather = "summer" | "rainy" | "cloudy" | "cold" | "snow";

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const simpleWeather = getSimpleWeather(
    weather.condition,
    weather.temp
  );

  const iconMap = {
    summer: <Sun className="w-16 h-16 text-yellow-300" />,
    rainy: <CloudRain className="w-16 h-16 text-blue-200" />,
    cloudy: <Cloud className="w-16 h-16 text-gray-200" />,
    cold: <Thermometer className="w-16 h-16 text-cyan-200" />,
    snow: <CloudSnow className="w-16 h-16 text-white" />,
  };

  const bgMap = {
    summer: "from-yellow-400 to-orange-500",
    rainy: "from-blue-500 to-indigo-600",
    cloudy: "from-gray-500 to-gray-700",
    cold: "from-cyan-500 to-blue-600",
    snow: "from-slate-300 to-slate-500",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgMap[simpleWeather]} p-6 text-white shadow-xl`}
    >
      <div className="absolute top-0 right-0 opacity-10 scale-150">
        {iconMap[simpleWeather]}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
          <MapPin className="w-4 h-4" />
          {weather.location}
        </div>

        <div className="flex items-center gap-6">
          {iconMap[simpleWeather]}

          <div>
            <div className="text-4xl font-bold">
              {weather.temp}°C
            </div>

            <div className="text-lg font-semibold capitalize">
              {simpleWeather}
            </div>

            <div className="text-sm opacity-80">
              {weather.condition}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- HELPERS ---------- */

function getSimpleWeather(
  condition: string,
  temp: number
): SimpleWeather {
  const c = condition.toLowerCase();

  if (c.includes("snow")) return "snow";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("thunder"))
    return "rainy";
  if (c.includes("cloud") || c.includes("mist") || c.includes("fog"))
    return "cloudy";
  if (temp <= 20) return "cold";

  return "summer";
}
