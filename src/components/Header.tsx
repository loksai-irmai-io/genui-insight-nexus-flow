
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-pink-600 font-bold text-lg">G</span>
        </div>
        <span className="text-white font-bold text-xl">Gen-UI</span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <User className="w-4 h-4 mr-2" />
        User Profile
      </Button>
    </header>
  );
};
