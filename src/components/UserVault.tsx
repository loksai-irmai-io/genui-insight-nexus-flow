
import { Card } from '@/components/ui/card';

interface UserVaultProps {
  onModuleSelect: (module: string) => void;
  isStatic?: boolean;
}

export const UserVault = ({ onModuleSelect, isStatic = false }: UserVaultProps) => {
  const modules = [
    { name: 'Process Discovery', icon: '🔍', description: 'Discover process patterns', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Outlier Analysis', icon: '📊', description: 'Identify anomalies and outliers', gradient: 'from-purple-500 to-pink-500' },
    { name: 'CCM', icon: '⚙️', description: 'Case complexity management', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Nexus', icon: '🔗', description: 'Connect data sources', gradient: 'from-orange-500 to-red-500' }
  ];

  // Dynamic version (non-fixed positioning)
  return (
    <div className="w-full">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
        <h3 className="text-white font-bold text-xl mb-6 flex items-center">
          <span className="mr-3 text-2xl">👤</span>
          User's Vault
          <div className="ml-3 h-0.5 flex-1 bg-gradient-to-r from-pink-500 to-transparent"></div>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <Card
              key={module.name}
              className="bg-white/10 border-white/20 p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl group overflow-hidden relative min-h-[140px] flex flex-col justify-center"
              onClick={() => onModuleSelect(module.name)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {module.icon}
                </div>
                <h4 className="text-white text-base font-semibold mb-2">{module.name}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{module.description}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Click on any module to start exploring your data visualizations
          </p>
        </div>
      </div>
    </div>
  );
};
