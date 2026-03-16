import { SensorStation } from '@/data/mockSensorData';

// Convert PM2.5 µg/m³ to US AQI
function pm25ToAqi(pm25: number): number {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round(50 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1));
  if (pm25 <= 55.4) return Math.round(100 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5));
  if (pm25 <= 150.4) return Math.round(150 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5));
  if (pm25 <= 250.4) return Math.round(200 + ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5));
  return Math.round(300 + ((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5));
}

interface OpenAQLocation {
  id: number;
  name: string;
  coordinates: { latitude: number; longitude: number };
  parameters: { parameter: string; lastValue: number; unit: string }[];
}

export async function fetchRealStations(centerLat: number, centerLng: number): Promise<SensorStation[]> {
  const res = await fetch(
    `https://api.openaq.org/v2/locations?coordinates=${centerLat},${centerLng}&radius=50000&limit=10&order_by=lastUpdated&sort=desc`
  );
  const data = await res.json();

  if (!data.results?.length) {
    throw new Error('OpenAQ: no stations found');
  }

  const stations: SensorStation[] = data.results.map((loc: OpenAQLocation, i: number) => {
    const get = (param: string) =>
      loc.parameters.find(p => p.parameter === param)?.lastValue ?? 0;

    const pm25 = get('pm25');
    const pm10 = get('pm10');
    const no2 = get('no2');
    const co = get('co');
    const o3 = get('o3');
    const so2 = get('so2');

    return {
      id: `s${loc.id}`,
      name: loc.name,
      lat: loc.coordinates.latitude,
      lng: loc.coordinates.longitude,
      aqi: pm25ToAqi(pm25),
      pm25,
      pm10,
      no2,
      co: +(co / 1000).toFixed(2), // µg/m³ to ppm
      o3,
      so2,
      temp: 30,
      humidity: 55,
      trend: 'stable' as const,
    };
  });

  return stations;
}