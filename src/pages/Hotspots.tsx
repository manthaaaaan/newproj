import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAirQuality } from '@/context/AirQualityContext';
import { getAQIColor, getAQICategory } from '@/data/mockSensorData';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';

const HeatmapLayer = ({ stations }: { stations: any[] }) => {
  const map = useMap();

  useEffect(() => {
    // Simple circle-based heatmap (no external plugin needed)
    const circles: L.Circle[] = [];
    stations.forEach(s => {
      const color = getAQIColor(s.aqi);
      const radius = 800 + (s.aqi / 500) * 2000;
      const circle = L.circle([s.lat, s.lng], {
        radius,
        color: 'transparent',
        fillColor: color,
        fillOpacity: 0.25 + (s.aqi / 500) * 0.3,
      }).addTo(map);
      circles.push(circle);
    });
    return () => { circles.forEach(c => c.remove()); };
  }, [stations, map]);

  return null;
};

const Hotspots = () => {
  const { stations } = useAirQuality();
  const [layer, setLayer] = useState<'pm25' | 'no2'>('pm25');
  const [timeSlider, setTimeSlider] = useState(23);

  const sortedStations = [...stations].sort((a, b) => b.aqi - a.aqi).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-12 pb-8 min-h-screen grid-bg"
    >
      <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
        {/* Sidebar */}
        <div className="w-full lg:w-72 p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="glass-card p-4">
            <h3 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Flame size={14} className="text-accent" /> Top Polluted Zones
            </h3>
            <div className="space-y-2">
              {sortedStations.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: getAQIColor(s.aqi) + '33', color: getAQIColor(s.aqi) }}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-muted-foreground truncate">{s.name}</span>
                  <span className="font-semibold" style={{ color: getAQIColor(s.aqi) }}>{s.aqi}</span>
                  {s.trend === 'up' ? <TrendingUp size={12} className="text-danger" /> : <TrendingDown size={12} className="text-cyan" />}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h4 className="font-heading text-xs font-semibold text-foreground mb-2">Layer</h4>
            <div className="flex gap-2">
              {(['pm25', 'no2'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLayer(l)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    layer === l ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {l === 'pm25' ? 'PM2.5' : 'NO₂'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative min-h-[400px]">
          <MapContainer
            center={[28.6139, 77.2090]}
            zoom={11}
            className="h-full w-full"
            style={{ background: '#0a0e14' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            <HeatmapLayer stations={stations} />
          </MapContainer>

          {/* Time slider */}
          <div className="absolute bottom-4 left-4 right-4 glass-card p-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-muted-foreground">00:00</span>
              <input
                type="range" min="0" max="23" value={timeSlider}
                onChange={e => setTimeSlider(+e.target.value)}
                className="flex-1 accent-primary h-1"
              />
              <span className="text-[10px] font-mono text-muted-foreground">23:00</span>
              <span className="text-xs font-mono text-primary">{timeSlider.toString().padStart(2, '0')}:00</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hotspots;
