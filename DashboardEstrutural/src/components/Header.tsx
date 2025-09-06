import React from 'react';
import { Building2, Calculator, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Building2 className="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl lg:text-3xl font-bold truncate">
                  Lote 10x30 - 10 Apartamentos
                </h1>
                <p className="text-green-100 text-sm lg:text-lg">
                  Dashboard de Orçamento
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6 mt-4 lg:mt-0">
            <div className="text-center">
              <Calculator className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Orçamento</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Análise</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 lg:mt-6 text-center">
          <p className="text-green-100 text-sm lg:text-lg">
            Análise interativa de orçamento por etapas construtivas e elementos estruturais
          </p>
          <p className="text-green-200 text-xs lg:text-sm mt-2">
            Dados baseados na planilha SINAPI - Lote 10x30 - 10 Apartamentos
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
