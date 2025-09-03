import React from 'react';
import { Building2, Calculator, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Vila Andriw</h1>
                <p className="text-green-100 text-lg">Dashboard de Orçamento</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
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
        
        <div className="mt-6 text-center">
          <p className="text-green-100 text-lg">
            Análise interativa de orçamento por etapas construtivas e elementos estruturais
          </p>
          <p className="text-green-200 text-sm mt-2">
            Dados baseados na planilha SINAPI - Vila Andriw
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
