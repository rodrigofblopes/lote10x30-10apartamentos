import React from 'react';
import { OrcamentoItem } from '../types/orcamento';

interface PlanilhaSinteticaProps {
  itens: OrcamentoItem[];
  selectedItems: string[];
  onItemSelect: (item: OrcamentoItem) => void;
}

const PlanilhaSintetica: React.FC<PlanilhaSinteticaProps> = ({ 
  itens, 
  selectedItems, 
  onItemSelect 
}) => {
  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para formatar percentual
  const formatarPercentual = (valor: number) => {
    return `${valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} %`;
  };

  // Função para formatar quantidade
  const formatarQuantidade = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Separar itens em categorias principais e subcategorias
  const categoriasPrincipais = itens.filter(item => item.isEtapaTotal);
  const subcategorias = itens.filter(item => !item.isEtapaTotal);

  // Calcular totais gerais
  const totalMaoObra = itens.reduce((sum, item) => sum + (item.maoDeObra || 0), 0);
  const totalMateriais = itens.reduce((sum, item) => sum + (item.materiais || 0), 0);
  const totalGeral = itens.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cabeçalho da Planilha */}
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-lg font-bold text-center">
          Planilha Orçamentária Sintética Com Valor do Material e da Mão de Obra
        </h2>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {/* Cabeçalho da Tabela */}
          <thead>
            <tr className="bg-blue-50">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase border-b w-20 bg-blue-100">
                Item
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase border-b w-32">
                Descrição
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase border-b w-12">
                Und
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase border-b w-20">
                Quant.
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase border-b w-20">
                M. O.
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase border-b w-20">
                MAT.
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase border-b w-20">
                Total
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase border-b w-16">
                Peso (%)
              </th>
            </tr>
          </thead>

          <tbody>
            {categoriasPrincipais.map((categoria) => {
              const subcategoriasDaCategoria = subcategorias.filter(
                sub => sub.codigo?.startsWith(categoria.codigo || '')
              );

              return (
                <React.Fragment key={categoria.id}>
                  {/* Linha da Categoria Principal */}
                  <tr className="bg-blue-100 font-bold">
                    <td className="px-3 py-3 text-sm text-blue-900 border-b w-20 bg-blue-100 font-bold">
                      {categoria.codigo}
                    </td>
                    <td className="px-3 py-3 text-sm text-blue-900 border-b w-32">
                      {categoria.descricao}
                    </td>
                    <td className="px-3 py-3 text-sm text-blue-900 border-b text-center w-12">
                      -
                    </td>
                    <td className="px-3 py-3 text-sm text-blue-900 border-b text-center w-20">
                      -
                    </td>
                    <td className="px-3 py-3 text-sm text-blue-900 border-b text-center w-20">
                      -
                    </td>
                    <td className="px-3 py-3 text-sm text-blue-900 border-b text-center w-20">
                      -
                    </td>
                    <td className="px-3 py-3 text-sm text-blue-900 border-b text-center font-bold w-20">
                      {formatarMoeda(categoria.total)}
                    </td>
                    <td className="px-3 py-3 text-sm text-blue-900 border-b text-center w-16">
                      {formatarPercentual(categoria.peso)}
                    </td>
                  </tr>

                  {/* Linhas das Subcategorias */}
                  {subcategoriasDaCategoria.map((subcategoria) => {
                    const isSelected = selectedItems.includes(subcategoria.id);
                    
                    return (
                      <tr 
                        key={subcategoria.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'bg-orange-100 border-l-4 border-orange-500 shadow-md' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => onItemSelect(subcategoria)}
                      >
                        <td className={`px-3 py-2 text-sm border-b w-20 font-bold ${
                          isSelected ? 'text-orange-900 bg-orange-200' : 'text-gray-800 bg-gray-50'
                        }`}>
                          {subcategoria.codigo}
                        </td>
                        <td className={`px-3 py-2 text-sm border-b w-32 ${
                          isSelected ? 'text-orange-900 font-bold bg-orange-100' : 'text-gray-700'
                        }`}>
                          {subcategoria.descricao}
                        </td>
                        <td className={`px-3 py-2 text-sm border-b text-center w-12 ${
                          isSelected ? 'text-orange-800 bg-orange-100' : 'text-gray-600'
                        }`}>
                          {subcategoria.unidade || 'm³'}
                        </td>
                        <td className={`px-3 py-2 text-sm border-b text-center w-20 ${
                          isSelected ? 'text-orange-800 bg-orange-100 font-medium' : 'text-gray-600'
                        }`}>
                          {subcategoria.quantidade ? formatarQuantidade(subcategoria.quantidade) : '-'}
                        </td>
                        <td className={`px-3 py-2 text-sm border-b text-center w-20 ${
                          isSelected ? 'text-orange-800 bg-orange-100 font-bold' : 'text-gray-600'
                        }`}>
                          {subcategoria.maoDeObra ? formatarMoeda(subcategoria.maoDeObra) : '-'}
                        </td>
                        <td className={`px-3 py-2 text-sm border-b text-center w-20 ${
                          isSelected ? 'text-orange-800 bg-orange-100 font-bold' : 'text-gray-600'
                        }`}>
                          {subcategoria.materiais ? formatarMoeda(subcategoria.materiais) : '-'}
                        </td>
                        <td className={`px-3 py-2 text-sm border-b text-center font-medium w-20 ${
                          isSelected ? 'text-orange-900 bg-orange-200 font-bold' : 'text-gray-800'
                        }`}>
                          {formatarMoeda(subcategoria.total)}
                        </td>
                        <td className={`px-3 py-2 text-sm border-b text-center w-16 ${
                          isSelected ? 'text-orange-800 bg-orange-100 font-medium' : 'text-gray-600'
                        }`}>
                          {formatarPercentual(subcategoria.peso)}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}

            {/* Linha de Totais Gerais */}
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
              <td className="px-3 py-3 text-sm text-gray-800 border-b w-20 bg-gray-200 font-bold">
                -
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b w-32">
                -
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b text-center w-12">
                -
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b text-center w-20">
                -
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b text-center w-20">
                {formatarMoeda(totalMaoObra)}
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b text-center w-20">
                {formatarMoeda(totalMateriais)}
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b text-center w-20">
                {formatarMoeda(totalGeral)}
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b text-center w-16">
                -
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="bg-gray-50 p-3 border-t">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Categoria Principal</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-50 border border-orange-300 rounded"></div>
            <span>Item Selecionado</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Total Geral</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanilhaSintetica;
