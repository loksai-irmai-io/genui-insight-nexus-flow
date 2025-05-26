
import { Card } from '@/components/ui/card';

interface UserVaultProps {
  onModuleSelect: (module: string) => void;
  isStatic?: boolean;
}

export const UserVault = ({ onModuleSelect, isStatic = false }: UserVaultProps) => {
  const modules = [
    { name: 'Process Discovery', icon: '🔍', description: 'Discover process patterns' },
    { name: 'Outlier Analysis', icon: '📊', description: 'Identify anomalies and outliers' },
    { name: 'CCM', icon: '⚙️', description: 'Case complexity management' },
    { name: 'Nexus', icon: '🔗', description: 'Connect data sources' }
  ];

  if (isStatic) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500/20 to-transparent p-4">
        <div className="container mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <span className="mr-2">👤</span>
              User's Vault
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modules.map((module) => (
                <Card
                  key={module.name}
                  className="bg-white/10 border-white/20 p-3 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
                  onClick={() => onModuleSelect(module.name)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{module.icon}</div>
                    <h4 className="text-white text-sm font-medium">{module.name}</h4>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h3 className="text-white text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">👤</span>
        User's Vault
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((module) => (
          <Card
            key={module.name}
            className="bg-white/10 border-white/20 p-6 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
            onClick={() => onModuleSelect(module.name)}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{module.icon}</div>
              <h4 className="text-white text-lg font-medium mb-2">{module.name}</h4>
              <p className="text-white/70 text-sm">{module.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
