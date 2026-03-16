import { useMemo } from 'react';

interface PollutantCardProps {
  label: string;
  value: number;
  unit: string;
  max: number;
  icon: string;
}

const PollutantCard = ({ label, value, unit, max, icon }: PollutantCardProps) => {
  const percentage = useMemo(() => Math.min((value / max) * 100, 100), [value, max]);

  const color = useMemo(() => {
    if (percentage < 25) return 'hsl(var(--cyan))';
    if (percentage < 50) return 'hsl(var(--yellow-aqi))';
    if (percentage < 75) return 'hsl(var(--orange-aqi))';
    return 'hsl(var(--danger))';
  }, [percentage]);

  const r = 28;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="glass-card p-3 flex items-center gap-3">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 32 32)"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
        <p className="text-lg font-mono font-semibold" style={{ color }}>{value}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{unit}</p>
      </div>
    </div>
  );
};

export default PollutantCard;
