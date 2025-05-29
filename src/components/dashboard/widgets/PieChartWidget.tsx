
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartWidgetProps {
  title: string;
  dataSource?: string;
  settings?: Record<string, any>;
}

export const PieChartWidget = ({ title, dataSource }: PieChartWidgetProps) => {
  // Sample data - in real implementation, this would come from dataSource
  const data = [
    { name: 'Positive', value: 68, count: 342 },
    { name: 'Neutral', value: 18, count: 89 },
    { name: 'Negative', value: 14, count: 69 }
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#ef4444'];

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value, name, props) => [
              `${value}% (${props.payload.count} items)`,
              name
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
