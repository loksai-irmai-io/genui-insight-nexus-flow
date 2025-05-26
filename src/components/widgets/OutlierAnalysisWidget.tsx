
import { Card } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WidgetProps {
  title: string;
  stagingData: any;
  isLoading: boolean;
}

export const OutlierAnalysisWidget = ({ title, stagingData, isLoading }: WidgetProps) => {
  const data = stagingData?.outlierData || [
    { caseId: 'C001', duration: 180.54, threshold: 120, severity: 'High', x: 1, y: 180.54 },
    { caseId: 'C002', duration: 95.2, threshold: 120, severity: 'Normal', x: 2, y: 95.2 },
    { caseId: 'C003', duration: 245.8, threshold: 120, severity: 'Critical', x: 3, y: 245.8 },
    { caseId: 'C004', duration: 134.7, threshold: 120, severity: 'Medium', x: 4, y: 134.7 },
    { caseId: 'C005', duration: 89.3, threshold: 120, severity: 'Normal', x: 5, y: 89.3 },
    { caseId: 'C006', duration: 203.1, threshold: 120, severity: 'High', x: 6, y: 203.1 }
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
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number"
              dataKey="x"
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
              name="Case"
            />
            <YAxis 
              type="number"
              dataKey="y"
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
              name="Duration (hours)"
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white'
              }}
              formatter={(value, name, props) => [
                `${value}h`,
                `Case: ${props.payload.caseId}`,
                `Severity: ${props.payload.severity}`
              ]}
            />
            <Scatter 
              dataKey="y" 
              fill="#f59e0b"
              r={6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
