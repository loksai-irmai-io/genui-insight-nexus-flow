
import { Card } from '@/components/ui/card';
import { ObjectTypeInteractionsWidget } from '@/components/widgets/ObjectTypeInteractionsWidget';
import { ResourcePerformanceWidget } from '@/components/widgets/ResourcePerformanceWidget';
import { OutlierAnalysisWidget } from '@/components/widgets/OutlierAnalysisWidget';
import { PatternAnalysisWidget } from '@/components/widgets/PatternAnalysisWidget';
import { ActivityTimingWidget } from '@/components/widgets/ActivityTimingWidget';

interface WidgetGridProps {
  selectedWidgets: string[];
  stagingData: any;
  isLoading: boolean;
}

export const WidgetGrid = ({ selectedWidgets, stagingData, isLoading }: WidgetGridProps) => {
  if (selectedWidgets.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
        <p className="text-white/70">Select widgets from the dropdown menu to display visualizations</p>
      </div>
    );
  }

  const renderWidget = (widgetName: string) => {
    const commonProps = { stagingData, isLoading };

    switch (widgetName) {
      case 'Object Type Interactions':
        return <ObjectTypeInteractionsWidget key={widgetName} {...commonProps} />;
      case 'Resource Performance (Avg Step Duration)':
        return <ResourcePerformanceWidget key={widgetName} {...commonProps} />;
      case 'Activity Duration Outliers (Based on Timing Violations)':
      case 'Case Complexity Outliers (Z-Score & Event Count)':
        return <OutlierAnalysisWidget key={widgetName} title={widgetName} {...commonProps} />;
      case 'Failure Patterns by SOP Pattern (Case Count/Outlier Sum)':
      case 'Process Failure Patterns Distribution (Count/Outlier Sum)':
        return <PatternAnalysisWidget key={widgetName} title={widgetName} {...commonProps} />;
      case 'Activity Timing Summary (Based on Gaps After)':
      case 'Activity Pair Summary Stats':
        return <ActivityTimingWidget key={widgetName} title={widgetName} {...commonProps} />;
      default:
        return (
          <Card key={widgetName} className="bg-white/10 border-white/20 p-6">
            <h3 className="text-white font-semibold mb-4">{widgetName}</h3>
            <div className="text-center text-white/70">
              <div className="text-4xl mb-2">📊</div>
              <p>Widget implementation in progress</p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {selectedWidgets.map(renderWidget)}
    </div>
  );
};
