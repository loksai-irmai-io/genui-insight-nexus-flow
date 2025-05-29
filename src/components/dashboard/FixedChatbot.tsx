
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Minimize2, Bot, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  message: string;
  timestamp: Date;
  action?: {
    type: 'widget_change' | 'layout_change' | 'fetch_sop_data';
    description: string;
    data: any;
  };
  confirmed?: boolean;
}

interface FixedChatbotProps {
  onWidgetCommand: (command: string, data: any) => void;
  sopData?: any;
}

export const FixedChatbot = ({ onWidgetCommand, sopData }: FixedChatbotProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      message: 'Welcome to Gen-UI Dashboard! I can help you manage widgets and analyze data. Try asking about "SOP deviation" to fetch and visualize real-time data.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const parseCommand = (input: string) => {
    const lower = input.toLowerCase();
    
    // SOP deviation query
    if (lower.includes('sop deviation') || lower.includes('sop data')) {
      return { type: 'fetch_sop_data', description: 'Fetch SOP deviation data from APIs' };
    }
    
    // Widget addition commands
    if (lower.includes('add') && (lower.includes('chart') || lower.includes('widget'))) {
      if (lower.includes('bar')) return { type: 'add_widget', widget: 'BarChart' };
      if (lower.includes('line')) return { type: 'add_widget', widget: 'LineChart' };
      if (lower.includes('pie')) return { type: 'add_widget', widget: 'PieChart' };
      if (lower.includes('gauge')) return { type: 'add_widget', widget: 'Gauge' };
      if (lower.includes('table')) return { type: 'add_widget', widget: 'DataTable' };
    }
    
    // Widget modification commands
    if (lower.includes('switch') || lower.includes('change')) {
      if (lower.includes('pie chart') || lower.includes('pie')) return { type: 'change_widget', to: 'PieChart', from: 'any' };
      if (lower.includes('bar chart') || lower.includes('bar')) return { type: 'change_widget', to: 'BarChart', from: 'any' };
      if (lower.includes('line chart') || lower.includes('line')) return { type: 'change_widget', to: 'LineChart', from: 'any' };
    }
    
    // Widget removal commands
    if (lower.includes('hide') || lower.includes('remove') || lower.includes('delete')) {
      return { type: 'remove_widget', widget: 'any' };
    }
    
    return null;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const currentInput = inputValue;
    setInputValue('');

    // Parse command first
    const command = parseCommand(currentInput);
    
    try {
      // Send to AI for processing
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: `User command: "${currentInput}". Context: This is a dashboard management request for Gen-UI. ${
            command ? `Detected command: ${JSON.stringify(command)}` : 'No specific command detected.'
          }. The user can ask about SOP deviation to fetch real-time data. Please provide a helpful response.` 
        }
      });

      if (error) throw error;

      let aiResponse = data.response;
      
      // Add context about SOP data if available
      if (command?.type === 'fetch_sop_data' && sopData) {
        aiResponse += `\n\nI can see SOP deviation data is available. The data includes count information and pattern analysis that will be visualized in new widgets.`;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse,
        timestamp: new Date(),
        action: command ? {
          type: command.type as 'widget_change' | 'layout_change' | 'fetch_sop_data',
          description: command.description || `Execute command: ${command.type}`,
          data: command
        } : undefined
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: `I apologize, but I encountered an error: ${error.message}. However, I can still help with dashboard commands and SOP deviation queries!`,
        timestamp: new Date(),
        action: command ? {
          type: command.type as 'widget_change' | 'layout_change' | 'fetch_sop_data',
          description: command.description || `Execute command: ${command.type}`,
          data: command
        } : undefined
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = (messageId: string, action: any) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, confirmed: true } : msg
    ));
    
    if (action.type === 'fetch_sop_data') {
      onWidgetCommand('fetch_sop_data', action.data);
    } else {
      onWidgetCommand(action.type, action.data);
    }
  };

  const rejectAction = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, confirmed: false } : msg
    ));
  };

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        size="lg"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        AI Assistant
      </Button>
    );
  }

  return (
    <Card className="w-full h-80 bg-gray-900/95 backdrop-blur-sm border-white/20 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(true)}
          className="text-white/70 hover:text-white p-1"
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[85%] rounded-lg p-3 
                ${message.type === 'user' 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' 
                  : message.type === 'system'
                  ? 'bg-blue-600/20 text-blue-200 border border-blue-400/30'
                  : 'bg-white/10 text-white'
                }
              `}>
                <div className="flex items-start space-x-2">
                  {message.type !== 'user' && (
                    <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {message.type === 'system' ? '🎯' : <Bot className="w-3 h-3 text-white" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    
                    {/* Action Confirmation */}
                    {message.action && message.confirmed === undefined && (
                      <div className="mt-2 p-2 bg-white/10 rounded border border-white/20">
                        <p className="text-xs text-white/80 mb-2">{message.action.description}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => confirmAction(message.id, message.action)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs h-7"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Apply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectAction(message.id)}
                            className="border-red-400 text-red-400 hover:bg-red-400/10 text-xs h-7"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {message.confirmed === true && (
                      <div className="mt-1 text-xs text-green-400">✓ Action applied</div>
                    )}
                    
                    {message.confirmed === false && (
                      <div className="mt-1 text-xs text-red-400">✗ Action cancelled</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-lg p-3 max-w-[85%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-white" />
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
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about SOP deviation or manage widgets..."
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
