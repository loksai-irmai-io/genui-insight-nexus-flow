
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';
import { UserVault } from '@/components/UserVault';
import { WidgetGrid } from '@/components/WidgetGrid';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles, User, BarChart3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WidgetSelector } from '@/components/WidgetSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { UserProfile } from '@/components/UserProfile';

const Index = () => {
  const { user, loading } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [stagingData, setStagingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Mock staging data - replace with your API call
  useEffect(() => {
    const fetchStagingData = async () => {
      try {
        // For now using mock data, replace with: const response = await fetch('http://localhost:5000/staging-data');
        const mockData = {
          objectTypeInteractions: [
            { type: 'Application', count: 1250, interactions: 3420 },
            { type: 'Assessment', count: 890, interactions: 2100 },
            { type: 'Review', count: 650, interactions: 1800 }
          ],
          performanceMetrics: [
            { resource: 'ABAKER', avgDuration: 2.5, completedTasks: 145 },
            { resource: 'CSMITH', avgDuration: 3.1, completedTasks: 132 },
            { resource: 'MJONES', avgDuration: 2.8, completedTasks: 98 }
          ],
          outlierData: [
            { caseId: 'C001', duration: 180.54, threshold: 120, severity: 'High' },
            { caseId: 'C002', duration: 95.2, threshold: 120, severity: 'Normal' },
            { caseId: 'C003', duration: 245.8, threshold: 120, severity: 'Critical' }
          ]
        };
        setStagingData(mockData);
      } catch (error) {
        console.error('Error fetching staging data:', error);
      }
    };

    fetchStagingData();
  }, []);

  // Load user's saved widgets when module is selected, or default widgets for new users
  useEffect(() => {
    if (selectedModule) {
      if (user && preferences.length > 0) {
        const moduleWidgets = preferences
          .filter(pref => pref.selected_module === selectedModule)
          .map(pref => pref.widget_name);
        setSelectedWidgets(moduleWidgets);
      } else {
        // Default widgets for better first-time experience
        setSelectedWidgets(['Weather', 'News', 'AI Chat']);
      }
    }
  }, [user, selectedModule, preferences]);

  const handleModuleSelect = (moduleName: string) => {
    setSelectedModule(moduleName);
    if (!user) {
      setSelectedWidgets(['Weather', 'News', 'AI Chat']);
    }
  };

  const handleBackToVault = () => {
    setSelectedModule(null);
    setSelectedWidgets([]);
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Show user profile modal
  if (showProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <UserProfile onClose={() => setShowProfile(false)} />
        </div>
      </div>
    );
  }

  // Get user's display name (prefer full_name, fallback to email)
  const getUserDisplayName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    // Extract name from email if no full name
    return user.email?.split('@')[0] || 'User';
  };

  // Frame 1: Welcome screen with User's Vault
  if (!selectedModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700">
        <Header />
        
        <div className="container mx-auto px-4 py-6 space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-8 animate-fade-in">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
                Welcome to Gen-UI
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
                Hello {getUserDisplayName()}! Your personalized widgets are ready. Try the real-time AI chat below!
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setShowProfile(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  variant="outline"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 hover:scale-105"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Open Dashboard
                </Button>
                <Button 
                  onClick={() => handleModuleSelect('Real-time Dashboard')}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Live Widgets
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="animate-scale-in">
            <ChatInterface 
              onModuleSelect={handleModuleSelect}
              stagingData={stagingData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Dynamic User's Vault */}
          <div className="animate-slide-in-right">
            <UserVault onModuleSelect={handleModuleSelect} isStatic={false} />
          </div>
        </div>
      </div>
    );
  }

  // Frame 2: Module view with widgets
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700">
      <Header />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Module Header */}
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl animate-fade-in">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleBackToVault}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              ← Back to Vault
            </Button>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3 text-3xl">📊</span>
              {selectedModule}
            </h2>
            {user && (
              <span className="text-white/60 text-sm">
                ({preferences.filter(p => p.selected_module === selectedModule).length} saved widgets)
              </span>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Select Widgets <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-gray-700 shadow-2xl">
              <WidgetSelector 
                selectedWidgets={selectedWidgets}
                onWidgetToggle={(widgets) => setSelectedWidgets(widgets)}
                selectedModule={selectedModule}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Widget Grid */}
        <div className="animate-slide-in-right">
          <WidgetGrid 
            selectedWidgets={selectedWidgets}
            stagingData={stagingData}
            isLoading={isLoading}
          />
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl animate-pulse">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
              <span className="text-white text-lg">Processing your request...</span>
            </div>
          </div>
        )}

        {/* Back to Vault Quick Access */}
        <div className="text-center animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={handleBackToVault}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Return to Module Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
