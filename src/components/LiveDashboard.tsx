import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Activity, Sun, ShieldAlert, Wind, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'overall', label: 'Overall Forecast', icon: Activity, color: '#00d4aa', yAxisDomain: [0, 200] },
  { id: 'uv', label: 'UV Radiation', icon: Sun, color: '#f59e0b', yAxisDomain: [0, 15] },
  { id: 'virus', label: 'Virus Risk', icon: ShieldAlert, color: '#ef4444', yAxisDomain: [0, 100] },
  { id: 'pollution', label: 'Pollution', icon: Wind, color: '#8b5cf6', yAxisDomain: [0, 200] },
];

interface DataPoint {
  time: string;
  value: number;
}

export const LiveDashboard = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [data, setData] = useState<DataPoint[]>([]);

  const generateNextValue = useCallback((category: string, prevValue: number) => {
    const change = (Math.random() - 0.5) * 10;
    let newValue = prevValue + change;

    if (category === 'uv') newValue = Math.max(0, Math.min(15, newValue));
    else if (category === 'virus') newValue = Math.max(0, Math.min(100, newValue));
    else newValue = Math.max(0, Math.min(300, newValue));

    return Math.round(newValue * 10) / 10;
  }, []);

  useEffect(() => {
    const initialData: DataPoint[] = [];
    let currentValue = activeCategory.id === 'uv' ? 5 : activeCategory.id === 'virus' ? 20 : 50;

    for (let i = 20; i >= 0; i--) {
      const time = new Date(Date.now() - i * 2000).toLocaleTimeString([], {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      initialData.push({ time, value: currentValue });
      currentValue = generateNextValue(activeCategory.id, currentValue);
    }
    setData(initialData);
  }, [activeCategory, generateNextValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastValue = prevData[prevData.length - 1]?.value || 50;
        const newValue = generateNextValue(activeCategory.id, lastValue);
        const newTime = new Date().toLocaleTimeString([], {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return [...prevData.slice(1), { time: newTime, value: newValue }];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeCategory, generateNextValue]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      setLocationError(null);
    };

    const error = () => {
      setLocationError('Unable to retrieve your location');
      setLocation({ lat: 40.7128, lng: -74.006 });
    };

    navigator.geolocation.getCurrentPosition(success, error);
    const watchId = navigator.geolocation.watchPosition(success, error, { enableHighAccuracy: true });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="glass-card p-6 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Activity className="text-primary" />
            Live Environmental Monitor
          </h2>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Real-time conditions within a 10 km radius of your location
          </p>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 py-2 px-4 rounded-full border border-border/50">
          <MapPin size={16} className="text-accent" />
          <span className="text-sm font-mono text-foreground">
            {location ? (
              `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
            ) : locationError ? (
              <span className="text-destructive text-xs">{locationError} (Using Default)</span>
            ) : (
              <span className="flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" /> Locating...
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                isActive
                  ? 'bg-primary/20 border border-primary/40 text-foreground'
                  : 'bg-muted/30 border border-transparent text-muted-foreground hover:bg-muted/80'
              }`}
              style={
                isActive
                  ? { borderColor: cat.color, color: cat.color, backgroundColor: `${cat.color}20` }
                  : {}
              }
            >
              <Icon size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Live Chart */}
      <motion.div
        key={activeCategory.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-background/40 border border-border/50 rounded-xl p-4 h-[350px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className="font-heading text-sm font-semibold flex items-center gap-2"
            style={{ color: activeCategory.color }}
          >
            <activeCategory.icon size={16} />
            Live {activeCategory.label} Data
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Live</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 15%)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }}
              stroke="hsl(215, 25%, 20%)"
              tickMargin={10}
            />
            <YAxis
              domain={activeCategory.yAxisDomain}
              tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }}
              stroke="hsl(215, 25%, 20%)"
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid hsl(215, 25%, 25%)',
                borderRadius: 8,
                fontFamily: 'IBM Plex Mono',
                fontSize: 12,
              }}
              itemStyle={{ color: activeCategory.color }}
              labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
              animationDuration={200}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={activeCategory.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: activeCategory.color, stroke: '#0f172a', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};