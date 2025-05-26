
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  onModuleSelect: (module: string) => void;
  stagingData: any;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ChatInterface = ({ onModuleSelect, stagingData, isLoading, setIsLoading }: ChatInterfaceProps) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, type: 'user' | 'ai', message: string, timestamp: Date}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: query,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    
    const currentQuery = query;
    setQuery('');

    // Simulate AI processing with realistic delay
    setTimeout(() => {
      let response = '';
      const lowerQuery = currentQuery.toLowerCase();

      if (lowerQuery.includes('weather') || lowerQuery.includes('london')) {
        response = '🌤️ Here is the current weather data for London: Temperature: 18°C, Humidity: 65%, Wind Speed: 12 km/h. The weather widget has been updated with real-time data.';
      } else if (lowerQuery.includes('outlier') || lowerQuery.includes('analysis')) {
        response = '📊 Outlier analysis reveals 3 critical cases exceeding the 180.54h threshold. The most severe case (C003) shows a duration of 245.8 hours, which is 54% above the expected threshold. Visual analysis has been updated.';
        onModuleSelect('Outlier Analysis');
      } else if (lowerQuery.includes('process') || lowerQuery.includes('discovery')) {
        response = '🔍 Process discovery analysis shows 5 main process variants with an average case duration of 142.3 hours. The most frequent path handles 67% of all cases. Visualizations have been generated.';
        onModuleSelect('Process Discovery');
      } else if (lowerQuery.includes('performance') || lowerQuery.includes('resource')) {
        response = '⚡ Resource performance analysis indicates ABAKER has the best average step duration at 2.5 hours, handling 145 completed tasks. Overall resource utilization is at 78%. Dashboard updated.';
      } else if (lowerQuery.includes('ccm') || lowerQuery.includes('complexity')) {
        response = '⚙️ Case complexity management shows varying complexity scores across different process instances. High-complexity cases require 40% more processing time on average.';
        onModuleSelect('CCM');
      } else {
        response = `✨ I understand you're asking about "${currentQuery}". Based on your data, I can help visualize various aspects including Process Discovery, Outlier Analysis, Resource Performance, and Case Complexity. Would you like me to generate specific visualizations?`;
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: response,
        timestamp: new Date()
      };

      setIsTyping(false);
      setChatHistory(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-pink-200 to-blue-200 bg-clip-text text-transparent">
            Gen-UI
          </h1>
        </div>
        <p className="text-white/90 text-xl font-medium">Chat-driven insights, instantly visualized.</p>
      </div>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl max-h-80 overflow-y-auto space-y-4">
          {chatHistory.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white ml-4' 
                  : 'bg-white/20 text-white mr-4'
              }`}>
                <div className="flex items-start space-x-3">
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/20 rounded-2xl p-4 mr-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex space-x-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Gen-UI to visualize..."
            className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60 rounded-xl h-12 text-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !query.trim()}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-12 px-4 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-12 px-4 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
