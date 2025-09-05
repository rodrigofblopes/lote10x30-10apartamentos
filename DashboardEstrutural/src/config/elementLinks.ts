// Configuração de links pré-definidos entre elementos 3D e itens da planilha
// Este arquivo define automaticamente as associações entre o modelo 3D e o orçamento

export interface ElementLinkConfig {
  elementKeywords: string[];  // Palavras-chave para identificar elementos 3D
  itemKeywords: string[];     // Palavras-chave para identificar itens da planilha
  category: string;           // Categoria do elemento
  description: string;        // Descrição do link
}

export const ELEMENT_LINKS: ElementLinkConfig[] = [
  // ESTRUTURA - PILARES
  {
    elementKeywords: ['pilar', 'coluna', 'column', 'pillar'],
    itemKeywords: ['pilar', 'coluna', 'estrutura', 'concreto'],
    category: 'Estrutura',
    description: 'Pilares de concreto armado'
  },
  
  // ESTRUTURA - VIGAS
  {
    elementKeywords: ['viga', 'beam', 'trave'],
    itemKeywords: ['viga', 'estrutura', 'concreto'],
    category: 'Estrutura',
    description: 'Vigas de concreto armado'
  },
  
  // ESTRUTURA - LAJES
  {
    elementKeywords: ['laje', 'slab', 'piso', 'floor'],
    itemKeywords: ['laje', 'estrutura', 'concreto'],
    category: 'Estrutura',
    description: 'Lajes de concreto armado'
  },
  
  // ALVENARIA - PAREDES
  {
    elementKeywords: ['parede', 'wall', 'alvenaria'],
    itemKeywords: ['alvenaria', 'bloco', 'parede', 'vedação'],
    category: 'Alvenaria',
    description: 'Paredes de alvenaria'
  },
  
  // REVESTIMENTOS - PISOS
  {
    elementKeywords: ['piso', 'floor', 'revestimento'],
    itemKeywords: ['piso', 'revestimento', 'cerâmica', 'porcelanato'],
    category: 'Revestimento',
    description: 'Revestimentos de piso'
  },
  
  // REVESTIMENTOS - PAREDES
  {
    elementKeywords: ['revestimento', 'azulejo', 'cerâmica'],
    itemKeywords: ['revestimento', 'azulejo', 'cerâmica', 'parede'],
    category: 'Revestimento',
    description: 'Revestimentos de parede'
  },
  
  // ESQUADRIAS - JANELAS
  {
    elementKeywords: ['janela', 'window', 'vidro'],
    itemKeywords: ['janela', 'esquadria', 'alumínio', 'vidro'],
    category: 'Esquadrias',
    description: 'Janelas e esquadrias'
  },
  
  // ESQUADRIAS - PORTAS
  {
    elementKeywords: ['porta', 'door', 'entrada'],
    itemKeywords: ['porta', 'esquadria', 'madeira', 'alumínio'],
    category: 'Esquadrias',
    description: 'Portas e esquadrias'
  },
  
  // COBERTURA - TELHADO
  {
    elementKeywords: ['telhado', 'roof', 'cobertura', 'telha'],
    itemKeywords: ['telhado', 'cobertura', 'telha', 'fibrocimento'],
    category: 'Cobertura',
    description: 'Sistema de cobertura'
  },
  
  // FORRO - TETO
  {
    elementKeywords: ['forro', 'teto', 'ceiling', 'gesso'],
    itemKeywords: ['forro', 'gesso', 'teto', 'placa'],
    category: 'Forro',
    description: 'Forro de gesso'
  },
  
  // PINTURA
  {
    elementKeywords: ['pintura', 'paint', 'tinta'],
    itemKeywords: ['pintura', 'tinta', 'acrílica', 'látex'],
    category: 'Pintura',
    description: 'Pintura e acabamentos'
  }
];

// Função para encontrar links automáticos baseados nas configurações
export function findAutomaticLinks(elementName: string, itemDescription: string): boolean {
  const elementNameLower = elementName.toLowerCase();
  const itemDescLower = itemDescription.toLowerCase();
  
  return ELEMENT_LINKS.some(link => {
    const hasElementKeyword = link.elementKeywords.some(keyword => 
      elementNameLower.includes(keyword.toLowerCase())
    );
    const hasItemKeyword = link.itemKeywords.some(keyword => 
      itemDescLower.includes(keyword.toLowerCase())
    );
    
    return hasElementKeyword && hasItemKeyword;
  });
}

// Função para obter informações do link
export function getLinkInfo(elementName: string, itemDescription: string): ElementLinkConfig | null {
  const elementNameLower = elementName.toLowerCase();
  const itemDescLower = itemDescription.toLowerCase();
  
  return ELEMENT_LINKS.find(link => {
    const hasElementKeyword = link.elementKeywords.some(keyword => 
      elementNameLower.includes(keyword.toLowerCase())
    );
    const hasItemKeyword = link.itemKeywords.some(keyword => 
      itemDescLower.includes(keyword.toLowerCase())
    );
    
    return hasElementKeyword && hasItemKeyword;
  }) || null;
}
