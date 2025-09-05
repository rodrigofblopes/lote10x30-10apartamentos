// Serviço para extrair e processar metadados do Blender no arquivo GLB
import * as THREE from 'three';

export interface BlenderElement {
  id: string;
  name: string;
  type: string;
  category: string;
  budgetCode?: string;
  budgetDescription?: string;
  material?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  customProperties: Record<string, any>;
  parent?: string;
  children: string[];
}

export interface BlenderMetadata {
  version: string;
  blenderVersion: string;
  exportDate: string;
  projectName: string;
  elements: BlenderElement[];
  materials: Array<{
    name: string;
    type: string;
    properties: Record<string, any>;
  }>;
  scenes: Array<{
    name: string;
    elements: string[];
  }>;
}

// Função para extrair metadados de um objeto GLB
export function extractBlenderMetadata(gltf: any): BlenderMetadata {
  const metadata: BlenderMetadata = {
    version: "1.0.0",
    blenderVersion: "Unknown",
    exportDate: new Date().toISOString(),
    projectName: "Vila Andriw",
    elements: [],
    materials: [],
    scenes: []
  };

  // Extrair informações da cena
  if (gltf.scene) {
    gltf.scene.traverse((child: any) => {
      if (child.isMesh || child.isGroup) {
        const element = extractElementData(child);
        if (element) {
          metadata.elements.push(element);
        }
      }
    });
  }

  // Extrair materiais
  if (gltf.materials) {
    gltf.materials.forEach((material: any) => {
      metadata.materials.push({
        name: material.name || "Unnamed",
        type: material.type || "Unknown",
        properties: {
          color: material.color,
          roughness: material.roughness,
          metalness: material.metalness,
          transparent: material.transparent,
          opacity: material.opacity
        }
      });
    });
  }

  // Extrair cenas
  if (gltf.scenes) {
    gltf.scenes.forEach((scene: any, index: number) => {
      metadata.scenes.push({
        name: scene.name || `Scene_${index}`,
        elements: []
      });
    });
  }

  return metadata;
}

// Função para extrair dados de um elemento específico
function extractElementData(object: any): BlenderElement | null {
  if (!object.name) return null;

  const element: BlenderElement = {
    id: object.uuid || object.name,
    name: object.name,
    type: object.type || "Unknown",
    category: determineCategory(object.name),
    position: {
      x: object.position?.x || 0,
      y: object.position?.y || 0,
      z: object.position?.z || 0
    },
    rotation: {
      x: object.rotation?.x || 0,
      y: object.rotation?.y || 0,
      z: object.rotation?.z || 0
    },
    scale: {
      x: object.scale?.x || 1,
      y: object.scale?.y || 1,
      z: object.scale?.z || 1
    },
    customProperties: {},
    children: []
  };

  // Extrair propriedades customizadas do Blender
  if (object.userData) {
    element.customProperties = object.userData;
    
    // Mapear propriedades específicas do Blender
    if (object.userData.budgetCode) {
      element.budgetCode = object.userData.budgetCode;
    }
    if (object.userData.budgetDescription) {
      element.budgetDescription = object.userData.budgetDescription;
    }
    if (object.userData.material) {
      element.material = object.userData.material;
    }
  }

  // Calcular dimensões se possível
  if (object.geometry) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    element.dimensions = {
      width: size.x,
      height: size.y,
      depth: size.z
    };
  }

  // Extrair filhos
  if (object.children) {
    element.children = object.children.map((child: any) => child.uuid || child.name);
  }

  return element;
}

// Função para determinar categoria baseada no nome
function determineCategory(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('pilar') || nameLower.includes('coluna')) return 'Estrutura';
  if (nameLower.includes('viga') || nameLower.includes('beam')) return 'Estrutura';
  if (nameLower.includes('laje') || nameLower.includes('slab')) return 'Estrutura';
  if (nameLower.includes('parede') || nameLower.includes('wall')) return 'Alvenaria';
  if (nameLower.includes('piso') || nameLower.includes('floor')) return 'Revestimento';
  if (nameLower.includes('janela') || nameLower.includes('window')) return 'Esquadrias';
  if (nameLower.includes('porta') || nameLower.includes('door')) return 'Esquadrias';
  if (nameLower.includes('telhado') || nameLower.includes('roof')) return 'Cobertura';
  if (nameLower.includes('forro') || nameLower.includes('ceiling')) return 'Forro';
  
  return 'Outros';
}

// Função para mapear elementos do Blender com itens do orçamento (simplificada)
export function mapBlenderToBudget(
  blenderElements: BlenderElement[],
  _budgetItems: Array<{ id: string; codigo: string; descricao: string; categoria: string }>
): Array<{
  element: BlenderElement;
  budgetItem: any;
  confidence: number;
  matchType: 'exact' | 'category' | 'manual' | 'none';
}> {
  // Por enquanto, retorna mapeamentos vazios
  // Esta função será implementada quando necessário
  return blenderElements.map(element => ({
    element,
    budgetItem: null,
    confidence: 0,
    matchType: 'none' as const
  }));
}

// Função para calcular confiança no mapeamento (comentada por enquanto)
// function calculateMappingConfidence(element: BlenderElement, budgetItem: any): number {
//   let confidence = 0;
  
//   // Verificar código do orçamento no elemento
//   if (element.budgetCode && element.budgetCode === budgetItem.codigo) {
//     confidence += 50;
//   }
  
//   // Verificar descrição
//   if (element.budgetDescription && element.budgetDescription.includes(budgetItem.descricao)) {
//     confidence += 30;
//   }
  
//   // Verificar categoria
//   if (element.category === budgetItem.categoria) {
//     confidence += 20;
//   }
  
//   // Verificar nome do elemento
//   const elementNameLower = element.name.toLowerCase();
//   const itemDescLower = budgetItem.descricao.toLowerCase();
  
//   if (elementNameLower.includes('pilar') && itemDescLower.includes('pilar')) confidence += 15;
//   if (elementNameLower.includes('viga') && itemDescLower.includes('viga')) confidence += 15;
//   if (elementNameLower.includes('laje') && itemDescLower.includes('laje')) confidence += 15;
//   if (elementNameLower.includes('parede') && itemDescLower.includes('alvenaria')) confidence += 15;
//   if (elementNameLower.includes('piso') && itemDescLower.includes('revestimento')) confidence += 15;
//   if (elementNameLower.includes('janela') && itemDescLower.includes('janela')) confidence += 15;
//   if (elementNameLower.includes('porta') && itemDescLower.includes('porta')) confidence += 15;
//   if (elementNameLower.includes('telhado') && itemDescLower.includes('telhado')) confidence += 15;
  
//   return Math.min(100, confidence);
// }

// Função para determinar tipo de correspondência (comentada por enquanto)
// function determineMatchType(_element: BlenderElement, _budgetItem: any, confidence: number): 'exact' | 'category' | 'manual' | 'none' {
//   if (confidence >= 90) return 'exact';
//   if (confidence >= 70) return 'category';
//   if (confidence >= 50) return 'manual';
//   return 'none';
// }

// Função para exportar mapeamentos para diferentes formatos
export function exportBlenderMappings(
  mappings: Array<{
    element: BlenderElement;
    budgetItem: any;
    confidence: number;
    matchType: string;
  }>,
  format: 'json' | 'csv' | 'blender'
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(mappings, null, 2);
    
    case 'csv':
      const headers = ['Element ID', 'Element Name', 'Category', 'Budget Code', 'Budget Description', 'Confidence', 'Match Type'];
      const rows = mappings.map(mapping => [
        mapping.element.id,
        mapping.element.name,
        mapping.element.category,
        mapping.budgetItem?.codigo || '',
        mapping.budgetItem?.descricao || '',
        mapping.confidence.toString(),
        mapping.matchType
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    
    case 'blender':
      // Formato para importar no Blender
      const blenderData = mappings.map(mapping => ({
        object_name: mapping.element.name,
        budget_code: mapping.budgetItem?.codigo || '',
        budget_description: mapping.budgetItem?.descricao || '',
        confidence: mapping.confidence,
        match_type: mapping.matchType
      }));
      return JSON.stringify(blenderData, null, 2);
    
    default:
      return JSON.stringify(mappings, null, 2);
  }
}
