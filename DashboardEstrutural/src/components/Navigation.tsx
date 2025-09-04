import React from 'react';
import { BarChart3, Calculator, PieChart, Box } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'resumo',
      label: 'Resumo Executivo',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Visão geral dos custos e indicadores'
    },
    {
      id: 'orcamento',
      label: 'Orçamento SINAPI',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Orçamento detalhado por item'
    },
    {
      id: 'cotacao',
      label: 'Cotação Real',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Compare valores SINAPI com cotações reais'
    },
    {
      id: '3d',
      label: 'Visualizador 3D',
      icon: <Box className="h-4 w-4" />,
      description: 'Modelo estrutural em 3D'
    },
    {
      id: 'graficos',
      label: 'Gráficos',
      icon: <PieChart className="h-4 w-4" />,
      description: 'Análises gráficas e estatísticas'
    }
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center text-sm font-medium hover:text-green-600 focus:z-10
                  ${isActive 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `}>
                    {tab.icon}
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  <span className={`
                    text-xs max-w-full truncate
                    ${isActive ? 'text-green-600' : 'text-gray-400'}
                  `}>
                    {tab.description}
                  </span>
                </div>
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
