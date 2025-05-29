
import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, PinOff, Settings, X } from 'lucide-react';
import { WidgetConfig, WidgetType } from '@/types/widget';
import { WidgetRenderer } from './WidgetRenderer';

interface DashboardGridProps {
  widgets: WidgetConfig[];
  onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  onRemoveWidget: (id: string) => void;
  isEditMode: boolean;
}

export const DashboardGrid = ({ widgets, onUpdateWidget, onRemoveWidget, isEditMode }: DashboardGridProps) => {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, widgetId: string) => {
    if (!isEditMode) return;
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  }, [isEditMode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetWidgetId) return;

    // Swap positions logic would go here
    setDraggedWidget(null);
  }, [draggedWidget]);

  const togglePin = useCallback((widgetId: string, isPinned: boolean) => {
    onUpdateWidget(widgetId, { isPinned: !isPinned });
  }, [onUpdateWidget]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full overflow-y-auto">
      {widgets.map((widget) => (
        <Card
          key={widget.id}
          className={`
            relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 
            transition-all duration-300 shadow-xl hover:shadow-2xl h-80
            ${isEditMode ? 'cursor-move' : ''}
            ${widget.isPinned ? 'ring-2 ring-yellow-400' : ''}
          `}
          draggable={isEditMode}
          onDragStart={(e) => handleDragStart(e, widget.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, widget.id)}
        >
          {/* Widget Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm truncate">{widget.title}</h3>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePin(widget.id, widget.isPinned || false)}
                className="h-6 w-6 p-0 text-white/70 hover:text-yellow-400"
              >
                {widget.isPinned ? <Pin className="h-3 w-3" /> : <PinOff className="h-3 w-3" />}
              </Button>
              {isEditMode && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-white/70 hover:text-blue-400"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveWidget(widget.id)}
                    className="h-6 w-6 p-0 text-white/70 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Widget Content */}
          <div className="p-4 h-[calc(100%-60px)] overflow-hidden">
            <WidgetRenderer widget={widget} />
          </div>
        </Card>
      ))}
    </div>
  );
};
