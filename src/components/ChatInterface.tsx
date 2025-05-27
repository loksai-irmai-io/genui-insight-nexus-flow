
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

    try {
      console.log('Sending query to AI:', currentQuery);
      
      // Call the actual AI API
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: currentQuery }
      });

      console.log('AI API response:', { data, error });

      if (error) {
        throw error;
      }

      let response = data?.response || 'I apologize, but I encountered an issue processing your request.';

      // Check if the response suggests showing specific widgets
      const lowerQuery = currentQuery.toLowerCase();
      if (lowerQuery.includes('outlier') || lowerQuery.includes('analysis')) {
        response += '\n\n📊 I can show you outlier analysis data. Let me activate the relevant visualizations.';
        onModuleSelect('Outlier Analysis');
      } else if (lowerQuery.includes('process') || lowerQuery.includes('discovery')) {
        response += '\n\n🔍 I can show you process discovery analysis. Let me generate the visualizations.';
        onModuleSelect('Process Discovery');
      } else if (lowerQuery.includes('performance') || lowerQuery.includes('resource')) {
        response += '\n\n⚡ I can show you resource performance data. Activating the performance dashboard.';
        onModuleSelect('Resource Performance');
      } else if (lowerQuery.includes('ccm') || lowerQuery.includes('complexity')) {
        response += '\n\n⚙️ I can show you case complexity management data. Loading the CCM module.';
        onModuleSelect('CCM');
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: response,
        timestamp: new Date()
      };

      setIsTyping(false);
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI API error:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: `I apologize, but I encountered an error: ${error.message || 'Unable to process your request at the moment.'}`,
        timestamp: new Date()
      };

      setIsTyping(false);
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
        <p className="text-white/70 text-sm">Powered by Google AI - Ask me anything!</p>
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
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.message}</p>
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
