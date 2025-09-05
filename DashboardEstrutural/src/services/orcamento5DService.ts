import { OrcamentoItem } from '../types/orcamento';
import * as XLSX from 'xlsx';

// Dados mockados específicos para o 5D (baseados na planilha 5DEST.xlsx)
export const dadosMockados5D: OrcamentoItem[] = [
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
    area: 149,
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
    area: 149,
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
    area: 149,
    peso: 7.20
  },
  {
    id: '1.2.1',
    codigo: '92761',
    nome: 'Fundação - Pilares - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM. AF_06/2022',
    categoria: 'Fundação',
    subcategoria: 'Pilares',
    unidade: 'KG',
    quantidade: 486.2,
    valorUnitario: 15.05,
    maoDeObra: 943.22,
    materiais: 6374.09,
    total: 7317.31,
    area: 149,
    peso: 5.75
  },
  {
    id: '1.2.2',
    codigo: '94965',
    nome: 'Fundação - Pilares - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Fundação',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 6.2,
    valorUnitario: 740.54,
    maoDeObra: 460.28,
    materiais: 4131.06,
    total: 4591.34,
    area: 149,
    peso: 3.61
  },
  {
    id: '1.3.1',
    codigo: '104918',
    nome: 'Fundação - Fundações - Armação',
    descricao: 'ARMAÇÃO DE SAPATA ISOLADA DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM. AF_06/2022',
    categoria: 'Fundação',
    subcategoria: 'Fundações',
    unidade: 'KG',
    quantidade: 171.3,
    valorUnitario: 17.28,
    maoDeObra: 625.24,
    materiais: 2334.82,
    total: 2960.06,
    area: 149,
    peso: 2.32
  },
  {
    id: '1.3.2',
    codigo: '94965',
    nome: 'Fundação - Fundações - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Fundação',
    subcategoria: 'Fundações',
    unidade: 'm³',
    quantidade: 5.4,
    valorUnitario: 740.54,
    maoDeObra: 400.89,
    materiais: 3598.02,
    total: 3998.91,
    area: 149,
    peso: 3.14
  },
  // TÉRREO - Total: R$ 47.368,32 (37,20%)
  {
    id: '2.1.1',
    codigo: '92761',
    nome: 'Térreo - Vigas - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM. AF_06/2022',
    categoria: 'Térreo',
    subcategoria: 'Vigas',
    unidade: 'KG',
    quantidade: 358.0,
    valorUnitario: 15.05,
    maoDeObra: 286.40,
    materiais: 3769.74,
    total: 4056.14,
    area: 149,
    peso: 3.18
  },
  {
    id: '2.1.2',
    codigo: '94965',
    nome: 'Térreo - Vigas - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Térreo',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 3.8,
    valorUnitario: 740.54,
    maoDeObra: 282.11,
    materiais: 2531.94,
    total: 2814.05,
    area: 149,
    peso: 2.21
  },
  {
    id: '2.2.1',
    codigo: '92761',
    nome: 'Térreo - Pilares - Armação',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO UTILIZANDO AÇO CA-50 DE 8,0 MM - MONTAGEM. AF_06/2022',
    categoria: 'Térreo',
    subcategoria: 'Pilares',
    unidade: 'KG',
    quantidade: 204.3,
    valorUnitario: 15.05,
    maoDeObra: 163.44,
    materiais: 2151.27,
    total: 2314.71,
    area: 149,
    peso: 1.82
  },
  {
    id: '2.2.2',
    codigo: '94965',
    nome: 'Térreo - Pilares - Concreto',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (EM MASSA SECA DE CIMENTO/ AREIA MÉDIA/ BRITA 1) - PREPARO MECÂNICO COM BETONEIRA 400 L. AF_05/2021',
    categoria: 'Térreo',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 1.4,
    valorUnitario: 740.54,
    maoDeObra: 103.93,
    materiais: 932.82,
    total: 1036.75,
    area: 149,
    peso: 0.81
  },
  {
    id: '2.3.1',
    codigo: '92417',
    nome: 'Térreo - Lajes - Formas',
    descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA PARA LAJE MACIÇA DE CONCRETO ARMADO, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES. AF_01/2024',
    categoria: 'Térreo',
    subcategoria: 'Lajes',
    unidade: 'm²',
    quantidade: 29.0,
    valorUnitario: 204.97,
    maoDeObra: 2126.86,
    materiais: 3819.30,
    total: 5946.16,
    area: 149,
    peso: 4.67
  },
  {
    id: '2.3.2',
    codigo: '92417',
    nome: 'Térreo - Lajes - Formas (Adicional)',
    descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA PARA LAJE MACIÇA DE CONCRETO ARMADO, EM MADEIRA SERRADA, E=25 MM, 2 UTILIZAÇÕES. AF_01/2024',
    categoria: 'Térreo',
    subcategoria: 'Lajes',
    unidade: 'm²',
    quantidade: 75.6,
    valorUnitario: 204.97,
    maoDeObra: 5544.50,
    materiais: 9956.52,
    total: 15501.02,
    area: 149,
    peso: 12.17
  }
];

// Função para processar dados do Excel 5DEST.xlsx (separado por etapas)
export const processarDadosExcel5D = (excelData: ArrayBuffer): OrcamentoItem[] => {
  const workbook = XLSX.read(excelData, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Converter para JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  const dados: OrcamentoItem[] = [];
  
  // Pular as primeiras linhas (cabeçalho)
  for (let i = 3; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    
    if (!row || row.length < 12) continue;
    
    const item = row[0]?.toString().trim();
    const descricao = row[1]?.toString().trim();
    const unidade = row[2]?.toString().trim();
    const quantidade = parseFloat(row[3]?.toString().replace(',', '.') || '0');
    const totalUnit = parseFloat(row[7]?.toString().replace(',', '.') || '0');
    const maoDeObraTotal = parseFloat(row[8]?.toString().replace(',', '.') || '0');
    const materiaisTotal = parseFloat(row[9]?.toString().replace(',', '.') || '0');
    const totalFinal = parseFloat(row[10]?.toString().replace(',', '.') || '0');
    const pesoPercentual = parseFloat(row[11]?.toString().replace('%', '').replace(',', '.') || '0');
    
    // Pular linhas de cabeçalho ou totais
    if (!item || !descricao || quantidade <= 0 || 
        descricao.includes('Fundação') || descricao.includes('Térreo') || 
        descricao.includes('Pavimento Superior') || descricao.includes('Totais')) {
      continue;
    }
    
    // Determinar categoria e subcategoria baseado no item
    let categoria = 'Fundação';
    let subcategoria = 'Outros';
    
    if (item.startsWith('1.')) {
      categoria = 'Fundação';
      if (item.includes('1.1')) subcategoria = 'Vigas';
      else if (item.includes('1.2')) subcategoria = 'Pilares';
      else if (item.includes('1.3')) subcategoria = 'Fundações';
    } else if (item.startsWith('2.')) {
      categoria = 'Térreo';
      if (item.includes('2.1')) subcategoria = 'Vigas';
      else if (item.includes('2.2')) subcategoria = 'Pilares';
      else if (item.includes('2.3')) subcategoria = 'Lajes';
    } else if (item.startsWith('3.')) {
      categoria = 'Pavimento Superior';
      if (item.includes('3.1')) subcategoria = 'Vigas';
      else if (item.includes('3.2')) subcategoria = 'Pilares';
      else if (item.includes('3.3')) subcategoria = 'Lajes';
    }
    
    dados.push({
      id: item,
      codigo: '', // Não disponível no Excel
      nome: descricao.length > 50 ? descricao.substring(0, 50) + '...' : descricao,
      descricao: descricao,
      categoria: categoria,
      subcategoria: subcategoria,
      unidade: unidade,
      quantidade: quantidade,
      valorUnitario: totalUnit,
      maoDeObra: maoDeObraTotal,
      materiais: materiaisTotal,
      total: totalFinal,
      area: 149, // Área padrão por pavimento
      peso: pesoPercentual
    });
  }
  
  return dados;
};

export const carregarDados5D = async (): Promise<OrcamentoItem[]> => {
  try {
    // Tentar carregar o arquivo 5DEST.xlsx
    const response = await fetch('/5DEST.xlsx');
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const dadosProcessados = processarDadosExcel5D(arrayBuffer);
      if (dadosProcessados.length > 0) {
        return dadosProcessados;
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar 5DEST.xlsx, usando dados mockados:', error);
  }
  
  // Fallback para dados mockados se não conseguir carregar o Excel
  await new Promise(resolve => setTimeout(resolve, 1000));
  return dadosMockados5D;
};
