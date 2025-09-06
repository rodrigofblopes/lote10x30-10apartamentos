import { OrcamentoItem } from '../types/orcamento';
import * as XLSX from 'xlsx';

// Dados reais baseados na planilha CSV consolidada do Lote 10x30 - 10 Apartamentos
// Estrutura consolidada por categoria principal
export const dadosMockados: OrcamentoItem[] = [
  // FUNDAÇÃO - Total: R$ 39.241,02 (30,81%)
  {
    id: '1',
    codigo: 'FUNDACAO',
    nome: 'Fundação',
    descricao: 'Fundação',
    categoria: 'Fundação',
    subcategoria: 'Total',
    unidade: 'm³',
    quantidade: 105.4, // Total consolidado
    valorUnitario: 372.25, // Valor médio por m³
    maoDeObra: 10846.10, // Total M.O.
    materiais: 28394.92, // Total MAT.
    total: 39241.02,
    area: 149,
    peso: 30.81,
    isEtapaTotal: true
  },
  {
    id: '1.1',
    codigo: 'VIGAS_FUND',
    nome: 'Vigas da Fundação',
    descricao: 'Vigas da Fundação',
    categoria: 'Fundação',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 98.6,
    valorUnitario: 197.00,
    maoDeObra: 5374.03,
    materiais: 14049.96,
    total: 19423.99,
    area: 149,
    peso: 15.25
  },
  {
    id: '1.2',
    codigo: 'PILARES_FUND',
    nome: 'Pilares da Fundação',
    descricao: 'Pilares da Fundação',
    categoria: 'Fundação',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 1.4,
    valorUnitario: 6641.16,
    maoDeObra: 2394.23,
    materiais: 6903.39,
    total: 9297.62,
    area: 149,
    peso: 7.30
  },
  {
    id: '1.3',
    codigo: 'FUNDACOES',
    nome: 'Fundações',
    descricao: 'Fundações',
    categoria: 'Fundação',
    subcategoria: 'Fundações',
    unidade: 'm³',
    quantidade: 5.4,
    valorUnitario: 1948.04,
    maoDeObra: 3077.84,
    materiais: 7441.57,
    total: 10519.41,
    area: 149,
    peso: 8.26
  },

  // TÉRREO - Total: R$ 47.368,32 (37,20%)
  {
    id: '2',
    codigo: 'TERREO',
    nome: 'Térreo',
    descricao: 'Térreo',
    categoria: 'Térreo',
    subcategoria: 'Total',
    unidade: 'm³',
    quantidade: 16.7, // Total consolidado
    valorUnitario: 2836.43, // Valor médio por m³
    maoDeObra: 10925.65, // Total M.O.
    materiais: 36442.67, // Total MAT.
    total: 47368.32,
    area: 149,
    peso: 37.20,
    isEtapaTotal: true
  },
  {
    id: '2.1',
    codigo: 'VIGAS_TERREO',
    nome: 'Vigas do Térreo',
    descricao: 'Vigas do Térreo',
    categoria: 'Térreo',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 6.2,
    valorUnitario: 2802.94,
    maoDeObra: 3894.85,
    materiais: 13483.37,
    total: 17378.22,
    area: 149,
    peso: 13.65
  },
  {
    id: '2.2',
    codigo: 'PILARES_TERREO',
    nome: 'Pilares do Térreo',
    descricao: 'Pilares do Térreo',
    categoria: 'Térreo',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 3.8,
    valorUnitario: 5887.16,
    maoDeObra: 6113.01,
    materiais: 16258.20,
    total: 22371.21,
    area: 149,
    peso: 17.57
  },
  {
    id: '2.3',
    codigo: 'LAJES_TERREO',
    nome: 'Lajes do Térreo',
    descricao: 'Lajes do Térreo',
    categoria: 'Térreo',
    subcategoria: 'Lajes',
    unidade: 'm³',
    quantidade: 6.7,
    valorUnitario: 1137.15,
    maoDeObra: 917.79,
    materiais: 6701.10,
    total: 7618.89,
    area: 149,
    peso: 5.98
  },

  // PAVIMENTO SUPERIOR - Total: R$ 40.737,19 (31,99%)
  {
    id: '3',
    codigo: 'PAVIMENTO_SUPERIOR',
    nome: 'Pavimento Superior',
    descricao: 'Pavimento Superior',
    categoria: 'Pavimento Superior',
    subcategoria: 'Total',
    unidade: 'm³',
    quantidade: 9.7, // Total consolidado
    valorUnitario: 4200.74, // Valor médio por m³
    maoDeObra: 11125.92, // Total M.O.
    materiais: 29611.27, // Total MAT.
    total: 40737.19,
    area: 149,
    peso: 31.99,
    isEtapaTotal: true
  },
  {
    id: '3.1',
    codigo: 'VIGAS_SUPERIOR',
    nome: 'Vigas do Pavimento Superior',
    descricao: 'Vigas do Pavimento Superior',
    categoria: 'Pavimento Superior',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 5.9,
    valorUnitario: 2425.53,
    maoDeObra: 5035.07,
    materiais: 13644.76,
    total: 14310.65,
    area: 149,
    peso: 11.24
  },
  {
    id: '3.2',
    codigo: 'PILARES_SUPERIOR',
    nome: 'Pilares do Pavimento Superior',
    descricao: 'Pilares do Pavimento Superior',
    categoria: 'Pavimento Superior',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 3.8,
    valorUnitario: 740.53,
    maoDeObra: 6090.85,
    materiais: 15966.51,
    total: 22057.36,
    area: 149,
    peso: 17.32
  }
];

export const carregarDados = async (): Promise<OrcamentoItem[]> => {
  try {
    // Tentar carregar o arquivo EST10AP.csv
    const response = await fetch('/EST10AP.csv');
    if (response.ok) {
      const csvContent = await response.text();
      const dadosProcessados = processarDadosCSV(csvContent);
      if (dadosProcessados.length > 0) {
        return dadosProcessados;
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar EST10AP.csv, usando dados mockados:', error);
  }
  
  // Fallback para dados mockados se não conseguir carregar o CSV
  await new Promise(resolve => setTimeout(resolve, 1000));
  return dadosMockados;
};

// Função para processar dados do CSV EST10AP.csv
export const processarDadosCSV = (csvContent: string): OrcamentoItem[] => {
  const lines = csvContent.split('\n');
  const dados: OrcamentoItem[] = [];
  
  // Pular as primeiras 3 linhas (cabeçalho)
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith(';') || line.includes('Totais') || line.includes('Total sem BDI')) {
      continue;
    }
    
    const columns = line.split(';');
    if (columns.length >= 12) {
      const item = columns[0]?.trim();
      const descricao = columns[1]?.trim();
      const unidade = columns[2]?.trim();
      const quantidade = parseFloat(columns[3]?.replace(',', '.') || '0');
      const valorUnitario = parseFloat(columns[4]?.replace(',', '.') || '0');
      // const maoDeObra = parseFloat(columns[5]?.replace(',', '.') || '0');
      // const materiais = parseFloat(columns[6]?.replace(',', '.') || '0');
      // const total = parseFloat(columns[7]?.replace(',', '.') || '0');
      const maoDeObraTotal = parseFloat(columns[8]?.replace(',', '.') || '0');
      const materiaisTotal = parseFloat(columns[9]?.replace(',', '.') || '0');
      const totalFinal = parseFloat(columns[10]?.replace(',', '.') || '0');
      const pesoPercentual = parseFloat(columns[11]?.replace('%', '').replace(',', '.') || '0');
      const elementos3D = columns[12]?.trim() || ''; // Nova coluna Elementos 3D
      
      if (item && descricao && quantidade > 0) {
        // Determinar categoria e subcategoria baseado no item e descrição
        let categoria = 'Fundação';
        let subcategoria = 'Outros';
        let isEtapaTotal = false;
        
        // Verificar se é um total de etapa (sem subitem)
        if (item === '1' || item === '2' || item === '3') {
          isEtapaTotal = true;
          if (item === '1') {
            categoria = 'Fundação';
            subcategoria = 'Total';
          } else if (item === '2') {
            categoria = 'Térreo';
            subcategoria = 'Total';
          } else if (item === '3') {
            categoria = 'Pavimento Superior';
            subcategoria = 'Total';
          }
        } else if (item.startsWith('1.')) {
          categoria = 'Fundação';
          if (item === '1.1') subcategoria = 'Vigas';
          else if (item === '1.2') subcategoria = 'Pilares';
          else if (item === '1.3') subcategoria = 'Fundações';
        } else if (item.startsWith('2.')) {
          categoria = 'Térreo';
          if (item === '2.1') subcategoria = 'Vigas';
          else if (item === '2.2') subcategoria = 'Pilares';
          else if (item === '2.3') subcategoria = 'Lajes';
        } else if (item.startsWith('3.')) {
          categoria = 'Pavimento Superior';
          if (item === '3.1') subcategoria = 'Vigas';
          else if (item === '3.2') subcategoria = 'Pilares';
          else if (item === '3.3') subcategoria = 'Lajes';
        }
        
        dados.push({
          id: item,
          codigo: '', // Não disponível no CSV
          nome: descricao.length > 50 ? descricao.substring(0, 50) + '...' : descricao,
          descricao: descricao,
          categoria: categoria,
          subcategoria: subcategoria,
          unidade: unidade,
          quantidade: quantidade,
          valorUnitario: valorUnitario,
          maoDeObra: maoDeObraTotal,
          materiais: materiaisTotal,
          total: totalFinal,
          area: 149, // Área padrão por pavimento
          peso: pesoPercentual,
          isEtapaTotal: isEtapaTotal,
          elementos3D: elementos3D // Nova propriedade para linking 3D
        });
      }
    }
  }
  
  return dados;
};

export const processarDadosExcel = (excelData: ArrayBuffer): OrcamentoItem[] => {
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
    // const maoDeObraUnit = parseFloat(row[5]?.toString().replace(',', '.') || '0');
    // const materiaisUnit = parseFloat(row[6]?.toString().replace(',', '.') || '0');
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
      peso: pesoPercentual,
      elementos3D: '' // Elementos 3D não disponíveis no Excel por enquanto
    });
  }
  
  return dados;
};