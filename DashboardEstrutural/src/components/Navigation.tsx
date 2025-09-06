import React, { useState } from 'react';
import { BarChart3, Calculator, PieChart, Box, Layers, Menu, X } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const tabs = [
    {
      id: 'resumo',
      label: 'Resumo',
      fullLabel: 'Resumo Executivo',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Visão geral dos custos e indicadores'
    },
    {
      id: 'orcamento',
      label: 'Orçamento',
      fullLabel: 'Orçamento SINAPI',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Orçamento detalhado por item'
    },
    {
      id: 'cotacao',
      label: 'Cotação',
      fullLabel: 'Cotação Real',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Compare valores SINAPI com cotações reais'
    },
    {
      id: '3d',
      label: '3D',
      fullLabel: 'Visualizador 3D',
      icon: <Box className="h-4 w-4" />,
      description: 'Modelo estrutural em 3D'
    },
    {
      id: '5d',
      label: '5D',
      fullLabel: 'Visualizador 5D',
      icon: <Layers className="h-4 w-4" />,
      description: '3D + Orçamento integrados'
    },
    {
      id: 'graficos',
      label: 'Gráficos',
      fullLabel: 'Gráficos',
      icon: <PieChart className="h-4 w-4" />,
      description: 'Análises gráficas e estatísticas'
    }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {tabs.find(tab => tab.id === activeTab)?.icon}
            <span className="font-medium text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.fullLabel}
            </span>
          </div>
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-gray-500" />
          ) : (
            <Menu className="h-5 w-5 text-gray-500" />
          )}
        </button>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-gray-50">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                    isActive ? 'bg-green-50 text-green-700' : 'text-gray-700'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${
                    isActive ? 'bg-green-100 text-green-600' : 'text-gray-400'
                  }`}>
                    {tab.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{tab.fullLabel}</div>
                    <div className="text-xs text-gray-500">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative py-4 text-center text-sm font-medium hover:text-green-600 focus:z-10
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
