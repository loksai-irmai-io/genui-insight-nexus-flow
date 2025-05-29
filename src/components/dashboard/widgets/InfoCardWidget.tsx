
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface InfoCardWidgetProps {
  title: string;
  dataSource?: string;
  settings?: Record<string, any>;
  variant: 'small' | 'medium' | 'large';
}

export const InfoCardWidget = ({ title, variant, settings }: InfoCardWidgetProps) => {
  // Sample data - in real implementation, this would come from dataSource
  const data = {
    value: '1,247',
    subtitle: 'Active Users',
    change: '+12.5%',
    trend: 'up' as 'up' | 'down'
  };

  const getCardSize = () => {
    switch (variant) {
      case 'small': return 'h-24';
      case 'medium': return 'h-32';
      case 'large': return 'h-40';
      default: return 'h-32';
    }
  };

  return (
    <div className={`w-full ${getCardSize()}`}>
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <Info className="w-5 h-5 text-blue-400" />
          {data.trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
        </div>
        
        <div>
          <p className="text-2xl font-bold text-white">{data.value}</p>
          {variant !== 'small' && (
            <p className="text-sm text-white/70">{data.subtitle}</p>
          )}
          {variant === 'large' && (
            <p className={`text-xs ${data.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {data.change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
