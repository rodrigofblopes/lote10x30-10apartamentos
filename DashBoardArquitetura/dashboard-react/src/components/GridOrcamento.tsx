import React from 'react';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { Package, Ruler, Calculator, DollarSign, Hash } from 'lucide-react';

const CardOrcamento: React.FC<{ item: any }> = ({ item }) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarQuantidade = (quantidade: number, unidade: string) => {
    return `${quantidade.toFixed(2)} ${unidade}`;
  };

  const formatarPercentual = (peso: number) => {
    return `${peso.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-700 mb-2">{item.categoria}</h3>
          <p className="text-sm text-gray-600 mb-1">Item: {item.item}</p>
          <p className="text-sm text-gray-600 mb-1">Código: {item.codigo}</p>
          <p className="text-sm text-gray-600 mb-3">{item.descricao}</p>
        </div>
        <div className="text-right">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            item.pavimento === 'Térreo' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-indigo-100 text-indigo-800'
          }`}>
            {item.pavimento}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-gray-600" />
          <div>
            <p className="text-xs text-gray-500">Quantidade</p>
            <p className="font-semibold text-gray-700">{formatarQuantidade(item.quantidade, item.unidade)}</p>
          </div>
        </div>
        
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
      </div>

      {/* Preços por m² */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="text-xs text-gray-500 mb-3 text-center font-medium">Preços por m²</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-sm font-bold text-green-600">
              {formatarMoeda(item.totalM2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">M.O.</p>
            <p className="text-sm font-bold text-blue-600">
              {formatarMoeda(item.maoDeObraM2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Mat.</p>
            <p className="text-sm font-bold text-orange-600">
              {formatarMoeda(item.materiaisM2)}
            </p>
          </div>
        </div>
      </div>

      {/* Peso percentual */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Peso no orçamento:</span>
        <span className="font-semibold text-gray-700">{formatarPercentual(item.pesoPercentual)}</span>
      </div>
    </div>
  );
};

const GridOrcamento: React.FC = () => {
  const { itensFiltrados } = useOrcamentoStore();

  const itensTerreo = itensFiltrados.filter(item => item.pavimento === 'Térreo');
  const itensSuperior = itensFiltrados.filter(item => item.pavimento === 'Superior');

  const calcularTotalPavimento = (itens: any[]) => {
    return itens.reduce((sum, item) => sum + item.total, 0);
  };

  const calcularPercentualPavimento = (totalPavimento: number) => {
    const totalGeral = itensFiltrados.reduce((sum, item) => sum + item.total, 0);
    return totalGeral > 0 ? (totalPavimento / totalGeral) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      {/* Pavimento Térreo */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">🏠 Pavimento Térreo</h2>
          <div className="text-2xl font-semibold text-purple-600 mb-2">
            Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularTotalPavimento(itensTerreo))}
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${calcularPercentualPavimento(calcularTotalPavimento(itensTerreo))}%` }}
            ></div>
          </div>
          <div className="text-sm text-purple-600 mt-2">
            {calcularPercentualPavimento(calcularTotalPavimento(itensTerreo)).toFixed(1)}% do total
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itensTerreo.map((item) => (
            <CardOrcamento key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Pavimento Superior */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">🏢 Pavimento Superior</h2>
          <div className="text-2xl font-semibold text-indigo-600 mb-2">
            Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularTotalPavimento(itensSuperior))}
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${calcularPercentualPavimento(calcularTotalPavimento(itensSuperior))}%` }}
            ></div>
          </div>
          <div className="text-sm text-indigo-600 mt-2">
            {calcularPercentualPavimento(calcularTotalPavimento(itensSuperior)).toFixed(1)}% do total
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itensSuperior.map((item) => (
            <CardOrcamento key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridOrcamento;
