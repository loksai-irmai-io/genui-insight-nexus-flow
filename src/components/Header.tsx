
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-pink-600 font-bold text-lg">G</span>
        </div>
        <span className="text-white font-bold text-xl">Gen-UI</span>
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <span className="text-white/80 text-sm">
            Welcome, {user.email}
          </span>
        )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleAuthAction}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {user ? (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </div>
    </header>
  );
};
