import React from 'react';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { BarChart3, PieChart, TrendingUp, Calculator } from 'lucide-react';

const Graficos: React.FC = () => {
  const { itensFiltrados } = useOrcamentoStore();

  const calcularDadosGraficos = () => {
    if (itensFiltrados.length === 0) return null;

    // Distribuição por categoria
    const distribuicaoCategoria = itensFiltrados.reduce((acc: any, item: any) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + item.total;
      return acc;
    }, {});

    // Distribuição por pavimento
    const distribuicaoPavimento = itensFiltrados.reduce((acc: any, item: any) => {
      acc[item.pavimento] = (acc[item.pavimento] || 0) + item.total;
      return acc;
    }, {});

    // Top 5 itens mais caros
    const topItens = [...itensFiltrados]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      distribuicaoCategoria,
      distribuicaoPavimento,
      topItens
    };
  };

  const dados = calcularDadosGraficos();

  if (!dados) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          Carregando gráficos...
        </div>
      </div>
    );
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarPercentual = (valor: number, total: number) => {
    return total > 0 ? `${((valor / total) * 100).toFixed(1)}%` : '0%';
  };

  const totalGeral = itensFiltrados.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Análise Gráfica e Estatísticas
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Categoria */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Distribuição por Categoria</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(dados.distribuicaoCategoria).map(([categoria, valor]) => (
              <div key={categoria} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{categoria}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-gray-800">
                    {formatarMoeda(valor as number)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatarPercentual(valor as number, totalGeral)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuição por Pavimento */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Distribuição por Pavimento</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(dados.distribuicaoPavimento).map(([pavimento, valor]) => (
              <div key={pavimento}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{pavimento}</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatarMoeda(valor as number)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      pavimento === 'Térreo' ? 'bg-purple-600' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${((valor as number) / totalGeral) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {formatarPercentual(valor as number, totalGeral)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 Itens Mais Caros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Top 5 Itens Mais Caros</h3>
        </div>
        
        <div className="space-y-3">
          {dados.topItens.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-orange-600">#{index + 1}</span>
                <div>
                  <p className="font-medium text-gray-800">{item.categoria}</p>
                  <p className="text-sm text-gray-600">{item.descricao}</p>
                  <p className="text-xs text-gray-500">{item.pavimento} • {item.item}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{formatarMoeda(item.total)}</p>
                <p className="text-xs text-gray-500">
                  {formatarPercentual(item.total, totalGeral)} do total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Estatísticas Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{itensFiltrados.length}</p>
            <p className="text-sm text-green-700">Total de Itens</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {itensFiltrados.filter(item => item.pavimento === 'Térreo').length}
            </p>
            <p className="text-sm text-blue-700">Itens Térreo</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {itensFiltrados.filter(item => item.pavimento === 'Superior').length}
            </p>
            <p className="text-sm text-purple-700">Itens Superior</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {new Set(itensFiltrados.map(item => item.categoria)).size}
            </p>
            <p className="text-sm text-orange-700">Categorias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graficos;
