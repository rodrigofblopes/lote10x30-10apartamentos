import { OrcamentoItem } from '../types/orcamento';

// Dados reais baseados na planilha CSV do Lote 10x30 - 10 Apartamentos
// Área total: 298 m² (149 m² por pavimento)
export const dadosMockados: OrcamentoItem[] = [
  // FUNDAÇÃO - Total: R$ 39.241,02 (30,81%)
  {
    id: '1.1.1',
    codigo: '92761',
    nome: 'Fundação - Vigas - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM. AF_06/2022',
    categoria: 'Fundação',
    subcategoria: 'Vigas',
    unidade: 'KG',
    quantidade: 390.9,
    valorUnitario: 15.05,
    maoDeObra: 758.34,
    materiais: 5124.70,
    total: 5883.04,
    area: 149, // Área do pavimento térreo
    peso: 4.62
  },
  {
    id: '1.1.2',
    codigo: '94965',
    nome: 'Fundação - Vigas - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Fundação',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 5.9,
    valorUnitario: 740.54,
    maoDeObra: 438.01,
    materiais: 3931.17,
    total: 4369.18,
    area: 149, // Área do pavimento térreo
    peso: 3.43
  },
  {
    id: '1.1.3',
    codigo: '96533',
    nome: 'Fundação - Vigas - Formas',
    descricao: 'FABRICAÇÃO, MONTAGEM E DESMONTAGEM DE FÔRMA PARA VIGA BALDRAME, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES. AF_01/2024',
    categoria: 'Fundação',
    subcategoria: 'Vigas',
    unidade: 'm²',
    quantidade: 98.6,
    valorUnitario: 93.02,
    maoDeObra: 4177.68,
    materiais: 4994.09,
    total: 9171.77,
    area: 149, // Área do pavimento térreo
    peso: 7.20
  },
  {
    id: '1.2.1',
    codigo: '92763',
    nome: 'Fundação - Pilares - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 12,5 MM - MONTAGEM. AF_06/2022',
    categoria: 'Fundação',
    subcategoria: 'Pilares',
    unidade: 'KG',
    quantidade: 204.3,
    valorUnitario: 11.33,
    maoDeObra: 163.44,
    materiais: 2151.27,
    total: 2314.71,
    area: 149, // Área do pavimento térreo
    peso: 1.82
  },
  {
    id: '1.2.2',
    codigo: '94965',
    nome: 'Fundação - Pilares - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Fundação',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 1.4,
    valorUnitario: 740.54,
    maoDeObra: 103.93,
    materiais: 932.82,
    total: 1036.75,
    area: 149, // Área do pavimento térreo
    peso: 0.81
  },
  {
    id: '1.2.3',
    codigo: '92417',
    nome: 'Fundação - Pilares - Formas',
    descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA DE PILARES RETANGULARES E ESTRUTURAS SIMILARES, PÉ-DIREITO DUPLO, EM CHAPA DE MADEIRA COMPENSADA RESINADA, 2 UTILIZAÇÕES. AF_09/2020',
    categoria: 'Fundação',
    subcategoria: 'Pilares',
    unidade: 'm²',
    quantidade: 29,
    valorUnitario: 205.04,
    maoDeObra: 2126.86,
    materiais: 3819.30,
    total: 5946.16,
    area: 149, // Área do pavimento térreo
    peso: 4.67
  },
  {
    id: '1.3.1',
    codigo: '104918',
    nome: 'Fundação - Sapatas - Armação',
    descricao: 'ARMAÇÃO DE SAPATA ISOLADA, VIGA BALDRAME E SAPATA CORRIDA UTILIZANDO AÇO CA-50 DE 8 MM - MONTAGEM. AF_01/2024',
    categoria: 'Fundação',
    subcategoria: 'Fundações',
    unidade: 'KG',
    quantidade: 171.3,
    valorUnitario: 17.28,
    maoDeObra: 625.24,
    materiais: 2334.82,
    total: 2960.06,
    area: 149, // Área do pavimento térreo
    peso: 2.32
  },
  {
    id: '1.3.2',
    codigo: '94965',
    nome: 'Fundação - Sapatas - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Fundação',
    subcategoria: 'Fundações',
    unidade: 'm³',
    quantidade: 5.4,
    valorUnitario: 740.54,
    maoDeObra: 400.89,
    materiais: 3598.02,
    total: 3998.91,
    area: 149, // Área do pavimento térreo
    peso: 3.14
  },
  {
    id: '1.3.3',
    codigo: '96532',
    nome: 'Fundação - Sapatas - Formas',
    descricao: 'FABRICAÇÃO, MONTAGEM E DESMONTAGEM DE FÔRMA PARA SAPATA, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES. AF_01/2024',
    categoria: 'Fundação',
    subcategoria: 'Fundações',
    unidade: 'm²',
    quantidade: 19.2,
    valorUnitario: 185.44,
    maoDeObra: 2051.71,
    materiais: 1508.73,
    total: 3560.44,
    area: 149, // Área do pavimento térreo
    peso: 2.80
  },

  // TÉRREO - Total: R$ 47.368,32 (37,20%) - Área: 149 m²
  {
    id: '2.1.1',
    codigo: '92761',
    nome: 'Térreo - Vigas - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM. AF_06/2022',
    categoria: 'Térreo',
    subcategoria: 'Vigas',
    unidade: 'KG',
    quantidade: 486.2,
    valorUnitario: 15.05,
    maoDeObra: 943.22,
    materiais: 6374.09,
    total: 7317.31,
    area: 149, // Área do pavimento térreo
    peso: 5.75
  },
  {
    id: '2.1.2',
    codigo: '94965',
    nome: 'Térreo - Vigas - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Térreo',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 6.2,
    valorUnitario: 740.54,
    maoDeObra: 460.28,
    materiais: 4131.06,
    total: 4591.34,
    area: 149, // Área do pavimento térreo
    peso: 3.61
  },
  {
    id: '2.1.3',
    codigo: '96533',
    nome: 'Térreo - Vigas - Formas',
    descricao: 'FABRICAÇÃO, MONTAGEM E DESMONTAGEM DE FÔRMA PARA VIGA BALDRAME, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES. AF_01/2024',
    categoria: 'Térreo',
    subcategoria: 'Vigas',
    unidade: 'm²',
    quantidade: 58.8,
    valorUnitario: 93.02,
    maoDeObra: 2491.35,
    materiais: 2978.22,
    total: 5469.57,
    area: 149, // Área do pavimento térreo
    peso: 4.30
  },
  {
    id: '2.2.1',
    codigo: '92763',
    nome: 'Térreo - Pilares - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 12,5 MM - MONTAGEM. AF_06/2022',
    categoria: 'Térreo',
    subcategoria: 'Pilares',
    unidade: 'KG',
    quantidade: 358,
    valorUnitario: 11.33,
    maoDeObra: 286.40,
    materiais: 3769.74,
    total: 4056.14,
    area: 149, // Área do pavimento térreo
    peso: 3.19
  },
  {
    id: '2.2.2',
    codigo: '94965',
    nome: 'Térreo - Pilares - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Térreo',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 3.8,
    valorUnitario: 740.54,
    maoDeObra: 282.11,
    materiais: 2531.94,
    total: 2814.05,
    area: 149, // Área do pavimento térreo
    peso: 2.21
  },
  {
    id: '2.2.3',
    codigo: '92417',
    nome: 'Térreo - Pilares - Formas',
    descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA DE PILARES RETANGULARES E ESTRUTURAS SIMILARES, PÉ-DIREITO DUPLO, EM CHAPA DE MADEIRA COMPENSADA RESINADA, 2 UTILIZAÇÕES. AF_09/2020',
    categoria: 'Térreo',
    subcategoria: 'Pilares',
    unidade: 'm²',
    quantidade: 75.6,
    valorUnitario: 205.04,
    maoDeObra: 5544.50,
    materiais: 9956.52,
    total: 15501.02,
    area: 149, // Área do pavimento térreo
    peso: 12.17
  },
  {
    id: '2.3.1',
    codigo: '92769',
    nome: 'Térreo - Lajes - Armação',
    descricao: 'ARMAÇÃO DE LAJE DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 6,3 MM - MONTAGEM. AF_06/2022',
    categoria: 'Térreo',
    subcategoria: 'Lajes',
    unidade: 'KG',
    quantidade: 173,
    valorUnitario: 15.36,
    maoDeObra: 420.39,
    materiais: 2236.89,
    total: 2657.28,
    area: 149, // Área do pavimento térreo
    peso: 2.09
  },
  {
    id: '2.3.2',
    codigo: '94965',
    nome: 'Térreo - Lajes - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Térreo',
    subcategoria: 'Lajes',
    unidade: 'm³',
    quantidade: 6.7,
    valorUnitario: 740.54,
    maoDeObra: 497.40,
    materiais: 4464.21,
    total: 4961.61,
    area: 149, // Área do pavimento térreo
    peso: 3.90
  },

  // PAVIMENTO SUPERIOR - Total: R$ 40.737,19 (31,99%) - Área: 149 m²
  {
    id: '3.1.1',
    codigo: '92761',
    nome: 'Pavimento Superior - Vigas - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM. AF_06/2022',
    categoria: 'Pavimento Superior',
    subcategoria: 'Vigas',
    unidade: 'KG',
    quantidade: 390.9,
    valorUnitario: 15.05,
    maoDeObra: 758.34,
    materiais: 5124.70,
    total: 5883.04,
    area: 149, // Área do pavimento superior
    peso: 4.62
  },
  {
    id: '3.1.2',
    codigo: '96533',
    nome: 'Pavimento Superior - Vigas - Formas',
    descricao: 'FABRICAÇÃO, MONTAGEM E DESMONTAGEM DE FÔRMA PARA VIGA BALDRAME, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES. AF_01/2024',
    categoria: 'Pavimento Superior',
    subcategoria: 'Vigas',
    unidade: 'm²',
    quantidade: 90.6,
    valorUnitario: 93.02,
    maoDeObra: 3838.72,
    materiais: 4588.89,
    total: 8427.61,
    area: 149, // Área do pavimento superior
    peso: 6.62
  },
  {
    id: '3.2',
    codigo: '94965',
    nome: 'Pavimento Superior - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Pavimento Superior',
    subcategoria: 'Concreto',
    unidade: 'm³',
    quantidade: 5.9,
    valorUnitario: 740.54,
    maoDeObra: 438.01,
    materiais: 3931.17,
    total: 4369.18,
    area: 149, // Área do pavimento superior
    peso: 3.43
  },
  {
    id: '3.3.1',
    codigo: '94965',
    nome: 'Pavimento Superior - Pilares - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Pavimento Superior',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 3.8,
    valorUnitario: 740.54,
    maoDeObra: 282.11,
    materiais: 2531.94,
    total: 2814.05,
    area: 149, // Área do pavimento superior
    peso: 2.21
  },
  {
    id: '3.4',
    codigo: '92763',
    nome: 'Pavimento Superior - Pilares - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 12,5 MM - MONTAGEM. AF_06/2022',
    categoria: 'Pavimento Superior',
    subcategoria: 'Pilares',
    unidade: 'KG',
    quantidade: 330.3,
    valorUnitario: 11.33,
    maoDeObra: 264.24,
    materiais: 3478.05,
    total: 3742.29,
    area: 149, // Área do pavimento superior
    peso: 2.94
  },
  {
    id: '3.5',
    codigo: '92417',
    nome: 'Pavimento Superior - Pilares - Formas',
    descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA DE PILARES RETANGULARES E ESTRUTURAS SIMILARES, PÉ-DIREITO DUPLO, EM CHAPA DE MADEIRA COMPENSADA RESINADA, 2 UTILIZAÇÕES. AF_09/2020',
    categoria: 'Pavimento Superior',
    subcategoria: 'Pilares',
    unidade: 'm²',
    quantidade: 75.6,
    valorUnitario: 205.04,
    maoDeObra: 5544.50,
    materiais: 9956.52,
    total: 15501.02,
    area: 149, // Área do pavimento superior
    peso: 12.17
  }
];

export const carregarDados = async (): Promise<OrcamentoItem[]> => {
  // Simula carregamento assíncrono
  await new Promise(resolve => setTimeout(resolve, 1000));
  return dadosMockados;
};

// Funções para processar dados reais (placeholder)
export const processarDadosCSV = (_csvData: string): OrcamentoItem[] => {
  // Implementar parsing de CSV
  return [];
};

export const processarDadosExcel = (_excelData: ArrayBuffer): OrcamentoItem[] => {
  // Implementar parsing de Excel
  return [];
};
