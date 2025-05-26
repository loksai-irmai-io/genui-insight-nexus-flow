
import { Card } from '@/components/ui/card';
import { ObjectTypeInteractionsWidget } from '@/components/widgets/ObjectTypeInteractionsWidget';
import { ResourcePerformanceWidget } from '@/components/widgets/ResourcePerformanceWidget';
import { OutlierAnalysisWidget } from '@/components/widgets/OutlierAnalysisWidget';
import { PatternAnalysisWidget } from '@/components/widgets/PatternAnalysisWidget';
import { ActivityTimingWidget } from '@/components/widgets/ActivityTimingWidget';
import { Sparkles } from 'lucide-react';

interface WidgetGridProps {
  selectedWidgets: string[];
  stagingData: any;
  isLoading: boolean;
}

export const WidgetGrid = ({ selectedWidgets, stagingData, isLoading }: WidgetGridProps) => {
  if (selectedWidgets.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center shadow-xl animate-fade-in">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white text-xl font-semibold">Ready to Visualize</h3>
          <p className="text-white/70 max-w-md mx-auto">
            Select widgets from the dropdown menu above to display your data visualizations. 
            Each widget provides unique insights into your process data.
          </p>
        </div>
      </div>
    );
  }

  const renderWidget = (widgetName: string, index: number) => {
    const commonProps = { stagingData, isLoading };
    const animationDelay = index * 100;

    switch (widgetName) {
      case 'Object Type Interactions':
        return (
          <div key={widgetName} className="animate-fade-in" style={{ animationDelay: `${animationDelay}ms` }}>
            <ObjectTypeInteractionsWidget {...commonProps} />
          </div>
        );
      case 'Resource Performance (Avg Step Duration)':
        return (
          <div key={widgetName} className="animate-fade-in" style={{ animationDelay: `${animationDelay}ms` }}>
            <ResourcePerformanceWidget {...commonProps} />
          </div>
        );
      case 'Activity Duration Outliers (Based on Timing Violations)':
      case 'Case Complexity Outliers (Z-Score & Event Count)':
        return (
          <div key={widgetName} className="animate-fade-in" style={{ animationDelay: `${animationDelay}ms` }}>
            <OutlierAnalysisWidget title={widgetName} {...commonProps} />
          </div>
        );
      case 'Failure Patterns by SOP Pattern (Case Count/Outlier Sum)':
      case 'Process Failure Patterns Distribution (Count/Outlier Sum)':
        return (
          <div key={widgetName} className="animate-fade-in" style={{ animationDelay: `${animationDelay}ms` }}>
            <PatternAnalysisWidget title={widgetName} {...commonProps} />
          </div>
        );
      case 'Activity Timing Summary (Based on Gaps After)':
      case 'Activity Pair Summary Stats':
        return (
          <div key={widgetName} className="animate-fade-in" style={{ animationDelay: `${animationDelay}ms` }}>
            <ActivityTimingWidget title={widgetName} {...commonProps} />
          </div>
        );
      default:
        return (
          <Card 
            key={widgetName} 
            className="bg-white/10 border-white/20 p-6 hover:bg-white/15 transition-all duration-300 animate-fade-in shadow-xl hover:shadow-2xl"
            style={{ animationDelay: `${animationDelay}ms` }}
          >
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
              {widgetName}
            </h3>
            <div className="text-center text-white/70 space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto">
                <div className="text-3xl">📊</div>
              </div>
              <p className="text-sm">Widget implementation in progress</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedWidgets.map((widget, index) => renderWidget(widget, index))}
      </div>
      
      {selectedWidgets.length > 0 && (
        <div className="text-center text-white/60 text-sm animate-fade-in">
          Showing {selectedWidgets.length} widget{selectedWidgets.length !== 1 ? 's' : ''} • Data refreshes automatically
        </div>
      )}
    </div>
  );
};
