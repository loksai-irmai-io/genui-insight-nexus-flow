
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeWidgetProps {
  title: string;
  dataSource?: string;
  settings?: Record<string, any>;
}

export const GaugeWidget = ({ title, dataSource }: GaugeWidgetProps) => {
  // Sample data - in real implementation, this would come from dataSource
  const value = 75; // percentage
  const data = [
    { name: 'Filled', value: value },
    { name: 'Empty', value: 100 - value }
  ];

  const COLORS = ['#22c55e', 'rgba(255,255,255,0.1)'];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={35}
              outerRadius={50}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{value}%</p>
            <p className="text-xs text-white/70">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};
