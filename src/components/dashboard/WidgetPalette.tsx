
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, BarChart, LineChart, PieChart, Table, Gauge, Activity, Map, TreePine } from 'lucide-react';
import { WidgetType } from '@/types/widget';

interface WidgetPaletteProps {
  onAddWidget: (type: WidgetType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const widgetCategories = [
  {
    name: 'Information Cards',
    icon: <Activity className="w-4 h-4" />,
    widgets: [
      { type: 'InfoCardSmall' as WidgetType, name: 'Info Card (Small)', icon: '📝' },
      { type: 'InfoCardMedium' as WidgetType, name: 'Info Card (Medium)', icon: '📄' },
      { type: 'InfoCardLarge' as WidgetType, name: 'Info Card (Large)', icon: '📋' },
      { type: 'KpiCard' as WidgetType, name: 'KPI Card', icon: '📊' }
    ]
  },
  {
    name: 'Charts & Graphs',
    icon: <BarChart className="w-4 h-4" />,
    widgets: [
      { type: 'LineChart' as WidgetType, name: 'Line Chart', icon: '📈' },
      { type: 'BarChart' as WidgetType, name: 'Bar Chart', icon: '📊' },
      { type: 'StackedBarChart' as WidgetType, name: 'Stacked Bar Chart', icon: '📊' },
      { type: 'PieChart' as WidgetType, name: 'Pie Chart', icon: '🥧' },
      { type: 'DonutChart' as WidgetType, name: 'Donut Chart', icon: '🍩' },
      { type: 'TreeMap' as WidgetType, name: 'Tree Map', icon: '🌳' }
    ]
  },
  {
    name: 'Data Display',
    icon: <Table className="w-4 h-4" />,
    widgets: [
      { type: 'DataTable' as WidgetType, name: 'Data Table', icon: '📋' },
      { type: 'SortableList' as WidgetType, name: 'Sortable List', icon: '📝' },
      { type: 'FilterableList' as WidgetType, name: 'Filterable List', icon: '🔍' },
      { type: 'AccordionPanel' as WidgetType, name: 'Accordion Panel', icon: '📂' }
    ]
  },
  {
    name: 'Advanced Visualizations',
    icon: <Gauge className="w-4 h-4" />,
    widgets: [
      { type: 'Heatmap' as WidgetType, name: 'Heatmap', icon: '🔥' },
      { type: 'Gauge' as WidgetType, name: 'Gauge', icon: '⏲️' },
      { type: 'Dial' as WidgetType, name: 'Dial', icon: '🎛️' },
      { type: 'BulletChart' as WidgetType, name: 'Bullet Chart', icon: '🎯' },
      { type: 'RadialProgress' as WidgetType, name: 'Radial Progress', icon: '🔄' },
      { type: 'WordCloud' as WidgetType, name: 'Word Cloud', icon: '☁️' }
    ]
  },
  {
    name: 'Specialized',
    icon: <Map className="w-4 h-4" />,
    widgets: [
      { type: 'GeoMap' as WidgetType, name: 'Geographic Map', icon: '🗺️' },
      { type: 'ActivityTimeline' as WidgetType, name: 'Activity Timeline', icon: '⏰' }
    ]
  }
];

export const WidgetPalette = ({ onAddWidget, isOpen, onToggle }: WidgetPaletteProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Charts & Graphs']);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <Card className={`
      fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gray-900/95 backdrop-blur-sm border-r border-white/20 
      transition-transform duration-300 z-40 shadow-2xl
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `} style={{ width: '320px' }}>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Widget Palette</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white/70 hover:text-white"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {widgetCategories.map((category) => (
            <Collapsible
              key={category.name}
              open={expandedCategories.includes(category.name)}
              onOpenChange={() => toggleCategory(category.name)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10"
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                  <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${
                    expandedCategories.includes(category.name) ? 'rotate-180' : ''
                  }`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2 space-y-1">
                {category.widgets.map((widget) => (
                  <Button
                    key={widget.type}
                    variant="ghost"
                    onClick={() => onAddWidget(widget.type)}
                    className="w-full justify-start pl-8 text-sm text-white/70 hover:text-white hover:bg-white/5"
                  >
                    <span className="mr-2">{widget.icon}</span>
                    {widget.name}
                    <Plus className="ml-auto w-3 h-3" />
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
