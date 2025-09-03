import React from 'react';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { DollarSign, Users, Package, Ruler, Calculator, TrendingUp } from 'lucide-react';

const ResumoExecutivo: React.FC = () => {
  const { resumo } = useOrcamentoStore();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarArea = (area: number) => {
    return `${area.toFixed(2)} m²`;
  };

  const formatarCustoPorM2 = (custo: number) => {
    return formatarMoeda(custo);
  };

  if (!resumo) {
    return (
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="text-center text-gray-500">
          Carregando resumo executivo...
        </div>
      </div>
    );
  }

  // Área total real da Vila Andriw: 298 m² (149 m² por pavimento)
  const areaTotalReal = 298;
  const custoPorM2Real = resumo.valorTotal / areaTotalReal;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          📊 Resumo Executivo - Vila Andriw
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Valor Total */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">Valor Total</h3>
                <p className="text-sm text-green-600">Custo total do projeto</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-700 mb-2">
              {formatarMoeda(resumo.valorTotal)}
            </div>
            <div className="text-sm text-green-600">
              Projeto completo
            </div>
          </div>

          {/* Mão de Obra */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Mão de Obra</h3>
                <p className="text-sm text-blue-600">Custos de mão de obra</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {formatarMoeda(resumo.maoDeObraTotal)}
            </div>
            <div className="text-sm text-blue-600">
              {resumo.valorTotal > 0 ? ((resumo.maoDeObraTotal / resumo.valorTotal) * 100).toFixed(1) : 0}% do total
            </div>
          </div>

          {/* Materiais */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-800">Materiais</h3>
                <p className="text-sm text-orange-600">Custos de materiais</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-700 mb-2">
              {formatarMoeda(resumo.materiaisTotal)}
            </div>
            <div className="text-sm text-orange-600">
              {resumo.valorTotal > 0 ? ((resumo.materiaisTotal / resumo.valorTotal) * 100).toFixed(1) : 0}% do total
            </div>
          </div>

          {/* Área Total */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Ruler className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-800">Área Total</h3>
                <p className="text-sm text-purple-600">Área construída total</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {formatarArea(areaTotalReal)}
            </div>
            <div className="text-sm text-purple-600">
              149 m² por pavimento (2 pavimentos)
            </div>
          </div>

          {/* Custo por m² */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-800">Custo por m²</h3>
                <p className="text-sm text-indigo-600">Custo médio por metro quadrado</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-700 mb-2">
              {formatarCustoPorM2(custoPorM2Real)}
            </div>
            <div className="text-sm text-indigo-600">
              por metro quadrado
            </div>
          </div>

          {/* Item Mais Caro */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Item Mais Caro</h3>
                <p className="text-sm text-red-600">Item com maior custo</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-700 mb-2">
              {resumo.itemMaisCaro ? formatarMoeda(resumo.itemMaisCaro.total) : 'N/A'}
            </div>
            <div className="text-sm text-red-600">
              {resumo.itemMaisCaro ? resumo.itemMaisCaro.nome : 'Nenhum item'}
            </div>
          </div>
        </div>

        {/* Resumo Percentual */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📈 Distribuição Percentual dos Custos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Mão de Obra:</span>
                <span className="font-semibold text-blue-600">
                  {resumo.valorTotal > 0 ? ((resumo.maoDeObraTotal / resumo.valorTotal) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Materiais:</span>
                <span className="font-semibold text-orange-600">
                  {resumo.valorTotal > 0 ? ((resumo.materiaisTotal / resumo.valorTotal) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Custo por m²:</span>
                <span className="font-semibold text-indigo-600">
                  {formatarCustoPorM2(custoPorM2Real)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Área total:</span>
                <span className="font-semibold text-purple-600">
                  {formatarArea(areaTotalReal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumoExecutivo;
