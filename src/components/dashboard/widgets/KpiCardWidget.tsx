
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardWidgetProps {
  title: string;
  dataSource?: string;
  settings?: Record<string, any>;
}

export const KpiCardWidget = ({ title, dataSource }: KpiCardWidgetProps) => {
  // Sample data - in real implementation, this would come from dataSource
  const kpiData = {
    value: '$32,200',
    change: '+12.5%',
    trend: 'up' as 'up' | 'down',
    subtitle: 'vs last month'
  };

  return (
    <div className="w-full h-full">
      <div className="bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-lg p-6 h-full flex flex-col justify-center">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-bold text-white">{kpiData.value}</span>
            {kpiData.trend === 'up' ? (
              <TrendingUp className="w-6 h-6 text-green-400" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-400" />
            )}
          </div>
          
          <div className="space-y-1">
            <p className={`text-sm font-medium ${
              kpiData.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {kpiData.change}
            </p>
            <p className="text-xs text-white/70">{kpiData.subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
