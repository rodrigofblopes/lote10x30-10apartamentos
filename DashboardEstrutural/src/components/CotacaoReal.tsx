import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface ItemCotacao {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  quantidade: number;
  unidade: string;
  sinapiMO: number;
  sinapiMat: number;
  sinapiTotal: number;
  realMO: number;
  realMat: number;
  realTotal: number;
  economia: number;
  percentualEconomia: number;
  custoPorM2: number;
  peso: number;
}

const CotacaoReal: React.FC = () => {
  const [itens, setItens] = useState<ItemCotacao[]>([]);
  const [areaTotal, setAreaTotal] = useState(298); // Área total do projeto em m²

  useEffect(() => {
    // Dados reais extraídos da planilha SINAPI
    const dadosReais: ItemCotacao[] = [
      // FUNDAÇÃO
      {
        id: '1.1.1',
        codigo: '92761',
        descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM',
        categoria: 'Fundação',
        subcategoria: 'Vigas',
        quantidade: 390.9,
        unidade: 'KG',
        sinapiMO: 15.05,
        sinapiMat: 1.94,
        sinapiTotal: 5883.04,
        realMO: 15.05,
        realMat: 1.94,
        realTotal: 5883.04,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 19.74,
        peso: 4.62
      },
      {
        id: '1.1.2',
        codigo: '94965',
        descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 - PREPARO MECÂNICO COM BETONEIRA 400 L',
        categoria: 'Fundação',
        subcategoria: 'Vigas',
        quantidade: 5.9,
        unidade: 'm³',
        sinapiMO: 74.24,
        sinapiMat: 666.30,
        sinapiTotal: 4369.18,
        realMO: 74.24,
        realMat: 666.30,
        realTotal: 4369.18,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 14.66,
        peso: 3.43
      },
      {
        id: '1.1.3',
        codigo: '96533',
        descricao: 'FABRICAÇÃO, MONTAGEM E DESMONTAGEM DE FÔRMA PARA VIGA BALDRAME, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES',
        categoria: 'Fundação',
        subcategoria: 'Vigas',
        quantidade: 98.6,
        unidade: 'm²',
        sinapiMO: 42.37,
        sinapiMat: 50.65,
        sinapiTotal: 9171.77,
        realMO: 42.37,
        realMat: 50.65,
        realTotal: 9171.77,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 30.78,
        peso: 7.20
      },
      {
        id: '1.2.1',
        codigo: '92763',
        descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 12,5 MM - MONTAGEM',
        categoria: 'Fundação',
        subcategoria: 'Pilares',
        quantidade: 204.3,
        unidade: 'KG',
        sinapiMO: 11.33,
        sinapiMat: 0.80,
        sinapiTotal: 2314.71,
        realMO: 11.33,
        realMat: 0.80,
        realTotal: 2314.71,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 7.77,
        peso: 1.82
      },
      {
        id: '1.2.2',
        codigo: '94965',
        descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 - PREPARO MECÂNICO COM BETONEIRA 400 L',
        categoria: 'Fundação',
        subcategoria: 'Pilares',
        quantidade: 1.4,
        unidade: 'm³',
        sinapiMO: 74.24,
        sinapiMat: 666.30,
        sinapiTotal: 1036.75,
        realMO: 74.24,
        realMat: 666.30,
        realTotal: 1036.75,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 3.48,
        peso: 0.81
      },
      {
        id: '1.2.3',
        codigo: '92417',
        descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA DE PILARES RETANGULARES, EM CHAPA DE MADEIRA COMPENSADA RESINADA, 2 UTILIZAÇÕES',
        categoria: 'Fundação',
        subcategoria: 'Pilares',
        quantidade: 29,
        unidade: 'm²',
        sinapiMO: 73.34,
        sinapiMat: 131.70,
        sinapiTotal: 5946.16,
        realMO: 73.34,
        realMat: 131.70,
        realTotal: 5946.16,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 19.95,
        peso: 4.67
      },
      {
        id: '1.3.1',
        codigo: '104918',
        descricao: 'ARMAÇÃO DE SAPATA ISOLADA, VIGA BALDRAME E SAPATA CORRIDA UTILIZANDO AÇO CA-50 DE 8 MM - MONTAGEM',
        categoria: 'Fundação',
        subcategoria: 'Fundações',
        quantidade: 171.3,
        unidade: 'KG',
        sinapiMO: 17.28,
        sinapiMat: 3.65,
        sinapiTotal: 2960.06,
        realMO: 17.28,
        realMat: 3.65,
        realTotal: 2960.06,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 9.93,
        peso: 2.32
      },
      {
        id: '1.3.2',
        codigo: '94965',
        descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 - PREPARO MECÂNICO COM BETONEIRA 400 L',
        categoria: 'Fundação',
        subcategoria: 'Fundações',
        quantidade: 5.4,
        unidade: 'm³',
        sinapiMO: 74.24,
        sinapiMat: 666.30,
        sinapiTotal: 3998.91,
        realMO: 74.24,
        realMat: 666.30,
        realTotal: 3998.91,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 13.42,
        peso: 3.14
      },
      {
        id: '1.3.3',
        codigo: '96532',
        descricao: 'FABRICAÇÃO, MONTAGEM E DESMONTAGEM DE FÔRMA PARA SAPATA, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES',
        categoria: 'Fundação',
        subcategoria: 'Fundações',
        quantidade: 19.2,
        unidade: 'm²',
        sinapiMO: 106.86,
        sinapiMat: 78.58,
        sinapiTotal: 3560.44,
        realMO: 106.86,
        realMat: 78.58,
        realTotal: 3560.44,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 11.95,
        peso: 2.80
      },
      // TÉRREO
      {
        id: '2.1.1',
        codigo: '92761',
        descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM',
        categoria: 'Térreo',
        subcategoria: 'Vigas',
        quantidade: 486.2,
        unidade: 'KG',
        sinapiMO: 15.05,
        sinapiMat: 1.94,
        sinapiTotal: 7317.31,
        realMO: 15.05,
        realMat: 1.94,
        realTotal: 7317.31,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 24.55,
        peso: 5.75
      },
      {
        id: '2.1.2',
        codigo: '94965',
        descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 - PREPARO MECÂNICO COM BETONEIRA 400 L',
        categoria: 'Térreo',
        subcategoria: 'Vigas',
        quantidade: 6.2,
        unidade: 'm³',
        sinapiMO: 74.24,
        sinapiMat: 666.30,
        sinapiTotal: 4591.34,
        realMO: 74.24,
        realMat: 666.30,
        realTotal: 4591.34,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 15.41,
        peso: 3.61
      },
      {
        id: '2.1.3',
        codigo: '96533',
        descricao: 'FABRICAÇÃO, MONTAGEM E DESMONTAGEM DE FÔRMA PARA VIGA BALDRAME, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES',
        categoria: 'Térreo',
        subcategoria: 'Vigas',
        quantidade: 58.8,
        unidade: 'm²',
        sinapiMO: 42.37,
        sinapiMat: 50.65,
        sinapiTotal: 5469.57,
        realMO: 42.37,
        realMat: 50.65,
        realTotal: 5469.57,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 18.35,
        peso: 4.30
      },
      {
        id: '2.2.1',
        codigo: '92763',
        descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 12,5 MM - MONTAGEM',
        categoria: 'Térreo',
        subcategoria: 'Pilares',
        quantidade: 358,
        unidade: 'KG',
        sinapiMO: 11.33,
        sinapiMat: 0.80,
        sinapiTotal: 4056.14,
        realMO: 11.33,
        realMat: 0.80,
        realTotal: 4056.14,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 13.61,
        peso: 3.19
      },
      {
        id: '2.2.2',
        codigo: '94965',
        descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 - PREPARO MECÂNICO COM BETONEIRA 400 L',
        categoria: 'Térreo',
        subcategoria: 'Pilares',
        quantidade: 3.8,
        unidade: 'm³',
        sinapiMO: 74.24,
        sinapiMat: 666.30,
        sinapiTotal: 2814.05,
        realMO: 74.24,
        realMat: 666.30,
        realTotal: 2814.05,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 9.44,
        peso: 2.21
      },
      {
        id: '2.2.3',
        codigo: '92417',
        descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA DE PILARES RETANGULARES, EM CHAPA DE MADEIRA COMPENSADA RESINADA, 2 UTILIZAÇÕES',
        categoria: 'Térreo',
        subcategoria: 'Pilares',
        quantidade: 75.6,
        unidade: 'm²',
        sinapiMO: 73.34,
        sinapiMat: 131.70,
        sinapiTotal: 15501.02,
        realMO: 73.34,
        realMat: 131.70,
        realTotal: 15501.02,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 52.02,
        peso: 12.17
      },
      {
        id: '2.3.1',
        codigo: '92769',
        descricao: 'ARMAÇÃO DE LAJE DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 6,3 MM - MONTAGEM',
        categoria: 'Térreo',
        subcategoria: 'Lajes',
        quantidade: 173,
        unidade: 'KG',
        sinapiMO: 15.36,
        sinapiMat: 2.43,
        sinapiTotal: 2657.28,
        realMO: 15.36,
        realMat: 2.43,
        realTotal: 2657.28,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 8.92,
        peso: 2.09
      },
      {
        id: '2.3.2',
        codigo: '94965',
        descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 - PREPARO MECÂNICO COM BETONEIRA 400 L',
        categoria: 'Térreo',
        subcategoria: 'Lajes',
        quantidade: 6.7,
        unidade: 'm³',
        sinapiMO: 74.24,
        sinapiMat: 666.30,
        sinapiTotal: 4961.61,
        realMO: 74.24,
        realMat: 666.30,
        realTotal: 4961.61,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 16.65,
        peso: 3.90
      },
      // PAVIMENTO SUPERIOR
      {
        id: '3.1.1',
        codigo: '92761',
        descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM',
        categoria: 'Pavimento Superior',
        subcategoria: 'Vigas',
        quantidade: 390.9,
        unidade: 'KG',
        sinapiMO: 15.05,
        sinapiMat: 1.94,
        sinapiTotal: 5883.04,
        realMO: 15.05,
        realMat: 1.94,
        realTotal: 5883.04,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 19.74,
        peso: 4.62
      },
      {
        id: '3.1.2',
        codigo: '96533',
        descricao: 'FABRICAÇÃO, MONTAGEM E DESMONTAGEM DE FÔRMA PARA VIGA BALDRAME, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES',
        categoria: 'Pavimento Superior',
        subcategoria: 'Vigas',
        quantidade: 90.6,
        unidade: 'm²',
        sinapiMO: 42.37,
        sinapiMat: 50.65,
        sinapiTotal: 8427.61,
        realMO: 42.37,
        realMat: 50.65,
        realTotal: 8427.61,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 28.28,
        peso: 6.62
      },
      {
        id: '3.2',
        codigo: '94965',
        descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 - PREPARO MECÂNICO COM BETONEIRA 400 L',
        categoria: 'Pavimento Superior',
        subcategoria: 'Vigas',
        quantidade: 5.9,
        unidade: 'm³',
        sinapiMO: 74.24,
        sinapiMat: 666.30,
        sinapiTotal: 4369.18,
        realMO: 74.24,
        realMat: 666.30,
        realTotal: 4369.18,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 14.66,
        peso: 3.43
      },
      {
        id: '3.3.1',
        codigo: '94965',
        descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 - PREPARO MECÂNICO COM BETONEIRA 400 L',
        categoria: 'Pavimento Superior',
        subcategoria: 'Pilares',
        quantidade: 3.8,
        unidade: 'm³',
        sinapiMO: 74.24,
        sinapiMat: 666.30,
        sinapiTotal: 2814.05,
        realMO: 74.24,
        realMat: 666.30,
        realTotal: 2814.05,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 9.44,
        peso: 2.21
      },
      {
        id: '3.4',
        codigo: '92763',
        descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 12,5 MM - MONTAGEM',
        categoria: 'Pavimento Superior',
        subcategoria: 'Pilares',
        quantidade: 330.3,
        unidade: 'KG',
        sinapiMO: 11.33,
        sinapiMat: 0.80,
        sinapiTotal: 3742.29,
        realMO: 11.33,
        realMat: 0.80,
        realTotal: 3742.29,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 12.56,
        peso: 2.94
      },
      {
        id: '3.5',
        codigo: '92417',
        descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA DE PILARES RETANGULARES, EM CHAPA DE MADEIRA COMPENSADA RESINADA, 2 UTILIZAÇÕES',
        categoria: 'Pavimento Superior',
        subcategoria: 'Pilares',
        quantidade: 75.6,
        unidade: 'm²',
        sinapiMO: 73.34,
        sinapiMat: 131.70,
        sinapiTotal: 15501.02,
        realMO: 73.34,
        realMat: 131.70,
        realTotal: 15501.02,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 52.02,
        peso: 12.17
      }
    ];

    // Calcular custo por m² inicial
    const itensComCustoPorM2 = dadosReais.map(item => ({
      ...item,
      custoPorM2: item.sinapiTotal / areaTotal
    }));

    setItens(itensComCustoPorM2);
  }, [areaTotal]);

  const handleValorChange = (id: string, campo: 'realMO' | 'realMat', valor: number) => {
    setItens(prevItens => 
      prevItens.map(item => {
        if (item.id === id) {
          const novoRealMO = campo === 'realMO' ? valor : item.realMO;
          const novoRealMat = campo === 'realMat' ? valor : item.realMat;
          const novoRealTotal = novoRealMO * item.quantidade + novoRealMat * item.quantidade;
          const novaEconomia = item.sinapiTotal - novoRealTotal;
          const novoPercentualEconomia = (novaEconomia / item.sinapiTotal) * 100;
          const novoCustoPorM2 = novoRealTotal / areaTotal;

          return {
            ...item,
            realMO: novoRealMO,
            realMat: novoRealMat,
            realTotal: novoRealTotal,
            economia: novaEconomia,
            percentualEconomia: novoPercentualEconomia,
            custoPorM2: novoCustoPorM2
          };
        }
        return item;
      })
    );
  };

  const handleAreaChange = (novaArea: number) => {
    setAreaTotal(novaArea);
    setItens(prevItens => 
      prevItens.map(item => ({
        ...item,
        custoPorM2: item.realTotal / novaArea
      }))
    );
  };

  const totalSINAPI = itens.reduce((sum, item) => sum + item.sinapiTotal, 0);
  const totalReal = itens.reduce((sum, item) => sum + item.realTotal, 0);
  const totalEconomia = itens.reduce((sum, item) => sum + item.economia, 0);
  const totalCustoPorM2 = totalReal / areaTotal;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarNumero = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            💰 Cotação Real - Lote 10x30 - 10 Apartamentos
          </h1>
          <p className="text-gray-600">
            Compare valores SINAPI reais com cotações do mercado
          </p>
        </div>

        {/* Controles de Área */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <label className="text-lg font-semibold text-gray-700">
                Área Total do Projeto:
              </label>
              <input
                type="number"
                value={areaTotal}
                onChange={(e) => handleAreaChange(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg text-lg font-medium text-gray-800 w-32"
                min="1"
              />
              <span className="text-lg text-gray-600">m²</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatarMoeda(totalCustoPorM2)}
              </div>
              <div className="text-sm text-gray-600">Custo Total por m²</div>
            </div>
          </div>
        </div>

        {/* Planilha de Cotação */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Calculator className="h-6 w-6 mr-2 text-green-600" />
              Planilha de Cotação - Dados Reais SINAPI
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cat.
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qtd
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Unit.
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SINAPI M.O.
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SINAPI Mat.
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SINAPI Total
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Real M.O.
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Real Mat.
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Real Total
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo/m²
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Economia
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {itens.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4 text-xs text-gray-500 font-mono">
                      {item.codigo}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{item.descricao}</div>
                        <div className="text-xs text-gray-500">{item.subcategoria}</div>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-xs text-gray-900">{item.categoria}</td>
                    <td className="px-2 py-4 text-xs text-gray-900">
                      {item.quantidade} {item.unidade}
                    </td>
                    <td className="px-2 py-4 text-xs text-gray-900">
                      {formatarMoeda(item.sinapiMO + item.sinapiMat)}
                    </td>
                    <td className="px-2 py-4 text-xs text-gray-900">
                      {formatarMoeda(item.sinapiMO)}
                    </td>
                    <td className="px-2 py-4 text-xs text-gray-900">
                      {formatarMoeda(item.sinapiMat)}
                    </td>
                    <td className="px-2 py-4 text-xs font-medium text-green-600">
                      {formatarMoeda(item.sinapiTotal)}
                    </td>
                    <td className="px-2 py-4">
                      <input
                        type="number"
                        value={item.realMO}
                        onChange={(e) => handleValorChange(item.id, 'realMO', Number(e.target.value))}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-xs text-blue-600 font-medium"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="px-2 py-4">
                      <input
                        type="number"
                        value={item.realMat}
                        onChange={(e) => handleValorChange(item.id, 'realMat', Number(e.target.value))}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-xs text-purple-600 font-medium"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="px-2 py-4 text-xs font-medium text-blue-600">
                      {formatarMoeda(item.realTotal)}
                    </td>
                    <td className="px-2 py-4 text-xs font-medium text-orange-600">
                      {formatarMoeda(item.custoPorM2)}
                    </td>
                    <td className="px-2 py-4 text-xs font-medium text-green-600">
                      {formatarMoeda(item.economia)}
                    </td>
                    <td className="px-2 py-4">
                      <span className={`inline-flex items-center px-1 py-1 rounded-full text-xs font-medium ${
                        item.percentualEconomia > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.percentualEconomia > 0 ? '+' : ''}{formatarNumero(item.percentualEconomia)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            📊 Resumo Executivo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatarMoeda(totalSINAPI)}
              </div>
              <div className="text-sm text-green-700">Total SINAPI</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatarMoeda(totalReal)}
              </div>
              <div className="text-sm text-blue-700">Total Real</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {formatarMoeda(totalCustoPorM2)}
              </div>
              <div className="text-sm text-orange-700">Custo por m²</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatarMoeda(totalEconomia)}
              </div>
              <div className="text-sm text-green-700">Economia Total</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">
                Percentual de Economia:
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatarNumero((totalEconomia / totalSINAPI) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            💡 Como Usar a Cotação Real:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="mb-2"><strong>1.</strong> Dados reais extraídos da planilha SINAPI oficial</p>
              <p className="mb-2"><strong>2.</strong> Edite os valores de "Real M.O." e "Real Mat."</p>
              <p className="mb-2"><strong>3.</strong> Veja o custo por m² calculado automaticamente</p>
            </div>
            <div>
              <p className="mb-2"><strong>4.</strong> Compare com valores SINAPI para negociação</p>
              <p className="mb-2"><strong>5.</strong> Monitore a economia total e percentual</p>
              <p className="mb-2"><strong>6.</strong> Use para fechar contratos com mão de obra</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CotacaoReal;
