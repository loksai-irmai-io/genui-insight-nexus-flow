
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WidgetProps {
  title: string;
  stagingData: any;
  isLoading: boolean;
}

export const ActivityTimingWidget = ({ title, stagingData, isLoading }: WidgetProps) => {
  const data = [
    { activity: 'Submit', avgTime: 2.5, maxTime: 4.2, minTime: 1.1 },
    { activity: 'Review', avgTime: 8.3, maxTime: 15.7, minTime: 4.2 },
    { activity: 'Assess', avgTime: 12.8, maxTime: 24.5, minTime: 6.3 },
    { activity: 'Approve', avgTime: 3.2, maxTime: 8.1, minTime: 1.8 },
    { activity: 'Archive', avgTime: 1.5, maxTime: 3.2, minTime: 0.8 }
  ];

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
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="activity" 
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
            <Area 
              type="monotone" 
              dataKey="maxTime" 
              stackId="1" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.3}
            />
            <Area 
              type="monotone" 
              dataKey="avgTime" 
              stackId="2" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
