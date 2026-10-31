import { WeatherData } from '../types/tv';

// Coordenadas geográficas de Novo Hamburgo, Rio Grande do Sul, Brasil
const NOVO_HAMBURGO_LAT = -29.6786;
const NOVO_HAMBURGO_LON = -51.1306;

function interpretWmoCode(code: number): string {
  switch (code) {
    case 0:
      return 'Céu Limpo';
    case 1:
      return 'Predominantemente Claro';
    case 2:
      return 'Parcialmente Nublado';
    case 3:
      return 'Nublado';
    case 45:
    case 48:
      return 'Nevoeiro';
    case 51:
    case 53:
    case 55:
      return 'Garoa';
    case 61:
      return 'Chuva Leve';
    case 63:
      return 'Chuva Moderada';
    case 65:
      return 'Chuva Forte';
    case 80:
    case 81:
    case 82:
      return 'Pancadas de Chuva';
    case 95:
    case 96:
    case 99:
      return 'Trovoada';
    default:
      return 'Tempo Agradável';
  }
}

export async function fetchNovoHamburgoWeather(): Promise<WeatherData> {
  const fallbackData: WeatherData = {
    city: 'Novo Hamburgo',
    state: 'RS',
    temperature: 22,
    weatherCode: 1,
    conditionText: 'Parcialmente Ensolarado',
    humidity: 68,
    windSpeed: 11,
    tempMax: 26,
    tempMin: 17,
    isLive: false,
    lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${NOVO_HAMBURGO_LAT}&longitude=${NOVO_HAMBURGO_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      return fallbackData;
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    const weatherCode = current?.weather_code ?? 1;
    const condition = interpretWmoCode(weatherCode);

    return {
      city: 'Novo Hamburgo',
      state: 'RS',
      temperature: Math.round(current?.temperature_2m ?? 22),
      weatherCode,
      conditionText: condition,
      humidity: Math.round(current?.relative_humidity_2m ?? 65),
      windSpeed: Math.round(current?.wind_speed_10m ?? 12),
      tempMax: Math.round(daily?.temperature_2m_max?.[0] ?? 25),
      tempMin: Math.round(daily?.temperature_2m_min?.[0] ?? 16),
      isLive: true,
      lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.warn('Usando dados meteorológicos locais para Novo Hamburgo, RS:', err);
    return fallbackData;
  }
}
