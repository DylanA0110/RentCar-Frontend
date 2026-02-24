import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'increase',
}: MetricCardProps) {
  const changeColor =
    changeType === 'increase' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-2">{label}</p>
          <p className="text-3xl font-semibold text-foreground mb-2">{value}</p>
          {change !== undefined && (
            <p className={`text-xs font-medium ${changeColor}`}>
              {changeType === 'increase' ? '+' : ''}
              {change}% desde el mes anterior
            </p>
          )}
        </div>
        <div className="p-3 bg-secondary rounded-lg">
          <Icon size={24} className="text-accent" />
        </div>
      </div>
    </div>
  );
}
