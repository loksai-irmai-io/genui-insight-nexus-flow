
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface WidgetProps {
  title: string;
  stagingData: any;
  isLoading: boolean;
}

export const PatternAnalysisWidget = ({ title, stagingData, isLoading }: WidgetProps) => {
  const data = [
    { name: 'Pattern A', value: 35, count: 142 },
    { name: 'Pattern B', value: 28, count: 98 },
    { name: 'Pattern C', value: 20, count: 76 },
    { name: 'Pattern D', value: 12, count: 45 },
    { name: 'Others', value: 5, count: 18 }
  ];

  const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  if (isLoading) {
    return (
      <Card className="bg-white/10 border-white/20 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-white/20 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 border-white/20 p-6">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
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
                `${value}% (${props.payload.count} cases)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
