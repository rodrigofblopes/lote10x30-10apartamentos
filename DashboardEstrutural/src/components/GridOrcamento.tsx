import React from 'react';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { Package, Ruler, Calculator, DollarSign } from 'lucide-react';

const CardOrcamento: React.FC<{ item: any }> = ({ item }) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarArea = (area?: number) => {
    if (area === undefined) return 'N/A';
    return `${area.toFixed(2)} m²`;
  };

  const formatarPeso = (peso: number) => {
    return `${peso.toFixed(2)}%`;
  };

  const calcularPrecoPorM2 = (valor: number, area?: number) => {
    if (!area || area === 0) return 'N/A';
    return formatarMoeda(valor / area);
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-700 mb-2">{item.nome}</h3>
          <p className="text-sm text-gray-600 mb-1">Código: {item.codigo}</p>
          <p className="text-sm text-gray-600 mb-3">{item.descricao}</p>
        </div>
        <div className="text-right">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {item.categoria}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-semibold text-green-700">{formatarMoeda(item.total)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calculator className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">Mão de Obra</p>
            <p className="font-semibold text-blue-700">{formatarMoeda(item.maoDeObra)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-orange-600" />
          <div>
            <p className="text-xs text-gray-500">Materiais</p>
            <p className="font-semibold text-orange-700">{formatarMoeda(item.materiais)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Ruler className="h-4 w-4 text-purple-600" />
          <div>
            <p className="text-xs text-gray-500">Área</p>
            <p className="font-semibold text-purple-700">{formatarArea(item.area)}</p>
          </div>
        </div>
      </div>

      {/* Preços por m² */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="text-xs text-gray-500 mb-3 text-center font-medium">Preços por m²</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-sm font-bold text-green-600">
              {calcularPrecoPorM2(item.total, item.area)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">M.O.</p>
            <p className="text-sm font-bold text-blue-600">
              {calcularPrecoPorM2(item.maoDeObra, item.area)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Mat.</p>
            <p className="text-sm font-bold text-orange-600">
              {calcularPrecoPorM2(item.materiais, item.area)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Subcategoria: {item.subcategoria}</span>
        <span className="font-medium text-green-600">Peso: {formatarPeso(item.peso)}</span>
      </div>
    </div>
  );
};

const GridOrcamento: React.FC = () => {
  const { itens } = useOrcamentoStore();

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Package className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-green-700">Itens do Orçamento</h3>
        <span className="ml-auto text-sm text-gray-500">
          {itens.length} itens
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itens.map((item, index) => (
          <CardOrcamento key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default GridOrcamento;
