
import { WidgetConfig } from '@/types/widget';
import { InfoCardWidget } from './widgets/InfoCardWidget';
import { KpiCardWidget } from './widgets/KpiCardWidget';
import { LineChartWidget } from './widgets/LineChartWidget';
import { BarChartWidget } from './widgets/BarChartWidget';
import { PieChartWidget } from './widgets/PieChartWidget';
import { DataTableWidget } from './widgets/DataTableWidget';
import { GaugeWidget } from './widgets/GaugeWidget';

interface WidgetRendererProps {
  widget: WidgetConfig;
}

export const WidgetRenderer = ({ widget }: WidgetRendererProps) => {
  const commonProps = {
    title: widget.title,
    dataSource: widget.dataSource,
    settings: widget.settings || {}
  };

  switch (widget.type) {
    case 'InfoCardSmall':
    case 'InfoCardMedium':
    case 'InfoCardLarge':
      return <InfoCardWidget {...commonProps} variant={widget.type.replace('InfoCard', '').toLowerCase() as 'small' | 'medium' | 'large'} />;
    
    case 'KpiCard':
      return <KpiCardWidget {...commonProps} />;
    
    case 'LineChart':
      return <LineChartWidget {...commonProps} />;
    
    case 'BarChart':
      return <BarChartWidget {...commonProps} />;
    
    case 'PieChart':
      return <PieChartWidget {...commonProps} />;
    
    case 'DataTable':
      return <DataTableWidget {...commonProps} />;
    
    case 'Gauge':
      return <GaugeWidget {...commonProps} />;
    
    default:
      return (
        <div className="text-center text-white/70 py-8">
          <div className="text-4xl mb-2">🔧</div>
          <p className="text-sm">Widget type "{widget.type}" not implemented yet</p>
        </div>
      );
  }
};
