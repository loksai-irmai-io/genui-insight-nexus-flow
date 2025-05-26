
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, Paperclip } from 'lucide-react';

interface ChatInterfaceProps {
  onModuleSelect: (module: string) => void;
  stagingData: any;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ChatInterface = ({ onModuleSelect, stagingData, isLoading, setIsLoading }: ChatInterfaceProps) => {
  const [query, setQuery] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  const handleSend = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setChatResponse(null);

    // Simulate AI processing
    setTimeout(() => {
      // Mock AI response based on query
      let response = '';
      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes('weather') || lowerQuery.includes('london')) {
        response = 'Here is the current weather data for London: Temperature: 18°C, Humidity: 65%, Wind Speed: 12 km/h. The weather widget has been updated with real-time data.';
      } else if (lowerQuery.includes('outlier') || lowerQuery.includes('analysis')) {
        response = 'Outlier analysis shows 3 cases exceeding the 180.54h threshold. The most critical case (C003) shows a duration of 245.8 hours, which is 54% above the expected threshold.';
        onModuleSelect('Outlier Analysis');
      } else if (lowerQuery.includes('process') || lowerQuery.includes('discovery')) {
        response = 'Process discovery analysis reveals 5 main process variants with an average case duration of 142.3 hours. The most frequent path handles 67% of all cases.';
        onModuleSelect('Process Discovery');
      } else if (lowerQuery.includes('performance') || lowerQuery.includes('resource')) {
        response = 'Resource performance analysis shows ABAKER has the best average step duration at 2.5 hours, while handling 145 completed tasks. Overall resource utilization is at 78%.';
      } else {
        response = `I understand you're asking about "${query}". Based on the available data, I can help you visualize various aspects of your process mining data. Would you like to explore specific modules like Process Discovery, Outlier Analysis, or CCM?`;
      }

      setChatResponse(response);
      setIsLoading(false);
      setQuery('');
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Gen-UI</h1>
        <p className="text-white/80 text-lg">Chat-driven insights, instantly visualized.</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Gen-UI to visualize..."
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/60"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !query.trim()}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
        </div>

        {chatResponse && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm leading-relaxed">{chatResponse}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
