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

  const formatarPercentual = (valor: number) => {
    return `${valor.toFixed(1)}%`;
  };

  if (!resumo) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          Carregando resumo executivo...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          📊 Resumo Executivo - Lote 10x30 - 10 Apartamentos
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
              {formatarMoeda(resumo.totalGeral)}
            </div>
            <div className="text-sm text-green-600">
              {resumo.numItens} itens orçamentários
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
              {formatarMoeda(resumo.totalMaoObra)}
            </div>
            <div className="text-sm text-blue-600">
              {formatarPercentual(resumo.percentualMaoObra)} do total
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
              {formatarMoeda(resumo.totalMateriais)}
            </div>
            <div className="text-sm text-orange-600">
              {formatarPercentual(resumo.percentualMateriais)} do total
            </div>
          </div>

          {/* Térreo */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Ruler className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-800">Pavimento Térreo</h3>
                <p className="text-sm text-purple-600">Custos do térreo</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {formatarMoeda(resumo.totalTerreo)}
            </div>
            <div className="text-sm text-purple-600">
              {resumo.totalGeral > 0 ? formatarPercentual((resumo.totalTerreo / resumo.totalGeral) * 100) : '0%'} do total
            </div>
          </div>

          {/* Pavimento Superior */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-800">Pavimento Superior</h3>
                <p className="text-sm text-indigo-600">Custos do superior</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-700 mb-2">
              {formatarMoeda(resumo.totalSuperior)}
            </div>
            <div className="text-sm text-indigo-600">
              {resumo.totalGeral > 0 ? formatarPercentual((resumo.totalSuperior / resumo.totalGeral) * 100) : '0%'} do total
            </div>
          </div>

          {/* Comparação M.O. vs Materiais */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gray-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Distribuição</h3>
                <p className="text-sm text-gray-600">M.O. vs Materiais</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600">Mão de Obra</span>
                <span className="text-sm font-semibold text-blue-700">
                  {formatarPercentual(resumo.percentualMaoObra)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${resumo.percentualMaoObra}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-600">Materiais</span>
                <span className="text-sm font-semibold text-orange-700">
                  {formatarPercentual(resumo.percentualMateriais)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${resumo.percentualMateriais}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumoExecutivo;
