import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🏗️ Dashboard de Orçamento - Vila Andriw
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto">
            Visualização interativa e intuitiva dos custos de construção por pavimento e categoria
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-green-200">
            <span className="flex items-center">
              🏠 Térreo e Pavimento Superior
            </span>
            <span className="flex items-center">
              📊 Análise detalhada por categoria
            </span>
            <span className="flex items-center">
              💰 Custos de mão de obra e materiais
            </span>
            <span className="flex items-center">
              📏 Preços por m² para cada item
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
