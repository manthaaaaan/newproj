import { motion } from 'framer-motion';
import { useAirQuality } from '@/context/AirQualityContext';
import { getAQICategory, getAQIColor, alertHistory } from '@/data/mockSensorData';
import { Heart, Baby, PersonStanding, Dumbbell, Users, Wind, Download, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const populationSegments = [
  { id: 'children', label: 'Children', icon: '👶', color: '#fbbf24' },
  { id: 'elderly', label: 'Elderly', icon: '🧓', color: '#f59e0b' },
  { id: 'athletes', label: 'Athletes', icon: '🏃', color: '#00d4aa' },
  { id: 'general', label: 'General Public', icon: '🧑', color: '#64748b' },
  { id: 'asthma', label: 'Asthma Patients', icon: '🫁', color: '#ef4444' },
];

const getRiskLevel = (aqi: number, segment: string) => {
  const multiplier = segment === 'children' || segment === 'asthma' || segment === 'elderly' ? 1.5 : 1;
  const adjusted = aqi * multiplier;
  if (adjusted < 50) return { level: 'Low', color: '#00d4aa' };
  if (adjusted < 100) return { level: 'Moderate', color: '#fbbf24' };
  if (adjusted < 200) return { level: 'High', color: '#f59e0b' };
  return { level: 'Critical', color: '#ef4444' };
};

const getActions = (level: string) => {
  if (level === 'Low') return ['Normal outdoor activities', 'No precautions needed'];
  if (level === 'Moderate') return ['Limit prolonged outdoor exertion', 'Monitor air quality updates'];
  if (level === 'High') return ['Stay indoors when possible', 'Use N95 masks outside', 'Run air purifiers'];
  return ['Avoid all outdoor activities', 'Seal windows', 'Use air purifiers on max', 'Seek medical help if symptomatic'];
};

const Advisory = () => {
  const { cityAQI, stations } = useAirQuality();

  const peakStation = [...stations].sort((a, b) => b.aqi - a.aqi)[0];
  const lowestStation = [...stations].sort((a, b) => a.aqi - b.aqi)[0];

  const handleDownload = () => {
    const report = `AeroSense - Air Quality Report\nDate: ${new Date().toLocaleDateString()}\nCity AQI: ${cityAQI}\nCategory: ${getAQICategory(cityAQI).label}\n\nPeak: ${peakStation.name} (AQI ${peakStation.aqi})\nLowest: ${lowestStation.name} (AQI ${lowestStation.aqi})\nDominant Pollutant: PM2.5\n\nRecent Alerts:\n${alertHistory.slice(0, 5).map(a => `${a.timestamp} | ${a.zone} | AQI ${a.peakAqi} | ${a.duration}`).join('\n')}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'aerosense-report.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-16 pb-12 px-4 min-h-screen grid-bg max-w-6xl mx-auto"
    >
      <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
        <Heart className="inline mr-2 text-primary" size={24} />
        Public Health Advisory
      </h1>
      <p className="text-sm font-body text-muted-foreground mb-6">Population-specific risk assessment and recommendations</p>

      {/* Population Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
        {populationSegments.map((seg, i) => {
          const risk = getRiskLevel(cityAQI, seg.id);
          const actions = getActions(risk.level);
          return (
            <motion.div
              key={seg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <div className="text-2xl mb-2">{seg.icon}</div>
              <h4 className="font-heading text-sm font-semibold text-foreground mb-1">{seg.label}</h4>
              <span
                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold mb-3"
                style={{ backgroundColor: risk.color + '22', color: risk.color, border: `1px solid ${risk.color}44` }}
              >
                {risk.level}
              </span>
              <ul className="space-y-1">
                {actions.map((a, j) => (
                  <li key={j} className="text-[10px] font-body text-muted-foreground">• {a}</li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* City Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Peak AQI</p>
          <p className="text-xl font-mono font-bold" style={{ color: getAQIColor(peakStation.aqi) }}>{peakStation.aqi}</p>
          <p className="text-[10px] font-mono text-muted-foreground">{peakStation.name}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Lowest AQI</p>
          <p className="text-xl font-mono font-bold" style={{ color: getAQIColor(lowestStation.aqi) }}>{lowestStation.aqi}</p>
          <p className="text-[10px] font-mono text-muted-foreground">{lowestStation.name}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Dominant</p>
          <p className="text-xl font-mono font-bold text-foreground">PM2.5</p>
          <p className="text-[10px] font-mono text-muted-foreground">Fine particles</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">vs Yesterday</p>
          <p className="text-xl font-mono font-bold text-accent flex items-center justify-center gap-1">
            <TrendingUp size={16} /> +8%
          </p>
          <p className="text-[10px] font-mono text-muted-foreground">Worsening</p>
        </div>
      </div>

      {/* Alert History */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock size={14} className="text-muted-foreground" /> Alert History
          </h3>
          <button onClick={handleDownload} className="flex items-center gap-1 text-xs font-mono text-primary hover:text-primary/80 transition-colors">
            <Download size={12} /> Download Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 px-2">Timestamp</th>
                <th className="text-left py-2 px-2">Zone</th>
                <th className="text-right py-2 px-2">Peak AQI</th>
                <th className="text-right py-2 px-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {alertHistory.map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-2 px-2 text-muted-foreground">{a.timestamp}</td>
                  <td className="py-2 px-2 text-foreground">{a.zone}</td>
                  <td className="py-2 px-2 text-right font-semibold" style={{ color: getAQIColor(a.peakAqi) }}>{a.peakAqi}</td>
                  <td className="py-2 px-2 text-right text-muted-foreground">{a.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Advisory;
