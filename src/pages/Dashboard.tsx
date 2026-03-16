import { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAirQuality } from '@/context/AirQualityContext';
import { getAQIColor, getAQICategory, healthAdvisory, pollutantInfo } from '@/data/mockSensorData';
import AQIGauge from '@/components/AQIGauge';
import PollutantCard from '@/components/PollutantCard';
import { motion } from 'framer-motion';
import { Clock, LocateFixed } from 'lucide-react';

const createMarkerIcon = (aqi: number) => {
  const color = getAQIColor(aqi);
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.3;animation:pulse 2s infinite;"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color}88;"></div>
      </div>
      <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.8);opacity:0}}</style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createUserIcon = () => L.divIcon({
  className: 'user-marker',
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;opacity:0.25;animation:pulse 2s infinite;"></div>
      <div style="position:absolute;inset:3px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 0 10px #3b82f688;"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const MapMarkers = () => {
  const map = useMap();
  const { stations, setSelectedStation } = useAirQuality();
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    stations.forEach(station => {
      const marker = L.marker([station.lat, station.lng], { icon: createMarkerIcon(station.aqi) })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;background:#0f172a;color:#e2e8f0;padding:8px;border-radius:8px;min-width:160px;">
            <strong style="font-family:Syne,sans-serif;font-size:13px;">${station.name}</strong><br/>
            <span style="color:${getAQIColor(station.aqi)};font-size:18px;font-weight:600;">AQI ${station.aqi}</span><br/>
            <span style="color:#94a3b8;">PM2.5: ${station.pm25} µg/m³</span><br/>
            <span style="color:#94a3b8;">${station.temp}°C | ${station.humidity}% RH</span>
          </div>
        `, { className: 'dark-popup' })
        .on('click', () => setSelectedStation(station));

      markersRef.current.push(marker);
    });

    return () => { markersRef.current.forEach(m => m.remove()); };
  }, [stations, map, setSelectedStation]);

  return null;
};

const MapFlyTo = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 11, { duration: 1.5 });
  }, [coords, map]);
  return null;
};

// Blue dot marker for user's live location
const UserLocationMarker = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker(coords, { icon: createUserIcon(), zIndexOffset: 1000 })
      .addTo(map)
      .bindTooltip('You are here', { permanent: false, direction: 'top' });
    return () => { markerRef.current?.remove(); };
  }, [coords, map]);

  return null;
};

// Button inside map that flies back to user location
const LocateMeButton = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  const handleClick = useCallback(() => {
    map.flyTo(coords, 13, { duration: 1.2 });
  }, [map, coords]);

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <div className="leaflet-control">
        <button
          onClick={handleClick}
          title="Go to my location"
          style={{
            width: '36px',
            height: '36px',
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#3b82f6',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1e293b')}
          onMouseLeave={e => (e.currentTarget.style.background = '#0f172a')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#3b82f688" stroke="none"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { cityAQI, cityName, stations, lastUpdated, coords } = useAirQuality();
  const category = getAQICategory(cityAQI);
  const advisory = healthAdvisory[category.label] || '';

  const avgStation = stations.length ? {
    pm25: Math.round(stations.reduce((s, st) => s + st.pm25, 0) / stations.length),
    pm10: Math.round(stations.reduce((s, st) => s + st.pm10, 0) / stations.length),
    no2: Math.round(stations.reduce((s, st) => s + st.no2, 0) / stations.length),
    co: +(stations.reduce((s, st) => s + st.co, 0) / stations.length).toFixed(1),
    o3: Math.round(stations.reduce((s, st) => s + st.o3, 0) / stations.length),
    so2: Math.round(stations.reduce((s, st) => s + st.so2, 0) / stations.length),
  } : { pm25: 0, pm10: 0, no2: 0, co: 0, o3: 0, so2: 0 };

  const secondsAgo = Math.round((Date.now() - lastUpdated.getTime()) / 1000);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-12 pb-8 min-h-screen grid-bg"
    >
      <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
        {/* Left Sidebar */}
        <div className="w-full lg:w-72 p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="glass-card p-4 text-center">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">{cityName}</p>
            <AQIGauge value={cityAQI} size={200} />
            <div className="mt-2">
              <span
                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
                style={{ backgroundColor: category.color + '22', color: category.color, border: `1px solid ${category.color}44` }}
              >
                {category.label}
              </span>
            </div>
          </div>

          <div className="glass-card p-3">
            <h4 className="font-heading text-xs font-semibold text-foreground mb-2">Health Advisory</h4>
            <p className="text-[11px] font-body text-muted-foreground leading-relaxed">{advisory}</p>
          </div>

          <div className="glass-card p-3 flex items-center gap-2">
            <Clock size={12} className="text-primary" />
            <span className="text-[10px] font-mono text-muted-foreground">Updated {secondsAgo}s ago</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative min-h-[400px]">
          <MapContainer
            center={coords}
            zoom={11}
            className="h-full w-full"
            style={{ background: '#0a0e14' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <MapFlyTo coords={coords} />
            <MapMarkers />
            <UserLocationMarker coords={coords} />
            <LocateMeButton coords={coords} />
          </MapContainer>
        </div>

        {/* Right Panel - Pollutants */}
        <div className="w-full lg:w-64 p-4 flex flex-col gap-2 flex-shrink-0 overflow-y-auto">
          <h3 className="font-heading text-xs font-semibold text-foreground uppercase tracking-widest mb-1">Pollutants (Avg)</h3>
          {pollutantInfo.map(p => (
            <PollutantCard
              key={p.key}
              label={p.label}
              value={avgStation[p.key]}
              unit={p.unit}
              max={p.max}
              icon={p.icon}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;