import React from 'react';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Graficos: React.FC = () => {
  const { itens } = useOrcamentoStore();

  // Função para ordenar categorias na sequência desejada
  const ordenarCategorias = (categorias: string[]) => {
    const ordem = ['Fundação', 'Térreo', 'Pavimento Superior'];
    return categorias.sort((a, b) => {
      const indexA = ordem.indexOf(a);
      const indexB = ordem.indexOf(b);
      return indexA - indexB;
    });
  };

  if (itens.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados para gráficos...</p>
        </div>
      </div>
    );
  }

  // Agrupar dados por categoria
  const dadosPorCategoria = itens.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = {
        maoDeObra: 0,
        materiais: 0,
        total: 0,
        quantidade: 0,
        volumeConcreto: 0
      };
    }
    
    acc[item.categoria].maoDeObra += item.maoDeObra;
    acc[item.categoria].materiais += item.materiais;
    acc[item.categoria].total += item.total;
    acc[item.categoria].quantidade += item.quantidade || 0;
    
    // Calcular volume de concreto (excluindo aço e outros materiais)
    if (item.descricao.toLowerCase().includes('concreto') || 
        item.descricao.toLowerCase().includes('pilares') ||
        item.descricao.toLowerCase().includes('vigas') ||
        item.descricao.toLowerCase().includes('lajes') ||
        item.descricao.toLowerCase().includes('fundação')) {
      acc[item.categoria].volumeConcreto += item.quantidade || 0;
    }
    
    return acc;
  }, {} as Record<string, { maoDeObra: number; materiais: number; total: number; quantidade: number; volumeConcreto: number }>);

  // Ordenar categorias na sequência desejada
  const categoriasOrdenadas = ordenarCategorias(Object.keys(dadosPorCategoria));

  // Dados para o gráfico de pizza por categoria
  const dadosPizza = {
    labels: categoriasOrdenadas,
    datasets: [
      {
        data: categoriasOrdenadas.map(cat => dadosPorCategoria[cat].total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Dados para o gráfico de barras (M.O. vs Materiais)
  const dadosBarras = {
    labels: categoriasOrdenadas,
    datasets: [
      {
        label: 'Mão de Obra',
        data: categoriasOrdenadas.map(cat => dadosPorCategoria[cat].maoDeObra),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Materiais',
        data: categoriasOrdenadas.map(cat => dadosPorCategoria[cat].materiais),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de linha (evolução por categoria)
  const dadosLinha = {
    labels: categoriasOrdenadas,
    datasets: [
      {
        label: 'Custo Total',
        data: categoriasOrdenadas.map(cat => dadosPorCategoria[cat].total),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarVolume = (valor: number) => {
    return `${valor.toFixed(2)} m³`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Análise Gráfica - Lote 10x30 - 10 Apartamentos
          </h1>
          <p className="text-gray-600">
            Visualizações detalhadas dos custos estruturais por categoria e volume
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Pizza - Distribuição por Categoria */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🥧 Distribuição de Custos por Categoria
            </h2>
            <div className="h-80">
              <Doughnut 
                data={dadosPizza}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${formatarMoeda(value)} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Gráfico de Barras - M.O. vs Materiais */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📊 Mão de Obra vs Materiais por Categoria
            </h2>
            <div className="h-80">
              <Bar 
                data={dadosBarras}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${formatarMoeda(context.parsed.y)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatarMoeda(value as number);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Linha - Evolução por Categoria */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📈 Evolução de Custos por Categoria
            </h2>
            <div className="h-80">
              <Line 
                data={dadosLinha}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${formatarMoeda(context.parsed.y)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatarMoeda(value as number);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Custo por Volume (Concreto) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🧱 Custo por Volume de Concreto
            </h2>
            <div className="space-y-4">
              {categoriasOrdenadas.map((categoria) => {
                const dados = dadosPorCategoria[categoria];
                const percentual = (dados.total / Object.values(dadosPorCategoria).reduce((sum, d) => sum + d.total, 0)) * 100;
                
                return (
                  <div key={categoria} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">{categoria}</h3>
                      <span className="text-sm text-gray-500">
                        Volume: {formatarVolume(dados.volumeConcreto)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Custo Total</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatarMoeda(dados.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Custo por m³</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatarMoeda(dados.total / dados.volumeConcreto)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {categoriasOrdenadas.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>Nenhum item de concreto encontrado para análise de volume</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resumo Estatístico */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            📊 Resumo Estatístico por Categoria
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriasOrdenadas.map((categoria) => {
              const dados = dadosPorCategoria[categoria];
              const percentual = (dados.total / Object.values(dadosPorCategoria).reduce((sum, d) => sum + d.total, 0)) * 100;
              
              return (
                <div key={categoria} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{categoria}</h3>
                    <span className="text-sm text-gray-500">
                      {percentual.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium text-green-600">
                        {formatarMoeda(dados.total)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">M.O.:</span>
                      <span className="text-gray-800">
                        {formatarMoeda(dados.maoDeObra)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Materiais:</span>
                      <span className="text-gray-800">
                        {formatarMoeda(dados.materiais)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Itens:</span>
                      <span className="text-gray-800">
                        {itens.filter(item => item.categoria === categoria).length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graficos;
