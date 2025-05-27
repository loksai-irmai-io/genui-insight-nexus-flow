
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useEffect, useState } from 'react';

interface WidgetSelectorProps {
  selectedWidgets: string[];
  onWidgetToggle: (widgets: string[]) => void;
  selectedModule?: string;
}

export const WidgetSelector = ({ selectedWidgets, onWidgetToggle, selectedModule }: WidgetSelectorProps) => {
  const { user } = useAuth();
  const { preferences, saveWidgetPreference, removeWidgetPreference } = useUserPreferences();
  const [localSelectedWidgets, setLocalSelectedWidgets] = useState<string[]>(selectedWidgets);

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

  // Load user preferences when component mounts or user changes
  useEffect(() => {
    if (user && preferences.length > 0 && selectedModule) {
      const userWidgets = preferences
        .filter(pref => pref.selected_module === selectedModule)
        .map(pref => pref.widget_name);
      setLocalSelectedWidgets(userWidgets);
      onWidgetToggle(userWidgets);
    }
  }, [user, preferences, selectedModule]);

  const handleWidgetToggle = async (widget: string, checked: boolean) => {
    const newSelection = checked 
      ? [...localSelectedWidgets, widget]
      : localSelectedWidgets.filter(w => w !== widget);
    
    setLocalSelectedWidgets(newSelection);
    onWidgetToggle(newSelection);

    // Save to database if user is authenticated
    if (user && selectedModule) {
      if (checked) {
        await saveWidgetPreference(widget, selectedModule);
      } else {
        await removeWidgetPreference(widget, selectedModule);
      }
    }
  };

  const selectAll = async () => {
    const allWidgets = widgetCategories.flatMap(cat => cat.widgets);
    setLocalSelectedWidgets(allWidgets);
    onWidgetToggle(allWidgets);

    // Save all to database if user is authenticated
    if (user && selectedModule) {
      for (const widget of allWidgets) {
        await saveWidgetPreference(widget, selectedModule);
      }
    }
  };

  const selectNone = async () => {
    setLocalSelectedWidgets([]);
    onWidgetToggle([]);

    // Remove all from database if user is authenticated
    if (user && selectedModule) {
      for (const widget of localSelectedWidgets) {
        await removeWidgetPreference(widget, selectedModule);
      }
    }
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

      {!user && (
        <div className="text-yellow-400 text-xs p-2 bg-yellow-400/10 rounded">
          Sign in to save your widget preferences
        </div>
      )}

      {widgetCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          <h4 className={`font-semibold ${category.color}`}>{category.name}</h4>
          {category.widgets.map((widget) => (
            <div key={widget} className="flex items-start space-x-2">
              <Checkbox
                id={widget}
                checked={localSelectedWidgets.includes(widget)}
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
