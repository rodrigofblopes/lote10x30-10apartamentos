// Configuração de Linking entre Orçamento e Elementos 3D
// Este arquivo define o mapeamento entre códigos do orçamento e elementos no modelo 3D

export interface ElementLink {
  budgetCode: string;
  elementName: string;
  elementType: 'viga' | 'pilar' | 'laje' | 'fundacao' | 'grupo';
  color: string;
  description: string;
  searchPatterns: string[];
}

export interface LinkingConfig {
  elements: ElementLink[];
  defaultColor: string;
  highlightOpacity: number;
  emissiveIntensity: number;
}

// Configuração principal de linking (restaurada para funcionamento)
export const linkingConfig: LinkingConfig = {
  elements: [
    // Fundação
    {
      budgetCode: '1',
      elementName: 'Fundação',
      elementType: 'grupo',
      color: '#96ceb4',
      description: 'Grupo principal - Fundação',
      searchPatterns: ['1_', '1.1_', '1.2_', '1.3_', 'Fundacao', 'Fundação']
    },
    {
      budgetCode: '1.1',
      elementName: 'Vigas da Fundação',
      elementType: 'viga',
      color: '#ff6b35',
      description: 'Vigas baldrame da fundação',
      searchPatterns: ['1.1_', '1.1_.001', '1.1_.002', '1.1_.003', 'Viga_Fundacao', 'Viga_Fundação']
    },
    {
      budgetCode: '1.2',
      elementName: 'Pilares da Fundação',
      elementType: 'pilar',
      color: '#4ecdc4',
      description: 'Pilares da fundação',
      searchPatterns: ['1.2_', '1.2_.001', '1.2_.002', '1.2_.003', 'Pilar_Fundacao', 'Pilar_Fundação']
    },
    {
      budgetCode: '1.3',
      elementName: 'Fundações',
      elementType: 'fundacao',
      color: '#45b7d1',
      description: 'Sapatas e fundações',
      searchPatterns: ['1.3_', '1.3_.001', '1.3_.002', '1.3_.003', 'Sapata', 'Fundacao_Base']
    },
    
    // Térreo
    {
      budgetCode: '2',
      elementName: 'Térreo',
      elementType: 'grupo',
      color: '#96ceb4',
      description: 'Grupo principal - Térreo',
      searchPatterns: ['2_', '2.1_', '2.2_', '2.3_', 'Terreo', 'Térreo']
    },
    {
      budgetCode: '2.1',
      elementName: 'Vigas do Térreo',
      elementType: 'viga',
      color: '#ff6b35',
      description: 'Vigas do pavimento térreo',
      searchPatterns: ['2.1_', '2.1_.001', '2.1_.002', '2.1_.003', '2.1_.004', 'Viga_Terreo', 'Viga_Térreo']
    },
    {
      budgetCode: '2.2',
      elementName: 'Pilares do Térreo',
      elementType: 'pilar',
      color: '#4ecdc4',
      description: 'Pilares do pavimento térreo',
      searchPatterns: ['2.2_', '2.2_.001', '2.2_.002', '2.2_.003', '2.2_.004', 'Pilar_Terreo', 'Pilar_Térreo']
    },
    {
      budgetCode: '2.3',
      elementName: 'Lajes do Térreo',
      elementType: 'laje',
      color: '#45b7d1',
      description: 'Lajes do pavimento térreo',
      searchPatterns: ['2.3_', '2.3_.001', '2.3_.002', '2.3_.003', 'Laje_Terreo', 'Laje_Térreo']
    },
    
    // Pavimento Superior
    {
      budgetCode: '3',
      elementName: 'Pavimento Superior',
      elementType: 'grupo',
      color: '#96ceb4',
      description: 'Grupo principal - Pavimento Superior',
      searchPatterns: ['3_', '3.1_', '3.2_', '3.3_', 'Pavimento_Superior', 'Superior']
    },
    {
      budgetCode: '3.1',
      elementName: 'Vigas do Pavimento Superior',
      elementType: 'viga',
      color: '#ff6b35',
      description: 'Vigas do pavimento superior',
      searchPatterns: ['3.1_', '3.1_.001', '3.1_.002', '3.1_.003', '3.1_.004', 'Viga_Superior']
    },
    {
      budgetCode: '3.2',
      elementName: 'Pilares do Pavimento Superior',
      elementType: 'pilar',
      color: '#4ecdc4',
      description: 'Pilares do pavimento superior',
      searchPatterns: ['3.2_', '3.2_.001', '3.2_.002', '3.2_.003', '3.2_.004', 'Pilar_Superior']
    },
    {
      budgetCode: '3.3',
      elementName: 'Lajes do Pavimento Superior',
      elementType: 'laje',
      color: '#45b7d1',
      description: 'Lajes do pavimento superior',
      searchPatterns: ['3.3_', '3.3_.001', '3.3_.002', '3.3_.003', 'Laje_Superior']
    }
  ],
  
  defaultColor: '#ff6b35',
  highlightOpacity: 0.8,
  emissiveIntensity: 0.3
};

// Função para encontrar configuração de elemento por código
export const findElementConfig = (budgetCode: string): ElementLink | null => {
  return linkingConfig.elements.find(element => 
    element.budgetCode === budgetCode ||
    element.searchPatterns.some(pattern => budgetCode.includes(pattern))
  ) || null;
};

// Função para gerar padrões de busca baseados na configuração
export const generateSearchPatterns = (budgetCode: string): string[] => {
  const elementConfig = findElementConfig(budgetCode);
  
  if (elementConfig) {
    return elementConfig.searchPatterns;
  }
  
  // Fallback para códigos não mapeados
  const patterns: string[] = [];
  patterns.push(budgetCode);
  patterns.push(`${budgetCode}_`);
  patterns.push(`${budgetCode.replace('.', '_')}_`);
  
  // Padrões genéricos
  for (let i = 1; i <= 10; i++) {
    const num = i.toString().padStart(3, '0');
    patterns.push(`${budgetCode}_${num}`);
    patterns.push(`${budgetCode.replace('.', '_')}_${num}`);
  }
  
  return [...new Set(patterns)];
};

// Função para obter cor do elemento
export const getElementColor = (budgetCode: string): string => {
  const elementConfig = findElementConfig(budgetCode);
  return elementConfig?.color || linkingConfig.defaultColor;
};

// Função para obter tipo do elemento
export const getElementType = (budgetCode: string): string => {
  const elementConfig = findElementConfig(budgetCode);
  return elementConfig?.elementType || 'unknown';
};

// Função para obter descrição do elemento
export const getElementDescription = (budgetCode: string): string => {
  const elementConfig = findElementConfig(budgetCode);
  return elementConfig?.description || 'Elemento não mapeado';
};
