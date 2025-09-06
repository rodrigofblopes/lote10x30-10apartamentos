import { OrcamentoItem } from '../types/orcamento';
import * as XLSX from 'xlsx';

// Dados mockados específicos para o 5D (baseados na planilha 5DEST.xlsx)
export const dadosMockados5D: OrcamentoItem[] = [
  // FUNDAÇÃO - Total: R$ 39.241,02 (30,81%)
  {
    id: '1',
    codigo: '',
    nome: 'Fundação',
    descricao: 'Fundação',
    categoria: 'Fundação',
    subcategoria: 'Total',
    unidade: 'un',
    quantidade: 0,
    valorUnitario: 0,
    maoDeObra: 0,
    materiais: 0,
    total: 39241.02,
    area: 149,
    peso: 30.81,
    isEtapaTotal: true
  },
  {
    id: '1.1',
    codigo: '',
    nome: 'Vigas',
    descricao: 'Vigas',
    categoria: 'Fundação',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 5.9,
    valorUnitario: 2631.35,
    maoDeObra: 5374.03,
    materiais: 14049.96,
    total: 19423.99,
    area: 149,
    peso: 15.25
  },
  {
    id: '1.2',
    codigo: '',
    nome: 'Pilares',
    descricao: 'Pilares',
    categoria: 'Fundação',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 1.4,
    valorUnitario: 6640.44,
    maoDeObra: 2394.23,
    materiais: 6903.39,
    total: 9297.62,
    area: 149,
    peso: 7.30
  },
  {
    id: '1.3',
    codigo: '',
    nome: 'Fundações',
    descricao: 'Fundações',
    categoria: 'Fundação',
    subcategoria: 'Fundações',
    unidade: 'm³',
    quantidade: 5.4,
    valorUnitario: 1948.05,
    maoDeObra: 3077.84,
    materiais: 7441.57,
    total: 10519.41,
    area: 149,
    peso: 8.26
  },
  // TÉRREO - Total: R$ 47.368,32 (37,20%)
  {
    id: '2',
    codigo: '',
    nome: 'Térreo',
    descricao: 'Térreo',
    categoria: 'Térreo',
    subcategoria: 'Total',
    unidade: 'un',
    quantidade: 0,
    valorUnitario: 0,
    maoDeObra: 0,
    materiais: 0,
    total: 47368.32,
    area: 149,
    peso: 37.20,
    isEtapaTotal: true
  },
  {
    id: '2.1',
    codigo: '',
    nome: 'Vigas',
    descricao: 'Vigas',
    categoria: 'Térreo',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 6.2,
    valorUnitario: 2802.97,
    maoDeObra: 3894.85,
    materiais: 13483.37,
    total: 17378.22,
    area: 149,
    peso: 13.65
  },
  {
    id: '2.2',
    codigo: '',
    nome: 'Pilares',
    descricao: 'Pilares',
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
    codigo: '',
    nome: 'Lajes',
    descricao: 'Lajes',
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
    codigo: '',
    nome: 'Pavimento Superior',
    descricao: 'Pavimento Superior',
    categoria: 'Pavimento Superior',
    subcategoria: 'Total',
    unidade: 'un',
    quantidade: 0,
    valorUnitario: 0,
    maoDeObra: 0,
    materiais: 0,
    total: 40737.19,
    area: 149,
    peso: 31.99,
    isEtapaTotal: true
  },
  {
    id: '3.1',
    codigo: '',
    nome: 'Vigas',
    descricao: 'Vigas',
    categoria: 'Pavimento Superior',
    subcategoria: 'Vigas',
    unidade: 'm³',
    quantidade: 5.9,
    valorUnitario: 2425.55,
    maoDeObra: 5035.07,
    materiais: 13644.76,
    total: 14310.65,
    area: 149,
    peso: 11.24
  },
  {
    id: '3.2',
    codigo: '',
    nome: 'Pilares',
    descricao: 'Pilares',
    categoria: 'Pavimento Superior',
    subcategoria: 'Pilares',
    unidade: 'm³',
    quantidade: 3.8,
    valorUnitario: 740.53,
    maoDeObra: 6090.85,
    materiais: 15966.51,
    total: 2814.05,
    area: 149,
    peso: 2.21
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
  
  console.log('📊 Dados Excel carregados:', jsonData.slice(0, 15)); // Debug
  
  // Pular as primeiras linhas (cabeçalho) e processar a partir da linha 4
  for (let i = 3; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    
    if (!row || row.length < 8) continue;
    
    const item = row[0]?.toString().trim();
    const descricao = row[1]?.toString().trim();
    const unidade = row[2]?.toString().trim();
    const quantidade = parseFloat(row[3]?.toString().replace(',', '.') || '0');
    
    // Valores unitários (colunas F, G, H)
    const totalUnit = parseFloat(row[7]?.toString().replace(',', '.') || '0');
    
    // Valores totais (colunas I, J, K)
    const maoDeObraTotal = parseFloat(row[8]?.toString().replace(',', '.') || '0');
    const materiaisTotal = parseFloat(row[9]?.toString().replace(',', '.') || '0');
    const totalFinal = parseFloat(row[10]?.toString().replace(',', '.') || '0');
    
    // Peso percentual (coluna L)
    const pesoPercentual = parseFloat(row[11]?.toString().replace('%', '').replace(',', '.') || '0');
    
    // Pular linhas vazias ou com dados inválidos
    if (!item || !descricao) {
      continue;
    }
    
    // Identificar totais por etapa (que DEVEM ser incluídos)
    const isEtapaTotal = (item === '1' && descricao.includes('Fundação')) ||
                        (item === '2' && descricao.includes('Térreo')) ||
                        (item === '3' && descricao.includes('Pavimento Superior'));
    
    // EXCLUIR sub-itens (1.1.1, 1.1.2, etc.) - apenas incluir 1.1, 1.2, 1.3, etc.
    const isSubItem = item.includes('.') && item.split('.').length > 2;
    
    // EXCLUIR linhas de totais gerais e itens não visíveis na imagem
    if (descricao.includes('Totais') || descricao.includes('->') || isSubItem) {
      continue;
    }
    
    // Determinar categoria e subcategoria baseado no item
    let categoria = 'Fundação';
    let subcategoria = 'Outros';
    
    if (item.startsWith('1.') || descricao.includes('Fundação')) {
      categoria = 'Fundação';
      if (item.includes('1.1') || descricao.includes('Vigas')) subcategoria = 'Vigas';
      else if (item.includes('1.2') || descricao.includes('Pilares')) subcategoria = 'Pilares';
      else if (item.includes('1.3') || descricao.includes('Fundações')) subcategoria = 'Fundações';
    } else if (item.startsWith('2.') || descricao.includes('Térreo')) {
      categoria = 'Térreo';
      if (item.includes('2.1') || descricao.includes('Vigas')) subcategoria = 'Vigas';
      else if (item.includes('2.2') || descricao.includes('Pilares')) subcategoria = 'Pilares';
      else if (item.includes('2.3') || descricao.includes('Lajes')) subcategoria = 'Lajes';
    } else if (item.startsWith('3.') || descricao.includes('Pavimento Superior')) {
      categoria = 'Pavimento Superior';
      if (item.includes('3.1') || descricao.includes('Vigas')) subcategoria = 'Vigas';
      else if (item.includes('3.2') || descricao.includes('Pilares')) subcategoria = 'Pilares';
      else if (item.includes('3.3') || descricao.includes('Lajes')) subcategoria = 'Lajes';
    }
    
    // Criar item com dados processados
    const itemProcessado = {
      id: item || `item-${i}`,
      codigo: '', // Não disponível no Excel
      nome: descricao.length > 50 ? descricao.substring(0, 50) + '...' : descricao,
      descricao: descricao,
      categoria: categoria,
      subcategoria: subcategoria,
      unidade: unidade || 'un',
      quantidade: quantidade,
      valorUnitario: totalUnit,
      maoDeObra: maoDeObraTotal,
      materiais: materiaisTotal,
      total: totalFinal,
      area: 149, // Área padrão por pavimento
      peso: pesoPercentual,
      isEtapaTotal: isEtapaTotal // Flag para identificar totais por etapa
    };
    
    console.log(`📋 Item processado: ${item} - ${descricao} (${categoria}/${subcategoria})`);
    dados.push(itemProcessado);
  }
  
  console.log('✅ Dados Excel processados:', dados.length, 'itens'); // Debug
  return dados;
};

// Função para processar dados do CSV 5DEST.csv
export const processarDadosCSV5D = (csvText: string): OrcamentoItem[] => {
  const lines = csvText.split('\n');
  const dados: OrcamentoItem[] = [];
  
  console.log('📊 Processando CSV 5DEST.csv...');
  
  // Pular as primeiras linhas (cabeçalho) e processar a partir da linha 4
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(';');
    if (columns.length < 12) continue;
    
    const item = columns[0]?.trim();
    const descricao = columns[1]?.trim() || '';
    const unidade = columns[2]?.trim() || 'un';
    const quantidade = parseFloat(columns[3]?.replace(',', '.') || '0');
    
    // Debug: log para itens com quantidade > 0
    if (quantidade > 0) {
      console.log(`📊 Item com quantidade: "${item}" - ${descricao} = ${quantidade} ${unidade}`);
    }
    
    // Limpar caracteres especiais da descrição
    const descricaoLimpa = descricao
      .replace(/[^\w\s.,-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, ' ') // Remove espaços múltiplos
      .trim();
    
    // Debug: log para itens com quantidade > 0
    if (quantidade > 0) {
      console.log(`📊 Item com quantidade: ${item} - ${descricao} = ${quantidade} ${unidade}`);
    }
    
    // Valores totais (colunas 8, 9, 10)
    const maoDeObraTotal = parseFloat(columns[8]?.replace(',', '.') || '0');
    const materiaisTotal = parseFloat(columns[9]?.replace(',', '.') || '0');
    const totalFinal = parseFloat(columns[10]?.replace(',', '.') || '0');
    
    // Peso percentual (coluna 11)
    const pesoPercentual = parseFloat(columns[11]?.replace('%', '').replace(',', '.') || '0');
    
    // Pular linhas vazias ou com dados inválidos
    if (!item || !descricao || item.includes('Totais')) {
      continue;
    }
    
    // Identificar totais por etapa
    const isEtapaTotal = (item === '1' && descricao.includes('Fundação')) ||
                        (item === '2' && descricao.includes('Térreo')) ||
                        (item === '3' && descricao.includes('Pavimento Superior'));
    
    // Determinar categoria e subcategoria
    let categoria = 'Fundação';
    let subcategoria = 'Outros';
    
    if (item.startsWith('1.') || descricao.includes('Fundação')) {
      categoria = 'Fundação';
      if (item.includes('1.1') || descricao.includes('Vigas')) subcategoria = 'Vigas';
      else if (item.includes('1.2') || descricao.includes('Pilares')) subcategoria = 'Pilares';
      else if (item.includes('1.3') || descricao.includes('Fundações')) subcategoria = 'Fundações';
    } else if (item.startsWith('2.') || descricao.includes('Térreo')) {
      categoria = 'Térreo';
      if (item.includes('2.1') || descricao.includes('Vigas')) subcategoria = 'Vigas';
      else if (item.includes('2.2') || descricao.includes('Pilares')) subcategoria = 'Pilares';
      else if (item.includes('2.3') || descricao.includes('Lajes')) subcategoria = 'Lajes';
    } else if (item.startsWith('3.') || descricao.includes('Pavimento Superior')) {
      categoria = 'Pavimento Superior';
      if (item.includes('3.1') || descricao.includes('Vigas')) subcategoria = 'Vigas';
      else if (item.includes('3.2') || descricao.includes('Pilares')) subcategoria = 'Pilares';
      else if (item.includes('3.3') || descricao.includes('Lajes')) subcategoria = 'Lajes';
    }
    
    // Para planilha 5DEST (sintética), calcular quantidade baseada no valor total
    let quantidadeFinal = quantidade;
    let valorUnitario = 0;
    
    if (quantidade === 0 && totalFinal > 0) {
      // Se não tem quantidade mas tem valor total, estimar quantidade
      // Baseado em valores típicos de construção
      if (descricao.toLowerCase().includes('viga')) {
        quantidadeFinal = Math.round(totalFinal / 800); // ~R$ 800/m³ para vigas
        valorUnitario = totalFinal / quantidadeFinal;
      } else if (descricao.toLowerCase().includes('pilar')) {
        quantidadeFinal = Math.round(totalFinal / 900); // ~R$ 900/m³ para pilares
        valorUnitario = totalFinal / quantidadeFinal;
      } else if (descricao.toLowerCase().includes('laje')) {
        quantidadeFinal = Math.round(totalFinal / 700); // ~R$ 700/m³ para lajes
        valorUnitario = totalFinal / quantidadeFinal;
      } else if (descricao.toLowerCase().includes('fundação')) {
        quantidadeFinal = Math.round(totalFinal / 750); // ~R$ 750/m³ para fundações
        valorUnitario = totalFinal / quantidadeFinal;
      } else {
        // Valor padrão para outros itens
        quantidadeFinal = Math.round(totalFinal / 500);
        valorUnitario = totalFinal / quantidadeFinal;
      }
    } else if (quantidade > 0) {
      valorUnitario = totalFinal / quantidade;
    }
    
    // Criar item com dados processados
    const itemProcessado = {
      id: item || `item-${i}`,
      codigo: '',
      nome: descricaoLimpa.length > 50 ? descricaoLimpa.substring(0, 50) + '...' : descricaoLimpa,
      descricao: descricaoLimpa,
      categoria: categoria,
      subcategoria: subcategoria,
      unidade: unidade || 'un',
      quantidade: quantidadeFinal,
      valorUnitario: valorUnitario,
      maoDeObra: maoDeObraTotal,
      materiais: materiaisTotal,
      total: totalFinal,
      area: 149,
      peso: pesoPercentual,
      isEtapaTotal: isEtapaTotal
    };
    
    dados.push(itemProcessado);
  }
  
  console.log('✅ Dados CSV processados:', dados.length, 'itens');
  return dados;
};

export const carregarDados5D = async (): Promise<OrcamentoItem[]> => {
  try {
    console.log('🔄 Tentando carregar 5DEST.csv (atualizada)...');
    // Tentar carregar o arquivo 5DEST.csv atualizada
    const response = await fetch('/5DEST.csv');
    console.log('📡 Response status:', response.status, response.ok);
    
    if (response.ok) {
      const csvText = await response.text();
      console.log('📊 CSV carregado, tamanho:', csvText.length, 'caracteres');
      
      const dadosProcessados = processarDadosCSV5D(csvText);
      console.log('✅ Dados processados:', dadosProcessados.length, 'itens');
      
      if (dadosProcessados.length > 0) {
        console.log('🎉 Retornando dados do CSV 5DEST.csv atualizada');
        return dadosProcessados;
      }
    } else {
      console.error('❌ Erro ao carregar 5DEST-utf8.csv - Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Erro ao carregar 5DEST-utf8.csv:', error);
  }
  
  // Fallback para dados mockados se não conseguir carregar o CSV
  console.log('🔄 Usando dados mockados como fallback...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  return dadosMockados5D;
};
