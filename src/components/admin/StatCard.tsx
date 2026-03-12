import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: 'amber' | 'emerald' | 'blue' | 'violet' | 'rose' | 'zinc';
}

const colorMap = {
  amber: 'bg-amber-500/10 text-amber-500',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  blue: 'bg-blue-500/10 text-blue-500',
  violet: 'bg-violet-500/10 text-violet-500',
  rose: 'bg-rose-500/10 text-rose-500',
  zinc: 'bg-zinc-800 text-zinc-400',
};

export default function StatCard({ label, value, icon: Icon, trend, color = 'amber' }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend.value > 0 ? 'text-emerald-400' : trend.value < 0 ? 'text-red-400' : 'text-zinc-500'
          }`}>
            {trend.value > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : trend.value < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
    </div>
  );
}
