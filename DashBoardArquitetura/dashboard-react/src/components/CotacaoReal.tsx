import React, { useState, useEffect } from 'react';
import { useCotacaoStore } from '../store/cotacaoStore';
import { Calculator, Ruler } from 'lucide-react';

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
  const { itens, setItens, updateItem } = useCotacaoStore();
  const [areaTotal, setAreaTotal] = useState(298);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroSubcategoria, setFiltroSubcategoria] = useState<string>('todas');

  useEffect(() => {
    // Dados reais extraídos da planilha SINAPI oficial - 35 itens únicos
    const dadosReais: ItemCotacao[] = [
      // PAVIMENTO TÉRREO - PAREDES
      {
        id: '1.1.1',
        codigo: '103355',
        descricao: 'ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS NA HORIZONTAL DE 11,5X14X24 CM (ESPESSURA 11,5 CM) E ARGAMASSA DE ASSENTAMENTO COM PREPARO MANUAL. AF_12/2021',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Paredes',
        quantidade: 384.06,
        unidade: 'm²',
        sinapiMO: 103.13,
        sinapiMat: 48.44,
        sinapiTotal: 39608.10,
        realMO: 103.13,
        realMat: 48.44,
        realTotal: 39608.10,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 132.89,
        peso: 9.33
      },
      {
        id: '1.1.2',
        codigo: '87905',
        descricao: 'CHAPISCO APLICADO EM ALVENARIA (COM PRESENÇA DE VÃOS) E ESTRUTURAS DE CONCRETO DE FACHADA, COM COLHER DE PEDREIRO. ARGAMASSA TRAÇO 1:3 COM PREPARO EM BETONEIRA 400L. AF_10/2022',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Paredes',
        quantidade: 768.12,
        unidade: 'm²',
        sinapiMO: 9.67,
        sinapiMat: 5.53,
        sinapiTotal: 7427.72,
        realMO: 9.67,
        realMat: 5.53,
        realTotal: 7427.72,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 24.92,
        peso: 1.75
      },
      {
        id: '1.1.3',
        codigo: '104959',
        descricao: 'MASSA ÚNICA, EM ARGAMASSA TRAÇO 1:2:8 PREPARO MANUAL, APLICADA MANUALMENTE EM PAREDES INTERNAS DE AMBIENTES COM ÁREA MAIOR QUE 10M², E = 10MM, COM TALISCAS. AF_03/2024',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Paredes',
        quantidade: 768.12,
        unidade: 'm²',
        sinapiMO: 31.26,
        sinapiMat: 14.11,
        sinapiTotal: 24011.43,
        realMO: 31.26,
        realMat: 14.11,
        realTotal: 24011.43,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 80.54,
        peso: 5.66
      },
      // PAVIMENTO TÉRREO - PISO
      {
        id: '1.2.1',
        codigo: '87703',
        descricao: 'CONTRAPISO EM ARGAMASSA PRONTA, PREPARO MECÂNICO COM MISTURADOR 300 KG, APLICADO EM ÁREAS SECAS SOBRE LAJE, NÃO ADERIDO, ACABAMENTO NÃO REFORÇADO, ESPESSURA 6CM. AF_07/2021',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Piso',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 165.59,
        sinapiMat: 15.33,
        sinapiTotal: 22275.16,
        realMO: 165.59,
        realMat: 15.33,
        realTotal: 22275.16,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 74.75,
        peso: 5.25
      },
      {
        id: '1.2.2',
        codigo: '87263',
        descricao: 'REVESTIMENTO CERÂMICO PARA PISO COM PLACAS TIPO PORCELANATO DE DIMENSÕES 60X60 CM APLICADA EM AMBIENTES DE ÁREA MAIOR QUE 10 M². AF_02/2023_PE',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Piso',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 133.83,
        sinapiMat: 16.20,
        sinapiTotal: 18002.81,
        realMO: 133.83,
        realMat: 16.20,
        realTotal: 18002.81,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 60.41,
        peso: 4.24
      },
      // PAVIMENTO TÉRREO - REVESTIMENTO PAREDES
      {
        id: '1.3.1',
        codigo: '88485',
        descricao: 'FUNDO SELADOR ACRÍLICO, APLICAÇÃO MANUAL EM PAREDE, UMA DEMÃO. AF_04/2023',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Revestimento Paredes',
        quantidade: 768.12,
        unidade: 'm²',
        sinapiMO: 4.06,
        sinapiMat: 2.00,
        sinapiTotal: 3118.56,
        realMO: 4.06,
        realMat: 2.00,
        realTotal: 3118.56,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 10.46,
        peso: 0.73
      },
      {
        id: '1.3.2',
        codigo: '96135',
        descricao: 'APLICAÇÃO MANUAL DE MASSA ACRÍLICA EM PAREDES EXTERNAS DE CASAS, DUAS DEMÃOS. AF_03/2024',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Revestimento Paredes',
        quantidade: 768.12,
        unidade: 'm²',
        sinapiMO: 32.84,
        sinapiMat: 17.00,
        sinapiTotal: 25225.06,
        realMO: 32.84,
        realMat: 17.00,
        realTotal: 25225.06,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 84.65,
        peso: 5.94
      },
      {
        id: '1.3.3',
        codigo: '88423',
        descricao: 'APLICAÇÃO MANUAL DE PINTURA COM TINTURA TEXTURIZADA ACRÍLICA EM PAREDES EXTERNAS DE CASAS, UMA COR. AF_03/2024',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Revestimento Paredes',
        quantidade: 768.12,
        unidade: 'm²',
        sinapiMO: 22.89,
        sinapiMat: 4.08,
        sinapiTotal: 17582.26,
        realMO: 22.89,
        realMat: 4.08,
        realTotal: 17582.26,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 59.01,
        peso: 4.14
      },
      {
        id: '1.3.4',
        codigo: '87275',
        descricao: 'REVESTIMENTO CERÂMICO PARA PAREDES INTERNAS COM PLACAS TIPO ESMALTADA DE DIMENSÕES 33X45 CM APLICADAS A MEIA ALTURA DAS PAREDES. AF_02/2023_PE',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Revestimento Paredes',
        quantidade: 127,
        unidade: 'm²',
        sinapiMO: 85.81,
        sinapiMat: 29.24,
        sinapiTotal: 10897.87,
        realMO: 85.81,
        realMat: 29.24,
        realTotal: 10897.87,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 85.81,
        peso: 2.57
      },
      // PAVIMENTO TÉRREO - FORRO
      {
        id: '1.4.1',
        codigo: '96109',
        descricao: 'FORRO EM PLACAS DE GESSO, PARA AMBIENTES RESIDENCIAIS. AF_08/2023_PS',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Forro',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 62.95,
        sinapiMat: 31.10,
        sinapiTotal: 8468.03,
        realMO: 62.95,
        realMat: 31.10,
        realTotal: 8468.03,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 62.95,
        peso: 2.00
      },
      {
        id: '1.4.2',
        codigo: '88484',
        descricao: 'FUNDO SELADOR ACRÍLICO, APLICAÇÃO MANUAL EM TETO, UMA DEMÃO. AF_04/2023',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Forro',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 5.16,
        sinapiMat: 2.78,
        sinapiTotal: 694.12,
        realMO: 5.16,
        realMat: 2.78,
        realTotal: 694.12,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 2.33,
        peso: 0.16
      },
      {
        id: '1.4.3',
        codigo: '104640',
        descricao: 'PINTURA LÁTEX ACRÍLICA STANDARD, APLICAÇÃO MANUAL EM TETO, DUAS DEMÃOS. AF_04/2023',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Forro',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 14.47,
        sinapiMat: 6.82,
        sinapiTotal: 1946.50,
        realMO: 14.47,
        realMat: 6.82,
        realTotal: 1946.50,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 6.54,
        peso: 0.46
      },
      // PAVIMENTO TÉRREO - ESQUADRIAS
      {
        id: '1.5.1',
        codigo: '91329',
        descricao: 'KIT DE PORTA DE MADEIRA FRISADA, SEMI-OCA (LEVE OU MÉDIA), PADRÃO POPULAR, 60X210CM, ESPESSURA DE 3CM, ITENS INCLUSOS: DOBRADIÇAS, MONTAGEM E INSTALAÇÃO DO BATENTE, SEM FECHADURA - FORNECIMENTO E INSTALAÇÃO. AF_12/2019',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Esquadrias',
        quantidade: 5,
        unidade: 'UN',
        sinapiMO: 816.74,
        sinapiMat: 216.22,
        sinapiTotal: 4083.70,
        realMO: 816.74,
        realMat: 216.22,
        realTotal: 4083.70,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 13.70,
        peso: 0.96
      },
      {
        id: '1.5.2',
        codigo: '91297',
        descricao: 'PORTA DE MADEIRA FRISADA, SEMI-OCA (LEVE OU MÉDIA), 80X210CM, ESPESSURA DE 3,5CM, INCLUSO DOBRADIÇAS - FORNECIMENTO E INSTALAÇÃO. AF_12/2019',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Esquadrias',
        quantidade: 10,
        unidade: 'UN',
        sinapiMO: 520.08,
        sinapiMat: 49.37,
        sinapiTotal: 5200.80,
        realMO: 520.08,
        realMat: 49.37,
        realTotal: 5200.80,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 17.45,
        peso: 1.23
      },
      {
        id: '1.5.3',
        codigo: '100702',
        descricao: 'PORTA DE CORRER DE ALUMÍNIO, COM DUAS FOLHAS PARA VIDRO, INCLUSO VIDRO LISO INCOLOR, FECHADURA E PUXADOR, SEM ALIZAR. AF_12/2019',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Esquadrias',
        quantidade: 5,
        unidade: 'm²',
        sinapiMO: 738.69,
        sinapiMat: 9.44,
        sinapiTotal: 3693.45,
        realMO: 738.69,
        realMat: 9.44,
        realTotal: 3693.45,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 12.39,
        peso: 0.87
      },
      {
        id: '1.5.4',
        codigo: '94559',
        descricao: 'JANELA DE AÇO TIPO BASCULANTE, PARA VIDROS (VIDROS NÃO INCLUSOS), BATENTE/ REQUADRO INCLUSO (6,5 A 14 CM), DIMENSÕES 60X60 CM, COM COM PINTURA ANTICORROSIVA, SEM ACABAMENTO, COM FERRAGENS, FIXAÇÃO COM ARGAMASSA, EXCLUSIVE CONTRAMARCO - FORNECIMENTO E INSTALAÇÃO. AF_11/2024',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Esquadrias',
        quantidade: 5,
        unidade: 'm²',
        sinapiMO: 761.34,
        sinapiMat: 174.19,
        sinapiTotal: 3806.70,
        realMO: 761.34,
        realMat: 174.19,
        realTotal: 3806.70,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 12.77,
        peso: 0.90
      },
      {
        id: '1.5.5',
        codigo: '94573',
        descricao: 'JANELA DE ALUMÍNIO DE CORRER COM 4 FOLHAS PARA VIDROS (VIDROS INCLUSOS), COM BANDEIRA, BATENTE/ REQUADRO 6 A 14 CM, ACABAMENTO COM ACETATO OU BRILHANTE, FIXAÇÃO COM PARAFUSO, SEM GUARNIÇÃO/ ALIZAR, DIMENSÕES 150X120 CM, VEDAÇÃO COM SILICONE, EXCLUSIVE CONTRAMARCO - FORNECIMENTO E INSTALAÇÃO. AF_11/2024',
        categoria: 'Pavimento Térreo',
        subcategoria: 'Esquadrias',
        quantidade: 5,
        unidade: 'm²',
        sinapiMO: 816.40,
        sinapiMat: 10.44,
        sinapiTotal: 4082.00,
        realMO: 816.40,
        realMat: 10.44,
        realTotal: 4082.00,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 13.70,
        peso: 0.96
      },
      // PAVIMENTO SUPERIOR - PAREDES
      {
        id: '2.1.1',
        codigo: '103355',
        descricao: 'ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS NA HORIZONTAL DE 11,5X14X24 CM (ESPESSURA 11,5 CM) E ARGAMASSA DE ASSENTAMENTO COM PREPARO MANUAL. AF_12/2021',
        categoria: 'Pavimento Superior',
        subcategoria: 'Paredes',
        quantidade: 423.58,
        unidade: 'm²',
        sinapiMO: 103.13,
        sinapiMat: 48.44,
        sinapiTotal: 43683.80,
        realMO: 103.13,
        realMat: 48.44,
        realTotal: 43683.80,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 146.59,
        peso: 10.29
      },
      {
        id: '2.1.2',
        codigo: '87905',
        descricao: 'CHAPISCO APLICADO EM ALVENARIA (COM PRESENÇA DE VÃOS) E ESTRUTURAS DE CONCRETO DE FACHADA, COM COLHER DE PEDREIRO. ARGAMASSA TRAÇO 1:3 COM PREPARO EM BETONEIRA 400L. AF_10/2022',
        categoria: 'Pavimento Superior',
        subcategoria: 'Paredes',
        quantidade: 847.16,
        unidade: 'm²',
        sinapiMO: 9.67,
        sinapiMat: 5.53,
        sinapiTotal: 8192.03,
        realMO: 9.67,
        realMat: 5.53,
        realTotal: 8192.03,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 27.49,
        peso: 1.93
      },
      {
        id: '2.1.3',
        codigo: '104959',
        descricao: 'MASSA ÚNICA, EM ARGAMASSA TRAÇO 1:2:8 PREPARO MANUAL, APLICADA MANUALMENTE EM PAREDES INTERNAS DE AMBIENTES COM ÁREA MAIOR QUE 10M², E = 10MM, COM TALISCAS. AF_03/2024',
        categoria: 'Pavimento Superior',
        subcategoria: 'Paredes',
        quantidade: 847.16,
        unidade: 'm²',
        sinapiMO: 31.26,
        sinapiMat: 14.11,
        sinapiTotal: 26482.22,
        realMO: 31.26,
        realMat: 14.11,
        realTotal: 26482.22,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 88.87,
        peso: 6.24
      },
      // PAVIMENTO SUPERIOR - PISO
      {
        id: '2.2.1',
        codigo: '87703',
        descricao: 'CONTRAPISO EM ARGAMASSA PRONTA, PREPARO MECÂNICO COM MISTURADOR 300 KG, APLICADO EM ÁREAS SECAS SOBRE LAJE, NÃO ADERIDO, ACABAMENTO NÃO REFORÇADO, ESPESSURA 6CM. AF_07/2021',
        categoria: 'Pavimento Superior',
        subcategoria: 'Piso',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 165.59,
        sinapiMat: 15.33,
        sinapiTotal: 22275.16,
        realMO: 165.59,
        realMat: 15.33,
        realTotal: 22275.16,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 74.75,
        peso: 5.25
      },
      {
        id: '2.2.2',
        codigo: '87263',
        descricao: 'REVESTIMENTO CERÂMICO PARA PISO COM PLACAS TIPO PORCELANATO DE DIMENSÕES 60X60 CM APLICADA EM AMBIENTES DE ÁREA MAIOR QUE 10 M². AF_02/2023_PE',
        categoria: 'Pavimento Superior',
        subcategoria: 'Piso',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 133.83,
        sinapiMat: 16.20,
        sinapiTotal: 18002.81,
        realMO: 133.83,
        realMat: 16.20,
        realTotal: 18002.81,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 60.41,
        peso: 4.24
      },
      // PAVIMENTO SUPERIOR - REVESTIMENTO PAREDES
      {
        id: '2.3.1',
        codigo: '88485',
        descricao: 'FUNDO SELADOR ACRÍLICO, APLICAÇÃO MANUAL EM PAREDE, UMA DEMÃO. AF_04/2023',
        categoria: 'Pavimento Superior',
        subcategoria: 'Revestimento Paredes',
        quantidade: 847.16,
        unidade: 'm²',
        sinapiMO: 4.06,
        sinapiMat: 2.00,
        sinapiTotal: 3439.46,
        realMO: 4.06,
        realMat: 2.00,
        realTotal: 3439.46,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 11.54,
        peso: 0.81
      },
      {
        id: '2.3.2',
        codigo: '96135',
        descricao: 'APLICAÇÃO MANUAL DE MASSA ACRÍLICA EM PAREDES EXTERNAS DE CASAS, DUAS DEMÃOS. AF_03/2024',
        categoria: 'Pavimento Superior',
        subcategoria: 'Revestimento Paredes',
        quantidade: 847.16,
        unidade: 'm²',
        sinapiMO: 32.84,
        sinapiMat: 17.00,
        sinapiTotal: 27820.73,
        realMO: 32.84,
        realMat: 17.00,
        realTotal: 27820.73,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 93.41,
        peso: 6.56
      },
      {
        id: '2.3.3',
        codigo: '88423',
        descricao: 'APLICAÇÃO MANUAL DE PINTURA COM TINTURA TEXTURIZADA ACRÍLICA EM PAREDES EXTERNAS DE CASAS, UMA COR. AF_03/2024',
        categoria: 'Pavimento Superior',
        subcategoria: 'Revestimento Paredes',
        quantidade: 847.16,
        unidade: 'm²',
        sinapiMO: 22.89,
        sinapiMat: 4.08,
        sinapiTotal: 19391.49,
        realMO: 22.89,
        realMat: 4.08,
        realTotal: 19391.49,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 65.06,
        peso: 4.57
      },
      {
        id: '2.3.4',
        codigo: '87275',
        descricao: 'REVESTIMENTO CERÂMICO PARA PAREDES INTERNAS COM PLACAS TIPO ESMALTADA DE DIMENSÕES 33X45 CM APLICADAS A MEIA ALTURA DAS PAREDES. AF_02/2023_PE',
        categoria: 'Pavimento Superior',
        subcategoria: 'Revestimento Paredes',
        quantidade: 127,
        unidade: 'm²',
        sinapiMO: 85.81,
        sinapiMat: 29.24,
        sinapiTotal: 10897.87,
        realMO: 85.81,
        realMat: 29.24,
        realTotal: 10897.87,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 85.81,
        peso: 2.57
      },
      // PAVIMENTO SUPERIOR - FORRO
      {
        id: '2.4.1',
        codigo: '96109',
        descricao: 'FORRO EM PLACAS DE GESSO, PARA AMBIENTES RESIDENCIAIS. AF_08/2023_PS',
        categoria: 'Pavimento Superior',
        subcategoria: 'Forro',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 62.95,
        sinapiMat: 31.10,
        sinapiTotal: 8468.03,
        realMO: 62.95,
        realMat: 31.10,
        realTotal: 8468.03,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 62.95,
        peso: 2.00
      },
      {
        id: '2.4.2',
        codigo: '88484',
        descricao: 'FUNDO SELADOR ACRÍLICO, APLICAÇÃO MANUAL EM TETO, UMA DEMÃO. AF_04/2023',
        categoria: 'Pavimento Superior',
        subcategoria: 'Forro',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 5.16,
        sinapiMat: 2.78,
        sinapiTotal: 694.12,
        realMO: 5.16,
        realMat: 2.78,
        realTotal: 694.12,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 2.33,
        peso: 0.16
      },
      {
        id: '2.4.3',
        codigo: '104640',
        descricao: 'PINTURA LÁTEX ACRÍLICA STANDARD, APLICAÇÃO MANUAL EM TETO, DUAS DEMÃOS. AF_04/2023',
        categoria: 'Pavimento Superior',
        subcategoria: 'Forro',
        quantidade: 134.52,
        unidade: 'm²',
        sinapiMO: 14.47,
        sinapiMat: 6.82,
        sinapiTotal: 1946.50,
        realMO: 14.47,
        realMat: 6.82,
        realTotal: 1946.50,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 6.54,
        peso: 0.46
      },
      // PAVIMENTO SUPERIOR - ESQUADRIAS
      {
        id: '2.5.1',
        codigo: '91329',
        descricao: 'KIT DE PORTA DE MADEIRA FRISADA, SEMI-OCA (LEVE OU MÉDIA), PADRÃO POPULAR, 60X210CM, ESPESSURA DE 3CM, ITENS INCLUSOS: DOBRADIÇAS, MONTAGEM E INSTALAÇÃO DO BATENTE, SEM FECHADURA - FORNECIMENTO E INSTALAÇÃO. AF_12/2019',
        categoria: 'Pavimento Superior',
        subcategoria: 'Esquadrias',
        quantidade: 5,
        unidade: 'UN',
        sinapiMO: 816.74,
        sinapiMat: 216.22,
        sinapiTotal: 4083.70,
        realMO: 816.74,
        realMat: 216.22,
        realTotal: 4083.70,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 13.70,
        peso: 0.96
      },
      {
        id: '2.5.2',
        codigo: '91297',
        descricao: 'PORTA DE MADEIRA FRISADA, SEMI-OCA (LEVE OU MÉDIA), 80X210CM, ESPESSURA DE 3,5CM, INCLUSO DOBRADIÇAS - FORNECIMENTO E INSTALAÇÃO. AF_12/2019',
        categoria: 'Pavimento Superior',
        subcategoria: 'Esquadrias',
        quantidade: 10,
        unidade: 'UN',
        sinapiMO: 520.08,
        sinapiMat: 49.37,
        sinapiTotal: 5200.80,
        realMO: 520.08,
        realMat: 49.37,
        realTotal: 5200.80,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 17.45,
        peso: 1.23
      },
      {
        id: '2.5.3',
        codigo: '100702',
        descricao: 'PORTA DE CORRER DE ALUMÍNIO, COM DUAS FOLHAS PARA VIDRO, INCLUSO VIDRO LISO INCOLOR, FECHADURA E PUXADOR, SEM ALIZAR. AF_12/2019',
        categoria: 'Pavimento Superior',
        subcategoria: 'Esquadrias',
        quantidade: 5,
        unidade: 'm²',
        sinapiMO: 738.69,
        sinapiMat: 9.44,
        sinapiTotal: 3693.45,
        realMO: 738.69,
        realMat: 9.44,
        realTotal: 3693.45,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 12.39,
        peso: 0.87
      },
      {
        id: '2.5.4',
        codigo: '94559',
        descricao: 'JANELA DE AÇO TIPO BASCULANTE, PARA VIDROS (VIDROS NÃO INCLUSOS), BATENTE/ REQUADRO INCLUSO (6,5 A 14 CM), DIMENSÕES 60X60 CM, COM COM PINTURA ANTICORROSIVA, SEM ACABAMENTO, COM FERRAGENS, FIXAÇÃO COM ARGAMASSA, EXCLUSIVE CONTRAMARCO - FORNECIMENTO E INSTALAÇÃO. AF_11/2024',
        categoria: 'Pavimento Superior',
        subcategoria: 'Esquadrias',
        quantidade: 5,
        unidade: 'm²',
        sinapiMO: 761.34,
        sinapiMat: 174.19,
        sinapiTotal: 3806.70,
        realMO: 761.34,
        realMat: 174.19,
        realTotal: 3806.70,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 12.77,
        peso: 0.90
      },
      {
        id: '2.5.5',
        codigo: '94573',
        descricao: 'JANELA DE ALUMÍNIO DE CORRER COM 4 FOLHAS PARA VIDROS (VIDROS INCLUSOS), COM BANDEIRA, BATENTE/ REQUADRO 6 A 14 CM, ACABAMENTO COM ACETATO OU BRILHANTE, FIXAÇÃO COM PARAFUSO, SEM GUARNIÇÃO/ ALIZAR, DIMENSÕES 150X120 CM, VEDAÇÃO COM SILICONE, EXCLUSIVE CONTRAMARCO - FORNECIMENTO E INSTALAÇÃO. AF_11/2024',
        categoria: 'Pavimento Superior',
        subcategoria: 'Esquadrias',
        quantidade: 5,
        unidade: 'm²',
        sinapiMO: 816.40,
        sinapiMat: 10.44,
        sinapiTotal: 4082.00,
        realMO: 816.40,
        realMat: 10.44,
        realTotal: 4082.00,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 13.70,
        peso: 0.96
      },
      // PAVIMENTO SUPERIOR - TELHADO
      {
        id: '2.6.1',
        codigo: '92543',
        descricao: 'TRAMA DE MADEIRA COMPOSTA POR TERÇAS PARA TELHADOS DE ATÉ 2 ÁGUAS PARA TELHA ONDULADA DE FIBROCIMENTO, METÁLICA, PLÁSTICA OU TERMOACÚSTICA, INCLUSO TRANSPORTE VERTICAL. AF_07/2019',
        categoria: 'Pavimento Superior',
        subcategoria: 'Telhado',
        quantidade: 171.21,
        unidade: 'm²',
        sinapiMO: 24.43,
        sinapiMat: 4.36,
        sinapiTotal: 4182.66,
        realMO: 24.43,
        realMat: 4.36,
        realTotal: 4182.66,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 14.04,
        peso: 0.99
      },
      {
        id: '2.6.2',
        codigo: '74088/001',
        descricao: 'TELHAMENTO COM TELHA DE FIBROCIMENTO ONDULADA, ESPESSURA 6MM, INCLUSO JUNTAS DE VEDACAO E ACESSORIOS DE FIXACAO, EXCLUINDO MADEIRAMENTO',
        categoria: 'Pavimento Superior',
        subcategoria: 'Telhado',
        quantidade: 171.21,
        unidade: 'm²',
        sinapiMO: 46.20,
        sinapiMat: 9.38,
        sinapiTotal: 7909.90,
        realMO: 46.20,
        realMat: 9.38,
        realTotal: 7909.90,
        economia: 0,
        percentualEconomia: 0,
        custoPorM2: 26.54,
        peso: 1.86
      }
    ];

    // Verificação manual dos totais
    const totalManual = dadosReais.reduce((acc, item) => acc + item.sinapiTotal, 0);
    console.log('=== VERIFICAÇÃO MANUAL ===');
    console.log('Total calculado manualmente:', totalManual);
    console.log('Total esperado da planilha:', 424377.70);
    console.log('Diferença:', totalManual - 424377.70);
    console.log('Número de itens:', dadosReais.length);
    
    // Verificar por categoria
    const totalTerreo = dadosReais
      .filter(item => item.categoria === 'Pavimento Térreo')
      .reduce((acc, item) => acc + item.sinapiTotal, 0);
    const totalSuperior = dadosReais
      .filter(item => item.categoria === 'Pavimento Superior')
      .reduce((acc, item) => acc + item.sinapiTotal, 0);
    
    console.log('Total Térreo:', totalTerreo);
    console.log('Total Superior:', totalSuperior);
    console.log('Soma Térreo + Superior:', totalTerreo + totalSuperior);
    
    // Verificar itens com valores altos
    const itensAltos = dadosReais
      .filter(item => item.sinapiTotal > 10000)
      .sort((a, b) => b.sinapiTotal - a.sinapiTotal);
    console.log('Itens com valor > R$ 10.000:', itensAltos.map(item => ({
      id: item.id,
      descricao: item.descricao.substring(0, 50) + '...',
      valor: item.sinapiTotal
    })));

    console.log('Dados carregados:', dadosReais.length, 'itens');
    console.log('Total SINAPI esperado: R$ 424.377,70');
    
    // Calcular custo por m² inicial
    const itensComCustoPorM2 = dadosReais.map(item => ({
      ...item,
      custoPorM2: item.sinapiTotal / areaTotal
    }));

    setItens(itensComCustoPorM2);
  }, [areaTotal, setItens]);

  const handleAreaChange = (novaArea: number) => {
    setAreaTotal(novaArea);
  };

  const handleValorChange = (id: string, campo: 'realMO' | 'realMat') => {
    const item = itens.find(i => i.id === id);
    if (!item) return;

    const novoValor = campo === 'realMO' ? item.realMO : item.realMat;
    const realTotal = (campo === 'realMO' ? novoValor : item.realMO) * item.quantidade + 
                     (campo === 'realMat' ? novoValor : item.realMat) * item.quantidade;
    
    const economia = item.sinapiTotal - realTotal;
    const percentualEconomia = item.sinapiTotal > 0 ? (economia / item.sinapiTotal) * 100 : 0;
    const custoPorM2 = realTotal / areaTotal;

    updateItem(id, {
      realTotal,
      economia,
      percentualEconomia,
      custoPorM2
    });
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor.toFixed(1)}%`;
  };

  // Filtros
  const categorias = [...new Set(itens.map(item => item.categoria))];
  const subcategorias = [...new Set(itens.map(item => item.subcategoria))];

  const itensFiltrados = itens.filter(item => {
    const matchCategoria = filtroCategoria === 'todas' || item.categoria === filtroCategoria;
    const matchSubcategoria = filtroSubcategoria === 'todas' || item.subcategoria === filtroSubcategoria;
    return matchCategoria && matchSubcategoria;
  });

  // Cálculos dos totais
  const totalSINAPI = itensFiltrados.reduce((acc, item) => acc + item.sinapiTotal, 0);
  const totalReal = itensFiltrados.reduce((acc, item) => acc + item.realTotal, 0);
  const totalEconomia = itensFiltrados.reduce((acc, item) => acc + item.economia, 0);
  const totalCustoPorM2 = totalReal / areaTotal;

  // Verificar se os dados estão carregados corretamente
  console.log('Total SINAPI calculado:', totalSINAPI);
  console.log('Total Real calculado:', totalReal);
  console.log('Número de itens:', itensFiltrados.length);

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700">
              💰 Cotação Real - Lote 10x30 - 10 Apartamentos
            </h2>
            <p className="text-gray-600 mt-2">
              Compare valores SINAPI com preços reais de mercado e calcule economia
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Área Total:</label>
              <input
                type="number"
                value={areaTotal}
                onChange={(e) => handleAreaChange(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <span className="text-sm text-gray-600">m²</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Categoria:</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Subcategoria:</label>
            <select
              value={filtroSubcategoria}
              onChange={(e) => setFiltroSubcategoria(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas</option>
              {subcategorias.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Total SINAPI</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">{formatarMoeda(totalSINAPI)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Total Real</h3>
            </div>
            <p className="text-2xl font-bold text-green-700">{formatarMoeda(totalReal)}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <Ruler className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-800">Custo por m²</h3>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{formatarMoeda(totalCustoPorM2)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Economia Total</h3>
            </div>
            <p className="text-2xl font-bold text-orange-700">{formatarMoeda(totalEconomia)}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Cotação */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qtd
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SINAPI M.O.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SINAPI Mat.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SINAPI Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Real M.O.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Real Mat.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Real Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Economia
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo/m²
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itensFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.codigo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={item.descricao}>
                    {item.descricao}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="font-medium">{item.categoria}</div>
                      <div className="text-xs text-gray-400">{item.subcategoria}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.quantidade.toFixed(2)} {item.unidade}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatarMoeda(item.sinapiMO)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatarMoeda(item.sinapiMat)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                    {formatarMoeda(item.sinapiTotal)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.realMO}
                      onChange={(e) => {
                        const novoValor = Number(e.target.value);
                        updateItem(item.id, { realMO: novoValor });
                        handleValorChange(item.id, 'realMO');
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.realMat}
                      onChange={(e) => {
                        const novoValor = Number(e.target.value);
                        updateItem(item.id, { realMat: novoValor });
                        handleValorChange(item.id, 'realMat');
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatarMoeda(item.realTotal)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className={`font-medium ${item.economia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarMoeda(item.economia)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatarPercentual(item.percentualEconomia)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-emerald-600">
                    {formatarMoeda(item.custoPorM2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          💡 Como Usar a Cotação Real:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="mb-2"><strong>1.</strong> Edite os valores de "Real M.O." e "Real Mat." para cada item</p>
            <p className="mb-2"><strong>2.</strong> A economia é calculada automaticamente (SINAPI - Real)</p>
            <p className="mb-2"><strong>3.</strong> O custo por m² é atualizado em tempo real</p>
          </div>
          <div>
            <p className="mb-2"><strong>4.</strong> Use os filtros para organizar por categoria</p>
            <p className="mb-2"><strong>5.</strong> Ajuste a área total para recalcular custos por m²</p>
            <p className="mb-2"><strong>6.</strong> Compare totais SINAPI vs Real no resumo superior</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CotacaoReal;
