
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WidgetProps {
  stagingData: any;
  isLoading: boolean;
}

export const ObjectTypeInteractionsWidget = ({ stagingData, isLoading }: WidgetProps) => {
  const data = stagingData?.objectTypeInteractions || [
    { type: 'Application', count: 1250, interactions: 3420 },
    { type: 'Assessment', count: 890, interactions: 2100 },
    { type: 'Review', count: 650, interactions: 1800 },
    { type: 'Approval', count: 420, interactions: 980 },
    { type: 'Archive', count: 280, interactions: 560 }
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
      <h3 className="text-white font-semibold mb-4">Object Type Interactions</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="type" 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Bar dataKey="interactions" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
