import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Carregando Dashboard...
        </h2>
        <p className="text-gray-500">
          Preparando dados do orçamento do Lote 10x30 - 10 Apartamentos
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
