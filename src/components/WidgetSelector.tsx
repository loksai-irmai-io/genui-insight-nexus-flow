
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface WidgetSelectorProps {
  selectedWidgets: string[];
  onWidgetToggle: (widgets: string[]) => void;
}

export const WidgetSelector = ({ selectedWidgets, onWidgetToggle }: WidgetSelectorProps) => {
  const widgetCategories = [
    {
      name: 'Object Interactions',
      color: 'text-blue-400',
      widgets: [
        'Object Type Interactions',
        'Object Lifecycles'
      ]
    },
    {
      name: 'Metrics & KPIs',
      color: 'text-green-400',
      widgets: [
        'Object Type Metrics',
        'Resource Summary Table'
      ]
    },
    {
      name: 'Pattern Analysis',
      color: 'text-purple-400',
      widgets: [
        'Failure Patterns by SOP Pattern (Case Count/Outlier Sum)',
        'Process Failure Patterns Distribution (Count/Outlier Sum)',
        'Cases by Resource Switch Count (All Patterns)'
      ]
    },
    {
      name: 'Performance Analysis',
      color: 'text-orange-400',
      widgets: [
        'Resource Performance (Avg Step Duration)',
        'Activities Performed by ABAKER',
        'Durations: Average vs. Individual by Pattern'
      ]
    },
    {
      name: 'Outliers & Anomalies',
      color: 'text-red-400',
      widgets: [
        'Activity Duration Outliers (Based on Timing Violations)',
        'Case Complexity Outliers (Z-Score & Event Count)',
        'Distribution of Gap Violation Severity (All Patterns)'
      ]
    },
    {
      name: 'Process Analysis',
      color: 'text-cyan-400',
      widgets: [
        'Activity Timing Summary (Based on Gaps After)',
        'Activity Pair Summary Stats',
        'Case Details for: Application Submission → Initial Assessment (Threshold: 180.54h)',
        'Distribution of Time Gaps: Application Submission → Initial Assessment',
        'Overall Incomplete Cases by Time Since Last Event',
        'Top Reworked Activities',
        'Rework Instances by Excess'
      ]
    }
  ];

  const handleWidgetToggle = (widget: string, checked: boolean) => {
    if (checked) {
      onWidgetToggle([...selectedWidgets, widget]);
    } else {
      onWidgetToggle(selectedWidgets.filter(w => w !== widget));
    }
  };

  const selectAll = () => {
    const allWidgets = widgetCategories.flatMap(cat => cat.widgets);
    onWidgetToggle(allWidgets);
  };

  const selectNone = () => {
    onWidgetToggle([]);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={selectAll}
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={selectNone}
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          Select None
        </Button>
      </div>

      {widgetCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          <h4 className={`font-semibold ${category.color}`}>{category.name}</h4>
          {category.widgets.map((widget) => (
            <div key={widget} className="flex items-start space-x-2">
              <Checkbox
                id={widget}
                checked={selectedWidgets.includes(widget)}
                onCheckedChange={(checked) => handleWidgetToggle(widget, checked as boolean)}
                className="mt-1"
              />
              <label
                htmlFor={widget}
                className="text-sm text-gray-300 leading-tight cursor-pointer"
              >
                {widget}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
