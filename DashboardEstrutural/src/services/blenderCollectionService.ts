// Serviço para análise e mapeamento de coleções do Blender

export interface BlenderCollection {
  name: string;
  type: string;
  id: number;
  uuid: string;
  parent?: string;
  children: string[];
  userData?: any;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  geometry?: any;
  material?: any;
}

export interface CollectionMapping {
  budgetCode: string;
  blenderCollections: string[];
  confidence: number; // 0-1, quão confiante estamos no match
  searchPatterns: string[];
}

class BlenderCollectionService {
  private collections: BlenderCollection[] = [];
  private mappings: CollectionMapping[] = [];

  // Extrair todas as coleções de um objeto 3D
  extractCollections(scene: any): BlenderCollection[] {
    const collections: BlenderCollection[] = [];
    const processed = new Set<string>();

    const traverse = (object: any, parentName?: string) => {
      if (!object || processed.has(object.uuid)) return;
      processed.add(object.uuid);

      const collection: BlenderCollection = {
        name: object.name || `Unnamed_${object.id}`,
        type: object.type,
        id: object.id,
        uuid: object.uuid,
        parent: parentName,
        children: [],
        userData: object.userData || {},
        position: object.position ? [object.position.x, object.position.y, object.position.z] : undefined,
        rotation: object.rotation ? [object.rotation.x, object.rotation.y, object.rotation.z] : undefined,
        scale: object.scale ? [object.scale.x, object.scale.y, object.scale.z] : undefined
      };

      // Adicionar informações de geometria se disponível
      if (object.geometry) {
        collection.geometry = {
          type: object.geometry.type,
          vertices: object.geometry.attributes?.position?.count || 0,
          faces: object.geometry.index ? object.geometry.index.count / 3 : 0
        };
      }

      // Adicionar informações de material se disponível
      if (object.material) {
        collection.material = {
          type: object.material.type,
          color: object.material.color?.getHexString() || 'unknown'
        };
      }

      // Processar filhos
      if (object.children && object.children.length > 0) {
        object.children.forEach((child: any) => {
          traverse(child, object.name);
          collection.children.push(child.name || `Child_${child.id}`);
        });
      }

      collections.push(collection);
    };

    traverse(scene);
    this.collections = collections;
    return collections;
  }

  // Extrair título da coleção até o "_"
  extractCollectionTitle(collectionName: string): string {
    const underscoreIndex = collectionName.indexOf('_');
    if (underscoreIndex !== -1) {
      return collectionName.substring(0, underscoreIndex);
    }
    return collectionName;
  }

  // Gerar mapeamentos automáticos baseados na extração de títulos
  generateAutomaticMappings(): CollectionMapping[] {
    const mappings: CollectionMapping[] = [];

    // Códigos da planilha (primeira coluna)
    const budgetCodes = ['1', '1.1', '1.1.1', '1.1.2', '1.1.3', '1.2', '1.2.1', '1.2.2', '1.2.3', '1.3', '1.3.1', '1.3.2', '1.3.3',
                        '2', '2.1', '2.1.1', '2.1.2', '2.1.3', '2.1.4', '2.2', '2.2.1', '2.2.2', '2.2.3', '2.2.4', '2.3', '2.3.1', '2.3.2', '2.3.3',
                        '3', '3.1', '3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.2', '3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.3', '3.3.1', '3.3.2', '3.3.3'];

    console.log('=== GERANDO MAPEAMENTOS AUTOMÁTICOS ===');
    console.log('Códigos da planilha:', budgetCodes);
    console.log('Coleções encontradas:', this.collections.map(c => c.name));

    // Para cada código da planilha, encontrar coleções correspondentes
    budgetCodes.forEach(budgetCode => {
      const matchingCollections: string[] = [];
      const searchPatterns: string[] = [];

      this.collections.forEach(collection => {
        const collectionTitle = this.extractCollectionTitle(collection.name);
        
        // Matching exato
        if (collectionTitle === budgetCode) {
          matchingCollections.push(collection.name);
          searchPatterns.push(collection.name);
          console.log(`✅ MATCH EXATO: ${budgetCode} = ${collection.name}`);
        }
        // Matching por início
        else if (collectionTitle.startsWith(budgetCode)) {
          matchingCollections.push(collection.name);
          searchPatterns.push(collection.name);
          console.log(`✅ MATCH INÍCIO: ${budgetCode} = ${collection.name}`);
        }
        // Matching por contém
        else if (collectionTitle.includes(budgetCode)) {
          matchingCollections.push(collection.name);
          searchPatterns.push(collection.name);
          console.log(`✅ MATCH CONTÉM: ${budgetCode} = ${collection.name}`);
        }
        // Matching com variações (substituir pontos por underscores)
        else {
          const normalizedBudgetCode = budgetCode.replace(/\./g, '_');
          if (collectionTitle === normalizedBudgetCode || 
              collectionTitle.startsWith(normalizedBudgetCode) ||
              collectionTitle.includes(normalizedBudgetCode)) {
            matchingCollections.push(collection.name);
            searchPatterns.push(collection.name);
            console.log(`✅ MATCH NORMALIZADO: ${budgetCode} (${normalizedBudgetCode}) = ${collection.name}`);
          }
        }
      });

      if (matchingCollections.length > 0) {
        mappings.push({
          budgetCode,
          blenderCollections: matchingCollections,
          confidence: 0.95, // Alta confiança para matches exatos
          searchPatterns
        });
      } else {
        console.log(`❌ SEM MATCH: ${budgetCode}`);
      }
    });

    this.mappings = mappings;
    console.log('Mapeamentos gerados:', mappings);
    console.log('=== FIM MAPEAMENTOS ===');
    return mappings;
  }

  // Buscar coleções por código de orçamento
  findCollectionsByBudgetCode(budgetCode: string): BlenderCollection[] {
    const mapping = this.mappings.find(m => m.budgetCode === budgetCode);
    if (!mapping) return [];

    return this.collections.filter(collection => 
      mapping.blenderCollections.includes(collection.name)
    );
  }

  // Buscar coleções por padrão de nome
  findCollectionsByPattern(pattern: string): BlenderCollection[] {
    return this.collections.filter(collection => {
      const name = collection.name.toLowerCase();
      const searchPattern = pattern.toLowerCase();
      
      return name.includes(searchPattern) ||
             name.startsWith(searchPattern) ||
             name.endsWith(searchPattern) ||
             name === searchPattern;
    });
  }

  // Obter estatísticas das coleções
  getCollectionStats() {
    const stats = {
      total: this.collections.length,
      withChildren: this.collections.filter(c => c.children.length > 0).length,
      withUserData: this.collections.filter(c => c.userData && Object.keys(c.userData).length > 0).length,
      withGeometry: this.collections.filter(c => c.geometry).length,
      withMaterial: this.collections.filter(c => c.material).length,
      types: {} as Record<string, number>
    };

    this.collections.forEach(collection => {
      stats.types[collection.type] = (stats.types[collection.type] || 0) + 1;
    });

    return stats;
  }

  // Exportar dados das coleções
  exportCollections(): string {
    return JSON.stringify({
      collections: this.collections,
      mappings: this.mappings,
      stats: this.getCollectionStats(),
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  // Importar dados das coleções
  importCollections(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      this.collections = parsed.collections || [];
      this.mappings = parsed.mappings || [];
      return true;
    } catch (error) {
      console.error('Erro ao importar coleções:', error);
      return false;
    }
  }

  // Obter todas as coleções
  getAllCollections(): BlenderCollection[] {
    return this.collections;
  }

  // Obter todos os mapeamentos
  getAllMappings(): CollectionMapping[] {
    return this.mappings;
  }

  // Limpar dados
  clearData(): void {
    this.collections = [];
    this.mappings = [];
  }
}

// Instância singleton do serviço
export const blenderCollectionService = new BlenderCollectionService();
