import { useEffect, useState } from 'react';
import { useOrcamentoStore } from './store/orcamentoStore';
import { useCotacaoStore } from './store/cotacaoStore';
import { carregarDados } from './services/orcamentoService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ResumoExecutivo from './components/ResumoExecutivo';
import GridOrcamento from './components/GridOrcamento';
import CotacaoReal from './components/CotacaoReal';
import Galeria from './components/Galeria';
import Graficos from './components/Graficos';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { setItens, carregando } = useOrcamentoStore();
  const { setItens: setCotacaoItens } = useCotacaoStore();
  const [activeTab, setActiveTab] = useState('resumo');

  useEffect(() => {
    const carregarDadosInicial = async () => {
      try {
        // Carregar dados do orçamento
        const dados = await carregarDados();
        setItens(dados);
        
        // Carregar dados da cotação automaticamente
        const dadosCotacao = [
          // PAVIMENTO TÉRREO - PAREDES
          {
            id: '1.1.1',
            codigo: '103355',
            descricao: 'ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS NA HORIZONTAL DE 11,5X14X24 CM (ESPESSURA 11,5 CM) E ARGAMASSA DE ASSENTAMENTO COM PREPARO MANUAL. AF_12/2021',
            categoria: 'Pavimento Térreo',
            subcategoria: 'Paredes',
            quantidade: 384.06,
            unidade: 'm²',
            sinapiMO: 48.44,
            sinapiMat: 54.69,
            sinapiTotal: 39608.10,
            realMO: 48.44,
            realMat: 54.69,
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
            sinapiMO: 5.53,
            sinapiMat: 4.14,
            sinapiTotal: 7427.72,
            realMO: 5.53,
            realMat: 4.14,
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
            sinapiMO: 14.11,
            sinapiMat: 17.15,
            sinapiTotal: 24011.43,
            realMO: 14.11,
            realMat: 17.15,
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
            sinapiMO: 15.33,
            sinapiMat: 150.26,
            sinapiTotal: 22275.16,
            realMO: 15.33,
            realMat: 150.26,
            realTotal: 22275.16,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 165.59,
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
            sinapiMO: 16.20,
            sinapiMat: 117.63,
            sinapiTotal: 18002.81,
            realMO: 16.20,
            realMat: 117.63,
            realTotal: 18002.81,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 133.83,
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
            sinapiMO: 2.00,
            sinapiMat: 2.06,
            sinapiTotal: 3118.56,
            realMO: 2.00,
            realMat: 2.06,
            realTotal: 3118.56,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 4.06,
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
            sinapiMO: 17.00,
            sinapiMat: 15.84,
            sinapiTotal: 25225.06,
            realMO: 17.00,
            realMat: 15.84,
            realTotal: 25225.06,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 32.84,
            peso: 5.94
          },
          {
            id: '1.3.3',
            codigo: '88423',
            descricao: 'APLICAÇÃO MANUAL DE PINTURA COM TINTA TEXTURIZADA ACRÍLICA EM PAREDES EXTERNAS DE CASAS, UMA COR. AF_03/2024',
            categoria: 'Pavimento Térreo',
            subcategoria: 'Revestimento Paredes',
            quantidade: 768.12,
            unidade: 'm²',
            sinapiMO: 4.08,
            sinapiMat: 18.81,
            sinapiTotal: 17582.26,
            realMO: 4.08,
            realMat: 18.81,
            realTotal: 17582.26,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 22.89,
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
            sinapiMO: 29.24,
            sinapiMat: 56.57,
            sinapiTotal: 10897.87,
            realMO: 29.24,
            realMat: 56.57,
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
            sinapiMO: 31.10,
            sinapiMat: 31.85,
            sinapiTotal: 8468.03,
            realMO: 31.10,
            realMat: 31.85,
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
            sinapiMO: 2.78,
            sinapiMat: 2.38,
            sinapiTotal: 694.12,
            realMO: 2.78,
            realMat: 2.38,
            realTotal: 694.12,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 5.16,
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
            sinapiMO: 6.82,
            sinapiMat: 7.65,
            sinapiTotal: 1946.50,
            realMO: 6.82,
            realMat: 7.65,
            realTotal: 1946.50,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 14.47,
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
            sinapiMO: 216.22,
            sinapiMat: 600.52,
            sinapiTotal: 4083.70,
            realMO: 216.22,
            realMat: 600.52,
            realTotal: 4083.70,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 816.74,
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
            sinapiMO: 49.37,
            sinapiMat: 470.71,
            sinapiTotal: 5200.80,
            realMO: 49.37,
            realMat: 470.71,
            realTotal: 5200.80,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 520.08,
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
            sinapiMO: 9.44,
            sinapiMat: 729.25,
            sinapiTotal: 3693.45,
            realMO: 9.44,
            realMat: 729.25,
            realTotal: 3693.45,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 738.69,
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
            sinapiMO: 174.19,
            sinapiMat: 587.15,
            sinapiTotal: 3806.70,
            realMO: 174.19,
            realMat: 587.15,
            realTotal: 3806.70,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 761.34,
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
            sinapiMO: 10.44,
            sinapiMat: 805.96,
            sinapiTotal: 4082.00,
            realMO: 10.44,
            realMat: 805.96,
            realTotal: 4082.00,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 816.40,
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
            sinapiMO: 48.44,
            sinapiMat: 54.69,
            sinapiTotal: 43683.80,
            realMO: 48.44,
            realMat: 54.69,
            realTotal: 43683.80,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 103.13,
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
            sinapiMO: 5.53,
            sinapiMat: 4.14,
            sinapiTotal: 8192.03,
            realMO: 5.53,
            realMat: 4.14,
            realTotal: 8192.03,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 9.67,
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
            sinapiMO: 14.11,
            sinapiMat: 17.15,
            sinapiTotal: 26482.22,
            realMO: 14.11,
            realMat: 17.15,
            realTotal: 26482.22,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 31.26,
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
            sinapiMO: 15.33,
            sinapiMat: 150.26,
            sinapiTotal: 22275.16,
            realMO: 15.33,
            realMat: 150.26,
            realTotal: 22275.16,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 165.59,
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
            sinapiMO: 16.20,
            sinapiMat: 117.63,
            sinapiTotal: 18002.81,
            realMO: 16.20,
            realMat: 117.63,
            realTotal: 18002.81,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 133.83,
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
            sinapiMO: 2.00,
            sinapiMat: 2.06,
            sinapiTotal: 3439.46,
            realMO: 2.00,
            realMat: 2.06,
            realTotal: 3439.46,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 4.06,
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
            sinapiMO: 17.00,
            sinapiMat: 15.84,
            sinapiTotal: 27820.73,
            realMO: 17.00,
            realMat: 15.84,
            realTotal: 27820.73,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 32.84,
            peso: 6.56
          },
          {
            id: '2.3.3',
            codigo: '88423',
            descricao: 'APLICAÇÃO MANUAL DE PINTURA COM TINTA TEXTURIZADA ACRÍLICA EM PAREDES EXTERNAS DE CASAS, UMA COR. AF_03/2024',
            categoria: 'Pavimento Superior',
            subcategoria: 'Revestimento Paredes',
            quantidade: 847.16,
            unidade: 'm²',
            sinapiMO: 4.08,
            sinapiMat: 18.81,
            sinapiTotal: 19391.49,
            realMO: 4.08,
            realMat: 18.81,
            realTotal: 19391.49,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 22.89,
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
            sinapiMO: 29.24,
            sinapiMat: 56.57,
            sinapiTotal: 10897.87,
            realMO: 29.24,
            realMat: 56.57,
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
            sinapiMO: 31.10,
            sinapiMat: 31.85,
            sinapiTotal: 8468.03,
            realMO: 31.10,
            realMat: 31.85,
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
            sinapiMO: 2.78,
            sinapiMat: 2.38,
            sinapiTotal: 694.12,
            realMO: 2.78,
            realMat: 2.38,
            realTotal: 694.12,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 5.16,
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
            sinapiMO: 6.82,
            sinapiMat: 7.65,
            sinapiTotal: 1946.50,
            realMO: 6.82,
            realMat: 7.65,
            realTotal: 1946.50,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 14.47,
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
            sinapiMO: 216.22,
            sinapiMat: 600.52,
            sinapiTotal: 4083.70,
            realMO: 216.22,
            realMat: 600.52,
            realTotal: 4083.70,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 816.74,
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
            sinapiMO: 49.37,
            sinapiMat: 470.71,
            sinapiTotal: 5200.80,
            realMO: 49.37,
            realMat: 470.71,
            realTotal: 5200.80,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 520.08,
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
            sinapiMO: 9.44,
            sinapiMat: 729.25,
            sinapiTotal: 3693.45,
            realMO: 9.44,
            realMat: 729.25,
            realTotal: 3693.45,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 738.69,
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
            sinapiMO: 174.19,
            sinapiMat: 587.15,
            sinapiTotal: 3806.70,
            realMO: 174.19,
            realMat: 587.15,
            realTotal: 3806.70,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 761.34,
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
            sinapiMO: 10.44,
            sinapiMat: 805.96,
            sinapiTotal: 4082.00,
            realMO: 10.44,
            realMat: 805.96,
            realTotal: 4082.00,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 816.40,
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
            sinapiMO: 4.36,
            sinapiMat: 20.07,
            sinapiTotal: 4182.66,
            realMO: 4.36,
            realMat: 20.07,
            realTotal: 4182.66,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 24.43,
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
            sinapiMO: 9.38,
            sinapiMat: 36.82,
            sinapiTotal: 7909.90,
            realMO: 9.38,
            realMat: 36.82,
            realTotal: 7909.90,
            economia: 0,
            percentualEconomia: 0,
            custoPorM2: 46.20,
            peso: 1.86
          }
        ];
        
        setCotacaoItens(dadosCotacao);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDadosInicial();
  }, [setItens, setCotacaoItens]);

  const renderContent = () => {
    switch (activeTab) {
      case 'resumo':
        return <ResumoExecutivo />;
      case 'orcamento':
        return <GridOrcamento />;
      case 'cotacao':
        return <CotacaoReal />;
      case 'galeria':
        return <Galeria />;
      case 'graficos':
        return <Graficos />;
      default:
        return <ResumoExecutivo />;
    }
  };

  if (carregando) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
