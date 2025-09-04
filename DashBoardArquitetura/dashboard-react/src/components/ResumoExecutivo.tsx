import React from 'react';
import { useCotacaoStore } from '../store/cotacaoStore';
import { DollarSign, Users, Package, Ruler, Calculator, TrendingUp } from 'lucide-react';

const ResumoExecutivo: React.FC = () => {
  const { getResumo } = useCotacaoStore();
  const resumo = getResumo();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor.toFixed(1)}%`;
  };

  if (!resumo || resumo.numItens === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <div className="text-center text-gray-500">
          <p className="mb-2">Nenhum dado de cotação disponível</p>
          <p className="text-sm">Os dados estão sendo carregados automaticamente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold text-green-700 mb-4 lg:mb-6">
          📊 Resumo Executivo - Lote 10x30 - 10 Apartamentos
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Valor Total - Soma de MO + Materiais */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 lg:p-6 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-green-800">Valor Total</h3>
                <p className="text-xs lg:text-sm text-green-600">MO + Materiais (Total Geral)</p>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-green-700 mb-2">
              {formatarMoeda(resumo.totalGeral)}
            </div>
            <div className="text-xs lg:text-sm text-green-600">
              {resumo.numItens} itens orçamentários
            </div>
          </div>

          {/* Mão de Obra */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 lg:p-6 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-blue-800">Mão de Obra</h3>
                <p className="text-xs lg:text-sm text-blue-600">Apenas custos de MO</p>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-blue-700 mb-2">
              {formatarMoeda(resumo.totalMaoObra)}
            </div>
            <div className="text-xs lg:text-sm text-blue-600">
              {formatarPercentual(resumo.percentualMaoObra)} do total
            </div>
          </div>

          {/* Materiais */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 lg:p-6 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Package className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-orange-800">Materiais</h3>
                <p className="text-xs lg:text-sm text-orange-600">Apenas custos de materiais</p>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-orange-700 mb-2">
              {formatarMoeda(resumo.totalMateriais)}
            </div>
            <div className="text-xs lg:text-sm text-orange-600">
              {formatarPercentual(resumo.percentualMateriais)} do total
            </div>
          </div>

          {/* Total por m² */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 lg:p-6 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Ruler className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-emerald-800">Total por m²</h3>
                <p className="text-xs lg:text-sm text-emerald-600">Custo total por m²</p>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-emerald-700 mb-2">
              {formatarMoeda(resumo.totalGeral / 298)}
            </div>
            <div className="text-xs lg:text-sm text-emerald-600">
              Área: 298 m²
            </div>
          </div>
        </div>

        {/* Segunda linha de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-4 lg:mt-6">
          {/* M.O. por m² */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 lg:p-6 rounded-lg border border-cyan-200">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <div className="p-2 bg-cyan-600 rounded-lg">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-cyan-800">M.O. por m²</h3>
                <p className="text-xs lg:text-sm text-cyan-600">Custo de MO por m²</p>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-cyan-700 mb-2">
              {formatarMoeda(resumo.totalMaoObra / 298)}
            </div>
            <div className="text-xs lg:text-sm text-cyan-600">
              Área: 298 m²
            </div>
          </div>

          {/* Materiais por m² */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 lg:p-6 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Package className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-purple-800">Mat. por m²</h3>
                <p className="text-xs lg:text-sm text-purple-600">Custo de materiais por m²</p>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-purple-700 mb-2">
              {formatarMoeda(resumo.totalMateriais / 298)}
            </div>
            <div className="text-xs lg:text-sm text-purple-600">
              Área: 298 m²
            </div>
          </div>

          {/* Pavimento Térreo */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 lg:p-6 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Calculator className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-indigo-800">Pav. Térreo</h3>
                <p className="text-xs lg:text-sm text-indigo-600">Custo do pavimento térreo</p>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-indigo-700 mb-2">
              {formatarMoeda(resumo.totalTerreo)}
            </div>
            <div className="text-xs lg:text-sm text-indigo-600">
              {formatarPercentual((resumo.totalTerreo / resumo.totalGeral) * 100)} do total
            </div>
          </div>

          {/* Pavimento Superior */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 lg:p-6 rounded-lg border border-pink-200">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <div className="p-2 bg-pink-600 rounded-lg">
                <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-pink-800">Pav. Superior</h3>
                <p className="text-xs lg:text-sm text-pink-600">Custo do pavimento superior</p>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-pink-700 mb-2">
              {formatarMoeda(resumo.totalSuperior)}
            </div>
            <div className="text-xs lg:text-sm text-pink-600">
              {formatarPercentual((resumo.totalSuperior / resumo.totalGeral) * 100)} do total
            </div>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">
          📋 Informações do Projeto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm lg:text-base">
          <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Características</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 10 apartamentos</li>
              <li>• Lote 10x30 metros</li>
              <li>• Área total: 298 m²</li>
              <li>• 2 pavimentos</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Composição</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• {resumo.numItens} itens orçamentários</li>
              <li>• M.O.: {formatarPercentual(resumo.percentualMaoObra)}</li>
              <li>• Materiais: {formatarPercentual(resumo.percentualMateriais)}</li>
              <li>• Custo/m²: {formatarMoeda(resumo.totalGeral / 298)}</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Distribuição</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Térreo: {formatarMoeda(resumo.totalTerreo)}</li>
              <li>• Superior: {formatarMoeda(resumo.totalSuperior)}</li>
              <li>• Total: {formatarMoeda(resumo.totalGeral)}</li>
              <li>• Base SINAPI atualizada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumoExecutivo;
