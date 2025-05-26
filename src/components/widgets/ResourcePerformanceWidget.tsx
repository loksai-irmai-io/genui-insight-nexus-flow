
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WidgetProps {
  stagingData: any;
  isLoading: boolean;
}

export const ResourcePerformanceWidget = ({ stagingData, isLoading }: WidgetProps) => {
  const data = stagingData?.performanceMetrics || [
    { resource: 'ABAKER', avgDuration: 2.5, completedTasks: 145 },
    { resource: 'CSMITH', avgDuration: 3.1, completedTasks: 132 },
    { resource: 'MJONES', avgDuration: 2.8, completedTasks: 98 },
    { resource: 'DWILSON', avgDuration: 3.5, completedTasks: 87 },
    { resource: 'RJOHNSON', avgDuration: 2.9, completedTasks: 76 }
  ];

  if (isLoading) {
    return (
      <Card className="bg-white/10 border-white/20 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-white/20 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 border-white/20 p-6">
      <h3 className="text-white font-semibold mb-4">Resource Performance (Avg Step Duration)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="resource" 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' } }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="avgDuration" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
