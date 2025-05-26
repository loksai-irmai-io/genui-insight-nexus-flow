
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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700">
      <Header />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <ChatInterface 
          onModuleSelect={handleModuleSelect}
          stagingData={stagingData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {!selectedModule ? (
          <UserVault onModuleSelect={handleModuleSelect} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToVault}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ← Back to Vault
                </Button>
                <h2 className="text-2xl font-bold text-white">{selectedModule}</h2>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                    Select Widgets <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-gray-900 border-gray-700">
                  <WidgetSelector 
                    selectedWidgets={selectedWidgets}
                    onWidgetToggle={(widgets) => setSelectedWidgets(widgets)}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <WidgetGrid 
              selectedWidgets={selectedWidgets}
              stagingData={stagingData}
              isLoading={isLoading}
            />

            {isLoading && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span className="text-white">Processing...</span>
                </div>
              </div>
            )}
          </div>
        )}

        <UserVault onModuleSelect={handleModuleSelect} isStatic={!!selectedModule} />
      </div>
    </div>
  );
};

export default Index;
