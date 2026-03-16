import React, { createContext, useContext, useState, useEffect } from 'react';
import { SensorStation, initialStations } from '@/data/mockSensorData';
import { fetchRealStations } from '@/services/aqiService';

interface AirQualityContextType {
  stations: SensorStation[];
  selectedStation: SensorStation | null;
  setSelectedStation: (s: SensorStation | null) => void;
  cityName: string;
  cityAQI: number;
  coords: [number, number];
  alerts: { id: string; message: string; stationName: string; aqi: number }[];
  dismissAlert: (id: string) => void;
  lastUpdated: Date;
  locationStatus: 'idle' | 'loading' | 'granted' | 'denied';
  dataLoading: boolean;
}

const AirQualityContext = createContext<AirQualityContextType | null>(null);

export const useAirQuality = () => {
  const ctx = useContext(AirQualityContext);
  if (!ctx) throw new Error('useAirQuality must be within AirQualityProvider');
  return ctx;
};

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      'Current Location'
    );
  } catch {
    return 'Current Location';
  }
}

export const AirQualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<SensorStation[]>(initialStations);
  const [selectedStation, setSelectedStation] = useState<SensorStation | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [alerts, setAlerts] = useState<{ id: string; message: string; stationName: string; aqi: number }[]>([]);
  const [cityName, setCityName] = useState('Detecting location...');
  const [coords, setCoords] = useState<[number, number]>([28.6139, 77.2090]);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const fetchWithIpFallback = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          return { lat: data.latitude, lon: data.longitude, city: data.city || 'Current Location' };
        }
      } catch (e) {
        console.error('IP Geolocation fallback failed', e);
      }
      return null;
    };

    const handleSuccess = async (latitude: number, longitude: number, nameFallback?: string) => {
      setLocationStatus('granted');
      setCoords([latitude, longitude]);

      const name = nameFallback || await reverseGeocode(latitude, longitude);
      setCityName(name);

      setDataLoading(true);
      try {
        const realStations = await fetchRealStations(latitude, longitude);
        setStations(prev => realStations.map(s => {
          const old = prev.find(p => p.id === s.id);
          return {
            ...s,
            trend: old ? (s.aqi > old.aqi ? 'up' : s.aqi < old.aqi ? 'down' : 'stable') : 'stable',
          };
        }));
        setLastUpdated(new Date());
      } catch (e) {
        console.error('Failed to fetch real AQI data:', e);
      } finally {
        setDataLoading(false);
      }
    };

    const handleError = async () => {
      const ipData = await fetchWithIpFallback();
      if (ipData) {
        handleSuccess(ipData.lat, ipData.lon, ipData.city);
      } else {
        setCityName('Current Location');
        setLocationStatus('denied');
      }
    };

    setLocationStatus('loading');

    if (!navigator.geolocation) {
      handleError();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => handleSuccess(pos.coords.latitude, pos.coords.longitude),
      handleError,
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (locationStatus !== 'granted') return;
    const interval = setInterval(async () => {
      try {
        const realStations = await fetchRealStations(coords[0], coords[1]);
        setStations(prev => realStations.map(s => {
          const old = prev.find(p => p.id === s.id);
          return {
            ...s,
            trend: old ? (s.aqi > old.aqi ? 'up' : s.aqi < old.aqi ? 'down' : 'stable') : 'stable',
          };
        }));
        setLastUpdated(new Date());
      } catch (e) {
        console.error('Refresh failed:', e);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [locationStatus, coords]);

  useEffect(() => {
    const newAlerts = stations
      .filter(s => s.aqi > 150)
      .map(s => ({ id: s.id, message: `${s.name}: AQI ${s.aqi}`, stationName: s.name, aqi: s.aqi }));
    setAlerts(newAlerts);
  }, [stations]);

  const dismissAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  const cityAQI = stations.length
    ? Math.round(stations.reduce((sum, s) => sum + s.aqi, 0) / stations.length)
    : 0;

  return (
    <AirQualityContext.Provider value={{
      stations, selectedStation, setSelectedStation,
      cityName, cityAQI, coords, alerts, dismissAlert,
      lastUpdated, locationStatus, dataLoading,
    }}>
      {children}
    </AirQualityContext.Provider>
  );
};