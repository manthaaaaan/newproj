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

async function getAreaName(lat: number, lon: number, fallback: string): Promise<string> {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await res.json();
    return data.locality || data.city || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchRealStations(centerLat: number, centerLng: number): Promise<SensorStation[]> {
  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${centerLat}&longitude=${centerLng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&domains=cams_global`
  );
  const data = await res.json();

  const pm25 = data.current.pm2_5 ?? 0;
  const pm10 = data.current.pm10 ?? 0;
  const no2 = data.current.nitrogen_dioxide ?? 0;
  const co = data.current.carbon_monoxide ?? 0;
  const o3 = data.current.ozone ?? 0;
  const so2 = data.current.sulphur_dioxide ?? 0;

  const stations: SensorStation[] = [];
  
  // Create center station
  stations.push({
    id: `s-center`,
    name: "Current Location",
    lat: centerLat,
    lng: centerLng,
    aqi: pm25ToAqi(pm25),
    pm25,
    pm10,
    no2,
    co: +(co / 1000).toFixed(2),
    o3,
    so2,
    temp: 30,
    humidity: 55,
    trend: 'stable' as const,
  });

  // Generate 4 artificial stations within ~5km radius (approx 0.045 degrees)
  // to simulate a closer cluster of station markers
  const offsets = [
    { lat: 0.022, lng: 0.022, name: "North-East Station" },
    { lat: -0.022, lng: 0.03, name: "South-East Station" },
    { lat: 0.015, lng: -0.025, name: "North-West Station" },
    { lat: -0.03, lng: -0.015, name: "South-West Station" },
  ];

  const simStations = await Promise.all(
    offsets.map(async (offset, i) => {
      // Add slight random variance to the pollutants (±15%)
      const variance = () => 0.85 + Math.random() * 0.3;
      const vPm25 = Math.round(pm25 * variance());
      
      const targetLat = centerLat + offset.lat;
      const targetLng = centerLng + offset.lng;
      const areaName = await getAreaName(targetLat, targetLng, offset.name);
      
      return {
        id: `s-sim-${i}`,
        name: areaName,
        lat: targetLat,
        lng: targetLng,
        aqi: pm25ToAqi(vPm25),
        pm25: vPm25,
        pm10: Math.round(pm10 * variance()),
        no2: Math.round(no2 * variance()),
        co: +((co * variance()) / 1000).toFixed(2),
        o3: Math.round(o3 * variance()),
        so2: Math.round(so2 * variance()),
        temp: 29 + Math.round(Math.random() * 2),
        humidity: 50 + Math.round(Math.random() * 10),
        trend: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down',
      };
    })
  );

  stations.push(...simStations);

  return stations;
}