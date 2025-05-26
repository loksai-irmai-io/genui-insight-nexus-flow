import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';
import { UserVault } from '@/components/UserVault';
import { WidgetGrid } from '@/components/WidgetGrid';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WidgetSelector } from '@/components/WidgetSelector';

const Index = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [stagingData, setStagingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleModuleSelect = (moduleName: string) => {
    setSelectedModule(moduleName);
    setSelectedWidgets([]);
  };

  const handleBackToVault = () => {
    setSelectedModule(null);
    setSelectedWidgets([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700 relative overflow-x-hidden">
      <Header />
      
      {/* Main Content Area with proper spacing for fixed vault */}
      <div className="container mx-auto px-4 py-6 pb-32 space-y-6">
        <div className="animate-fade-in">
          <ChatInterface 
            onModuleSelect={handleModuleSelect}
            stagingData={stagingData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {!selectedModule ? (
          <div className="text-center space-y-8 animate-scale-in">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
                Welcome to Gen-UI
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Select a module from your vault below or ask me to visualize your data. 
                I'll help you create stunning visualizations instantly.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-in-right">
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl">
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
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="animate-fade-in">
              <WidgetGrid 
                selectedWidgets={selectedWidgets}
                stagingData={stagingData}
                isLoading={isLoading}
              />
            </div>

            {isLoading && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl animate-pulse">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
                  <span className="text-white text-lg">Processing your request...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed User's Vault at bottom */}
      <UserVault onModuleSelect={handleModuleSelect} isStatic={true} />
    </div>
  );
};

export default Index;
