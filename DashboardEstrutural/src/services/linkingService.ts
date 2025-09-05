// Serviço para gerenciar links automáticos entre elementos 3D e itens da planilha
// import { getLinkInfo, ElementLinkConfig } from '../config/elementLinks';

export interface AutoLink {
  id: string;
  elementId: string;
  elementName: string;
  itemId: string;
  itemDescription: string;
  itemCode: string;
  category: string;
  description: string;
  confidence: number; // 0-100, confiança na correspondência
  linkedAt: Date;
}

export interface LinkingResult {
  links: AutoLink[];
  unmatchedElements: string[];
  unmatchedItems: string[];
  statistics: {
    totalLinks: number;
    confidence: number;
    categories: Record<string, number>;
  };
}

// Função para criar links automáticos (simplificada)
export function createAutomaticLinks(
  elements3D: Array<{ id: string; name: string }>,
  items: Array<{ id: string; codigo: string; descricao: string }>
): LinkingResult {
  // Por enquanto, retorna resultado vazio
  // Esta função será implementada quando necessário
  return {
    links: [],
    unmatchedElements: elements3D.map(el => el.name),
    unmatchedItems: items.map(item => `${item.codigo} - ${item.descricao}`),
    statistics: {
      totalLinks: 0,
      confidence: 0,
      categories: {}
    }
  };
}

// Função para calcular confiança na correspondência (comentada por enquanto)
// function calculateConfidence(
//   elementName: string, 
//   itemDescription: string, 
//   linkInfo: ElementLinkConfig
// ): number {
//   let confidence = 0;
  
//   // Verificar correspondência de palavras-chave do elemento
//   const elementMatches = linkInfo.elementKeywords.filter(keyword =>
//     elementName.toLowerCase().includes(keyword.toLowerCase())
//   ).length;
//   confidence += (elementMatches / linkInfo.elementKeywords.length) * 40;

//   // Verificar correspondência de palavras-chave do item
//   const itemMatches = linkInfo.itemKeywords.filter(keyword =>
//     itemDescription.toLowerCase().includes(keyword.toLowerCase())
//   ).length;
//   confidence += (itemMatches / linkInfo.itemKeywords.length) * 40;

//   // Bonus por correspondência exata
//   if (elementName.toLowerCase().includes('pilar') && itemDescription.toLowerCase().includes('pilar')) {
//     confidence += 20;
//   } else if (elementName.toLowerCase().includes('viga') && itemDescription.toLowerCase().includes('viga')) {
//     confidence += 20;
//   } else if (elementName.toLowerCase().includes('laje') && itemDescription.toLowerCase().includes('laje')) {
//     confidence += 20;
//   }

//   return Math.min(100, confidence);
// }

// Função para sugerir links manuais
export function suggestManualLinks(
  unmatchedElements: string[],
  unmatchedItems: string[]
): Array<{ element: string; suggestions: string[] }> {
  return unmatchedElements.map(element => {
    const elementLower = element.toLowerCase();
    const suggestions = unmatchedItems.filter(item => {
      const itemLower = item.toLowerCase();
      
      // Lógica de sugestão baseada em palavras-chave
      if (elementLower.includes('pilar') && itemLower.includes('estrutura')) return true;
      if (elementLower.includes('viga') && itemLower.includes('estrutura')) return true;
      if (elementLower.includes('laje') && itemLower.includes('estrutura')) return true;
      if (elementLower.includes('parede') && itemLower.includes('alvenaria')) return true;
      if (elementLower.includes('piso') && itemLower.includes('revestimento')) return true;
      if (elementLower.includes('janela') && itemLower.includes('esquadria')) return true;
      if (elementLower.includes('porta') && itemLower.includes('esquadria')) return true;
      if (elementLower.includes('telhado') && itemLower.includes('cobertura')) return true;
      
      return false;
    });

    return { element, suggestions };
  });
}

// Função para exportar links para diferentes formatos
export function exportLinks(links: AutoLink[], format: 'json' | 'csv' | 'excel'): string {
  switch (format) {
    case 'json':
      return JSON.stringify(links, null, 2);
    
    case 'csv':
      const headers = ['ID', 'Elemento 3D', 'Item Código', 'Item Descrição', 'Categoria', 'Confiança', 'Data'];
      const rows = links.map(link => [
        link.id,
        link.elementName,
        link.itemCode,
        link.itemDescription,
        link.category,
        link.confidence.toString(),
        link.linkedAt.toISOString()
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    
    case 'excel':
      // Para Excel, retornar JSON que pode ser convertido
      return JSON.stringify(links, null, 2);
    
    default:
      return JSON.stringify(links, null, 2);
  }
}
