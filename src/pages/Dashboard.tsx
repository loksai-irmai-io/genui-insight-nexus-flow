
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WidgetPalette } from '@/components/dashboard/WidgetPalette';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { FixedChatbot } from '@/components/dashboard/FixedChatbot';
import { WidgetConfig, WidgetType } from '@/types/widget';
import { Menu, Settings, Save, Undo, Edit, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Initialize with default widgets
  useEffect(() => {
    const defaultWidgets: WidgetConfig[] = [
      {
        id: '1',
        type: 'KpiCard',
        title: 'Revenue Overview',
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
        dataSource: 'kpiData',
        isPinned: true
      },
      {
        id: '2',
        type: 'LineChart',
        title: 'Sales Trend',
        position: { x: 1, y: 0 },
        size: { width: 600, height: 300 },
        dataSource: 'salesData'
      },
      {
        id: '3',
        type: 'BarChart',
        title: 'Monthly Performance',
        position: { x: 0, y: 1 },
        size: { width: 400, height: 300 },
        dataSource: 'salesData'
      },
      {
        id: '4',
        type: 'PieChart',
        title: 'Customer Sentiment',
        position: { x: 2, y: 0 },
        size: { width: 350, height: 300 },
        dataSource: 'sentimentData'
      }
    ];
    setWidgets(defaultWidgets);
  }, []);

  const handleAddWidget = (type: WidgetType) => {
    const newWidget: WidgetConfig = {
      id: Date.now().toString(),
      type,
      title: `New ${type.replace(/([A-Z])/g, ' $1').trim()}`,
      position: { x: 0, y: 0 },
      size: { width: 300, height: 200 },
      dataSource: getDefaultDataSource(type)
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const getDefaultDataSource = (type: WidgetType): string => {
    switch (type) {
      case 'KpiCard': return 'kpiData';
      case 'LineChart':
      case 'BarChart':
      case 'StackedBarChart': return 'salesData';
      case 'PieChart':
      case 'DonutChart': return 'sentimentData';
      case 'Heatmap': return 'heatmapData';
      case 'GeoMap': return 'geographicData';
      case 'ActivityTimeline': return 'timelineData';
      default: return 'salesData';
    }
  };

  const handleUpdateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ));
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  const handleWidgetCommand = (command: string, data: any) => {
    console.log('Widget command:', command, data);
    
    switch (command) {
      case 'add_widget':
        handleAddWidget(data.widget as WidgetType);
        break;
      case 'change_widget':
        // Find first widget that can be changed and update its type
        const changeableWidget = widgets.find(w => !w.isPinned);
        if (changeableWidget) {
          handleUpdateWidget(changeableWidget.id, { type: data.to });
        }
        break;
      case 'remove_widget':
        // Remove first non-pinned widget
        const removableWidget = widgets.find(w => !w.isPinned);
        if (removableWidget) {
          handleRemoveWidget(removableWidget.id);
        }
        break;
    }
  };

  const saveDashboard = () => {
    // In a real app, this would save to the database
    localStorage.setItem('dashboard-layout', JSON.stringify(widgets));
    console.log('Dashboard saved!');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                className="text-white hover:bg-white/10"
              >
                <Menu className="w-4 h-4 mr-2" />
                Widgets
              </Button>
              <h1 className="text-2xl font-bold text-white">Gen-UI Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
                className={`border-white/30 text-white hover:bg-white/10 ${
                  isEditMode ? 'bg-white/20' : ''
                }`}
              >
                {isEditMode ? <Eye className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditMode ? 'Preview' : 'Edit'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={saveDashboard}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isPaletteOpen ? 'ml-80' : 'ml-0'}`}>
        <DashboardGrid
          widgets={widgets}
          onUpdateWidget={handleUpdateWidget}
          onRemoveWidget={handleRemoveWidget}
          isEditMode={isEditMode}
        />
      </main>

      {/* Widget Palette */}
      <WidgetPalette
        onAddWidget={handleAddWidget}
        isOpen={isPaletteOpen}
        onToggle={() => setIsPaletteOpen(!isPaletteOpen)}
      />

      {/* Fixed Chatbot */}
      <FixedChatbot onWidgetCommand={handleWidgetCommand} />
    </div>
  );
};

export default Dashboard;
