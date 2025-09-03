import React from 'react';
import { useOrcamentoStore } from '../store/orcamentoStore';

const Graficos: React.FC = () => {
  const { itens } = useOrcamentoStore();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  // Dados para gráfico de pizza - Distribuição por categoria
  const dadosPorCategoria = itens.reduce((acc: any, item: any) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = {
        total: 0,
        quantidade: 0,
        maoDeObra: 0,
        materiais: 0
      };
    }
    acc[item.categoria].total += item.total;
    acc[item.categoria].quantidade += 1;
    acc[item.categoria].maoDeObra += item.maoDeObra;
    acc[item.categoria].materiais += item.materiais;
    return acc;
  }, {});

  // Dados para gráfico de barras - M.O. vs Materiais por subcategoria
  const dadosPorSubcategoria = itens.reduce((acc: any, item: any) => {
    if (!acc[item.subcategoria]) {
      acc[item.subcategoria] = {
        total: 0,
        quantidade: 0,
        maoDeObra: 0,
        materiais: 0
      };
    }
    acc[item.subcategoria].total += item.total;
    acc[item.subcategoria].quantidade += 1;
    acc[item.subcategoria].maoDeObra += item.maoDeObra;
    acc[item.subcategoria].materiais += item.materiais;
    return acc;
  }, {});

  // Dados para gráfico de linha - Custo por m² por subcategoria
  const dadosCustoPorM2 = itens
    .filter(item => item.area && item.area > 0)
    .reduce((acc: any, item: any) => {
      if (!acc[item.subcategoria]) {
        acc[item.subcategoria] = {
          total: 0,
          area: 0,
          quantidade: 0
        };
      }
      acc[item.subcategoria].total += item.total;
      acc[item.subcategoria].area += item.area;
      acc[item.subcategoria].quantidade += 1;
      return acc;
    }, {});

  return (
    <div className="space-y-8">
      {/* Gráfico de Pizza - Distribuição por Categoria */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-green-700 mb-6">
          📊 Distribuição de Custos por Categoria
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(dadosPorCategoria)
            .sort(([, a]: [string, any], [, b]: [string, any]) => b.total - a.total)
            .slice(0, 6)
            .map(([categoria, dados]: [string, any]) => {
              const percentual = (dados.total / itens.reduce((sum: number, item: any) => sum + item.total, 0)) * 100;
              return (
                <div key={categoria} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{categoria}</h4>
                    <span className="text-sm text-gray-500">{dados.quantidade} itens</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatarMoeda(dados.total)}
                  </div>
                  <div className="text-sm text-gray-600">{percentual.toFixed(1)}% do total</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Gráfico de Barras - M.O. vs Materiais por Subcategoria */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-green-700 mb-6">
          🏗️ Mão de Obra vs Materiais por Subcategoria
        </h3>
        
        <div className="space-y-4">
          {Object.entries(dadosPorSubcategoria)
            .sort(([, a]: [string, any], [, b]: [string, any]) => b.total - a.total)
            .slice(0, 8)
            .map(([subcategoria, dados]: [string, any]) => (
              <div key={subcategoria} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{subcategoria}</h4>
                  <span className="text-sm text-gray-500">{formatarMoeda(dados.total)}</span>
                </div>
                
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  {/* Barra de Mão de Obra */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-l-full"
                    style={{
                      width: `${(dados.maoDeObra / dados.total) * 100}%`
                    }}
                  />
                  
                  {/* Barra de Materiais */}
                  <div 
                    className="absolute top-0 h-full bg-orange-500 rounded-r-full"
                    style={{
                      left: `${(dados.maoDeObra / dados.total) * 100}%`,
                      width: `${(dados.materiais / dados.total) * 100}%`
                    }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span className="mr-4">M.O.: {formatarMoeda(dados.maoDeObra)}</span>
                  <span>Mat.: {formatarMoeda(dados.materiais)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Gráfico de Linha - Custo por m² por Subcategoria */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-green-700 mb-6">
          📐 Custo por m² por Subcategoria
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(dadosCustoPorM2)
            .sort(([, a]: [string, any], [, b]: [string, any]) => b.total - a.total)
            .slice(0, 9)
            .map(([subcategoria, dados]: [string, any]) => {
              const custoMedioPorM2 = dados.total / itens
                .filter((item: any) => item.subcategoria === subcategoria && item.area)
                .reduce((sum: number, item: any) => sum + (item.area || 0), 0);
              
              return (
                <div key={subcategoria} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{subcategoria}</h4>
                    <span className="text-sm text-gray-500">{dados.quantidade} itens</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatarMoeda(custoMedioPorM2)}
                  </div>
                  <div className="text-sm text-gray-600">por m²</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {formatarMoeda(dados.total)} • Área: {dados.area.toFixed(1)} m²
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-green-700 mb-6">
          📈 Resumo Geral dos Dados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {itens.length}
            </div>
            <div className="text-sm text-gray-600">Total de Itens</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(dadosPorCategoria).length}
            </div>
            <div className="text-sm text-gray-600">Categorias</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(dadosPorSubcategoria).length}
            </div>
            <div className="text-sm text-gray-600">Subcategorias</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatarMoeda(
                itens.reduce((sum: number, item: any) => sum + item.total, 0)
              )}
            </div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graficos;
