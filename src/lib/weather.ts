export interface WeatherData {
    temp: number;
    condition: string;
    location: string;
    icon: string;
  }
  
  export async function getWeatherData(): Promise<WeatherData> {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      const { latitude, longitude } = position.coords;
  
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
      );
  
      const data = await response.json();
  
      const weatherCode = data.current.weather_code;
      const condition = getWeatherCondition(weatherCode);
  
      return {
        temp: Math.round(data.current.temperature_2m),
        condition: condition.text,
        location: 'Your Location',
        icon: condition.icon,
      };
    } catch (error) {
      return {
        temp: 24,
        condition: 'Clear',
        location: 'Location',
        icon: 'sunny',
      };
    }
  }
  
  function getWeatherCondition(code: number): { text: string; icon: string } {
    if (code === 0) return { text: 'Clear', icon: 'sunny' };
    if (code <= 3) return { text: 'Partly Cloudy', icon: 'cloudy' };
    if (code <= 48) return { text: 'Foggy', icon: 'cloudy' };
    if (code <= 67) return { text: 'Rainy', icon: 'rainy' };
    if (code <= 77) return { text: 'Snowy', icon: 'snowy' };
    if (code <= 82) return { text: 'Rainy', icon: 'rainy' };
    return { text: 'Stormy', icon: 'stormy' };
  }
  
  export function getWeatherTag(condition: string): string {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return 'sunny';
    if (conditionLower.includes('rain')) return 'rainy';
    if (conditionLower.includes('cloud')) return 'cloudy';
    if (conditionLower.includes('hot')) return 'hot';
    if (conditionLower.includes('cold')) return 'cold';
    return 'cloudy';
  }
  