import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAirQuality } from '@/context/AirQualityContext';
import { getAQIColor } from '@/data/mockSensorData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Brain, Clock, AlertTriangle, Shield, Loader2 } from 'lucide-react';

const generateMockPrediction = (baseAqi: number, horizon: number) => {
  const points = [];
  for (let i = 0; i <= horizon; i++) {
    const hourOffset = i;
    const variation = Math.sin(i * 0.5) * 30 + Math.random() * 20 - 10;
    const rush = (i % 24 >= 7 && i % 24 <= 10) || (i % 24 >= 17 && i % 24 <= 20) ? 40 : 0;
    points.push({
      time: `+${hourOffset}h`,
      aqi: Math.max(10, Math.round(baseAqi + variation + rush)),
    });
  }
  return points;
};

const Predict = () => {
  const { stations } = useAirQuality();
  const [selectedStationId, setSelectedStationId] = useState(stations[0]?.id || '');
  const [horizon, setHorizon] = useState(24);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<ReturnType<typeof generateMockPrediction> | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const selectedStation = stations.find(s => s.id === selectedStationId);

  const handleGenerate = async () => {
    if (!selectedStation) return;
    setLoading(true);
    setPrediction(null);
    setAiInsight(null);

    // Simulate AI call delay
    await new Promise(r => setTimeout(r, 2000));

    const data = generateMockPrediction(selectedStation.aqi, horizon);
    setPrediction(data);
    setAiInsight(
      `Based on current sensor readings at ${selectedStation.name} (AQI: ${selectedStation.aqi}), ` +
      `stagnant wind conditions and localized emissions are expected to maintain elevated pollution levels. ` +
      `Peak AQI of ~${Math.max(...data.map(d => d.aqi))} predicted during morning rush hours. ` +
      `PM2.5 concentrations will remain the dominant pollutant. ` +
      `Improvement expected after midnight as traffic volume decreases and temperature inversions dissipate.`
    );
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-16 pb-12 px-4 min-h-screen grid-bg max-w-6xl mx-auto"
    >
      <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
        <Brain className="inline mr-2 text-primary" size={24} />
        AI Prediction Engine
      </h1>
      <p className="text-sm font-body text-muted-foreground mb-6">Forecast air quality using machine learning models</p>

      {/* Controls */}
      <div className="glass-card p-4 mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Station</label>
          <select
            value={selectedStationId}
            onChange={e => setSelectedStationId(e.target.value)}
            className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm font-mono text-foreground"
          >
            {stations.map(s => (
              <option key={s.id} value={s.id}>{s.name} (AQI {s.aqi})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Horizon</label>
          <div className="flex gap-1">
            {[6, 12, 24, 48].map(h => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  horizon === h ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-mono font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
          Generate Forecast
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="glass-card p-6 mb-6 relative overflow-hidden">
          <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-scan" />
          </div>
        </div>
      )}

      {/* Chart */}
      {prediction && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mb-6">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">
            Predicted AQI — {selectedStation?.name} ({horizon}h)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={prediction}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 15%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid hsl(168, 100%, 42%, 0.2)', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 11 }}
              />
              <ReferenceLine y={150} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Unhealthy', position: 'right', fill: '#f59e0b', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="#00d4aa"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#00d4aa' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* AI Insight */}
      {aiInsight && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-accent" /> Risk Assessment
            </h4>
            <p className="text-xs font-body text-muted-foreground leading-relaxed">{aiInsight}</p>
          </div>
          <div className="glass-card p-4">
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield size={14} className="text-primary" /> Recommended Actions
            </h4>
            <ul className="space-y-2 text-xs font-body text-muted-foreground">
              <li className="flex items-center gap-2">🚗 Avoid high-traffic zones during peak hours</li>
              <li className="flex items-center gap-2">😷 Wear N95 masks outdoors</li>
              <li className="flex items-center gap-2">🏃 Avoid outdoor exercise until AQI drops below 100</li>
              <li className="flex items-center gap-2">🪟 Keep windows closed, use air purifiers</li>
              <li className="flex items-center gap-2">💧 Stay hydrated, monitor symptoms</li>
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Predict;
