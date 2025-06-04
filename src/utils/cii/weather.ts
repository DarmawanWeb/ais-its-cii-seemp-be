import axios from 'axios';

export interface ICurrentWeather {
  time: string;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

export async function getWeatherByLocation(
  latitude: number,
  longitude: number,
): Promise<ICurrentWeather | string> {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&wind_speed_unit=kn&current_weather=true`,
    );
    const weather: ICurrentWeather = response.data.current_weather;
    return weather;
  } catch (error: unknown) {
    throw new Error(`Error when fetch open mateo api with message ${error}`);
  }
}
