import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WidgetPalette } from '@/components/dashboard/WidgetPalette';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { FixedChatbot } from '@/components/dashboard/FixedChatbot';
import { UserProfile } from '@/components/UserProfile';
import { WidgetConfig, WidgetType } from '@/types/widget';
import { Menu, Settings, Save, Edit, Eye, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sopData, setSopData] = useState<any>(null);

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

  const fetchSopData = async () => {
    try {
      toast.info('Fetching SOP deviation data...');
      
      // Try to fetch from local APIs with timeout
      const fetchWithTimeout = (url: string, timeout = 5000) => {
        return Promise.race([
          fetch(url),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      const [countResponse, patternsResponse] = await Promise.allSettled([
        fetchWithTimeout('http://127.0.0.1:8001/sopdeviation/low-percentage/count'),
        fetchWithTimeout('http://127.0.0.1:8001/sopdeviation/patterns')
      ]);

      let countData, patternsData;

      // Handle count data
      if (countResponse.status === 'fulfilled' && countResponse.value.ok) {
        countData = await countResponse.value.json();
      } else {
        console.warn('Count API unavailable, using mock data');
        countData = { count: 42, percentage: 15.3, threshold: 'low' };
      }

      // Handle patterns data
      if (patternsResponse.status === 'fulfilled' && patternsResponse.value.ok) {
        patternsData = await patternsResponse.value.json();
      } else {
        console.warn('Patterns API unavailable, using mock data');
        patternsData = {
          patterns: [
            { pattern: 'Late Start', frequency: 23, severity: 'medium' },
            { pattern: 'Skipped Step', frequency: 15, severity: 'high' },
            { pattern: 'Wrong Sequence', frequency: 8, severity: 'low' },
            { pattern: 'Resource Missing', frequency: 12, severity: 'high' }
          ]
        };
      }
      
      const combinedData = { count: countData, patterns: patternsData };
      setSopData(combinedData);
      
      // Add SOP deviation widgets
      const sopWidgets: WidgetConfig[] = [
        {
          id: `sop-count-${Date.now()}`,
          type: 'KpiCard',
          title: 'SOP Deviation Count',
          position: { x: 0, y: 0 },
          size: { width: 300, height: 200 },
          dataSource: 'sopCount'
        },
        {
          id: `sop-patterns-${Date.now()}`,
          type: 'BarChart',
          title: 'SOP Deviation Patterns',
          position: { x: 1, y: 0 },
          size: { width: 600, height: 300 },
          dataSource: 'sopPatterns'
        }
      ];
      
      setWidgets(prev => [...prev, ...sopWidgets]);
      toast.success('SOP deviation data loaded and visualized!');
    } catch (error) {
      console.error('Error fetching SOP data:', error);
      toast.error('Local SOP APIs are unavailable. Using demo data for visualization.');
      
      // Use demo data when APIs are not available
      const demoData = {
        count: { count: 42, percentage: 15.3, threshold: 'low' },
        patterns: {
          patterns: [
            { pattern: 'Late Start', frequency: 23, severity: 'medium' },
            { pattern: 'Skipped Step', frequency: 15, severity: 'high' },
            { pattern: 'Wrong Sequence', frequency: 8, severity: 'low' },
            { pattern: 'Resource Missing', frequency: 12, severity: 'high' }
          ]
        }
      };
      
      setSopData(demoData);
      
      const sopWidgets: WidgetConfig[] = [
        {
          id: `sop-count-${Date.now()}`,
          type: 'KpiCard',
          title: 'SOP Deviation Count (Demo)',
          position: { x: 0, y: 0 },
          size: { width: 300, height: 200 },
          dataSource: 'sopCount'
        },
        {
          id: `sop-patterns-${Date.now()}`,
          type: 'BarChart',
          title: 'SOP Deviation Patterns (Demo)',
          position: { x: 1, y: 0 },
          size: { width: 600, height: 300 },
          dataSource: 'sopPatterns'
        }
      ];
      
      setWidgets(prev => [...prev, ...sopWidgets]);
    }
  };

  const handleWidgetCommand = (command: string, data: any) => {
    console.log('Widget command:', command, data);
    
    switch (command) {
      case 'add_widget':
        handleAddWidget(data.widget as WidgetType);
        break;
      case 'change_widget':
        const changeableWidget = widgets.find(w => !w.isPinned);
        if (changeableWidget) {
          handleUpdateWidget(changeableWidget.id, { type: data.to });
        }
        break;
      case 'remove_widget':
        const removableWidget = widgets.find(w => !w.isPinned);
        if (removableWidget) {
          handleRemoveWidget(removableWidget.id);
        }
        break;
      case 'fetch_sop_data':
        fetchSopData();
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const saveDashboard = () => {
    localStorage.setItem('dashboard-layout', JSON.stringify(widgets));
    toast.success('Dashboard saved!');
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
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
              <span className="text-white/80 text-sm">Welcome, {getUserDisplayName()}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
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
                onClick={handleLogout}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* User Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20">
            <UserProfile onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )}

      {/* Main Content with new layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left side - 3/4 width for widgets */}
        <main className={`flex-1 transition-all duration-300 ${isPaletteOpen ? 'ml-80' : 'ml-0'} pr-4`}>
          <div className="h-full pb-32"> {/* Bottom padding for chatbot */}
            <DashboardGrid
              widgets={widgets}
              onUpdateWidget={handleUpdateWidget}
              onRemoveWidget={handleRemoveWidget}
              isEditMode={isEditMode}
            />
          </div>
        </main>
      </div>

      {/* Widget Palette */}
      <WidgetPalette
        onAddWidget={handleAddWidget}
        isOpen={isPaletteOpen}
        onToggle={() => setIsPaletteOpen(!isPaletteOpen)}
      />

      {/* Fixed Chatbot - Bottom left, 3/4 width */}
      <div className="fixed bottom-6 left-6 right-1/4 z-40">
        <FixedChatbot onWidgetCommand={handleWidgetCommand} sopData={sopData} />
      </div>
    </div>
  );
};

export default Dashboard;
