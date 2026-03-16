import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAirQuality } from '@/context/AirQualityContext';
import { weeklyTrendData, hourlyAQIData, sourceAttribution } from '@/data/mockSensorData';
import { BarChart3 } from 'lucide-react';

const scatterData = Array.from({ length: 30 }, () => ({
  traffic: Math.floor(Math.random() * 100),
  aqi: Math.floor(Math.random() * 250 + 50),
}));

const tooltipStyle = {
  contentStyle: {
    background: '#0f172a',
    border: '1px solid rgba(0,212,170,0.2)',
    borderRadius: 8,
    fontFamily: 'IBM Plex Mono',
    fontSize: 11,
    color: '#e2e8f0',
  },
};

const Analytics = () => {
  const { stations } = useAirQuality();
  const [selectedStationId, setSelectedStationId] = useState('all');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-16 pb-12 px-4 min-h-screen grid-bg max-w-6xl mx-auto"
    >
      <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
        <BarChart3 className="inline mr-2 text-primary" size={24} />
        Trends & Insights
      </h1>
      <p className="text-sm font-body text-muted-foreground mb-6">Historical analysis and pollution correlations</p>

      <div className="mb-6">
        <select
          value={selectedStationId}
          onChange={e => setSelectedStationId(e.target.value)}
          className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm font-mono text-foreground"
        >
          <option value="all">All Stations (Average)</option>
          {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Weekly Trend */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">7-Day AQI Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 15%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="aqi" stroke="#00d4aa" strokeWidth={2} dot={{ fill: '#00d4aa', r: 3 }} />
              <Line type="monotone" dataKey="pm25" stroke="#fbbf24" strokeWidth={1.5} dot={{ fill: '#fbbf24', r: 2 }} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hourly */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Average AQI by Hour</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyAQIData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 15%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 8, fontFamily: 'IBM Plex Mono', fill: '#64748b' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="aqi" radius={[2, 2, 0, 0]}>
                {hourlyAQIData.map((entry, i) => (
                  <Cell key={i} fill={entry.aqi > 150 ? '#f59e0b' : '#00d4aa'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Scatter */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">AQI vs Traffic Density</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 15%)" />
              <XAxis dataKey="traffic" name="Traffic %" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }} />
              <YAxis dataKey="aqi" name="AQI" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }} />
              <Tooltip {...tooltipStyle} />
              <Scatter data={scatterData} fill="#00d4aa" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Pollutant Source Attribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sourceAttribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {sourceAttribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
