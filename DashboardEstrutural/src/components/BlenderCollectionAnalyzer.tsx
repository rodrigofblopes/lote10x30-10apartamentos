import React, { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box, Download, Eye, Search } from 'lucide-react';
import { blenderCollectionService } from '../services/blenderCollectionService';

interface CollectionInfo {
  name: string;
  type: string;
  children: string[];
  parent?: string;
  id: number;
  userData?: any;
}

interface BlenderCollectionAnalyzerProps {
  onCollectionsFound?: (collections: CollectionInfo[]) => void;
}

const BlenderCollectionAnalyzer: React.FC<BlenderCollectionAnalyzerProps> = ({ 
  onCollectionsFound 
}) => {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<CollectionInfo | null>(null);

  // Carregar o modelo GLB
  const { scene } = useGLTF('/Estrutural.glb');

  // Função para extrair informações das coleções
  const extractCollections = (scene: any): CollectionInfo[] => {
    const collections: CollectionInfo[] = [];
    const processed = new Set<string>();

    const traverse = (object: any, parentName?: string) => {
      if (!object || processed.has(object.uuid)) return;
      processed.add(object.uuid);

      const collectionInfo: CollectionInfo = {
        name: object.name || `Unnamed_${object.id}`,
        type: object.type,
        children: [],
        parent: parentName,
        id: object.id,
        userData: object.userData
      };

      // Adicionar informações específicas do Blender
      if (object.userData) {
        collectionInfo.userData = object.userData;
      }

      // Processar filhos
      if (object.children && object.children.length > 0) {
        object.children.forEach((child: any) => {
          traverse(child, object.name);
          collectionInfo.children.push(child.name || `Child_${child.id}`);
        });
      }

      collections.push(collectionInfo);
    };

    traverse(scene);
    return collections;
  };

  // Analisar coleções quando o modelo carregar
  useEffect(() => {
    if (scene) {
      setIsAnalyzing(true);
      try {
        const extractedCollections = extractCollections(scene);
        setCollections(extractedCollections);
        
        if (onCollectionsFound) {
          onCollectionsFound(extractedCollections);
        }
        
        console.log('=== COLEÇÕES ENCONTRADAS NO GLB ===');
        console.log('Total de objetos:', extractedCollections.length);
        console.log('Coleções:', extractedCollections);
        console.log('=== FIM ANÁLISE ===');
      } catch (error) {
        console.error('Erro ao analisar coleções:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  }, [scene, onCollectionsFound]);

  // Filtrar coleções baseado na busca
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para exportar dados das coleções
  const exportCollections = () => {
    const dataStr = JSON.stringify(collections, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blender_collections.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Box className="h-5 w-5 mr-2" />
          Analisador de Coleções Blender
        </h3>
        <button
          onClick={exportCollections}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </button>
      </div>

      {/* Barra de busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar coleções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status da análise */}
      {isAnalyzing && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700 text-sm">Analisando coleções do modelo GLB...</p>
        </div>
      )}

      {/* Estatísticas */}
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-lg font-semibold text-gray-800">{collections.length}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Filtrados</p>
          <p className="text-lg font-semibold text-gray-800">{filteredCollections.length}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Com Filhos</p>
          <p className="text-lg font-semibold text-gray-800">
            {collections.filter(c => c.children.length > 0).length}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Com UserData</p>
          <p className="text-lg font-semibold text-gray-800">
            {collections.filter(c => c.userData && Object.keys(c.userData).length > 0).length}
          </p>
        </div>
      </div>

      {/* Lista de coleções */}
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedCollection?.id === collection.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCollection(collection)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{collection.name}</span>
                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">
                      Título: {blenderCollectionService.extractCollectionTitle(collection.name)}
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      {collection.type}
                    </span>
                    {collection.children.length > 0 && (
                      <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
                        {collection.children.length} filhos
                      </span>
                    )}
                  </div>
                  {collection.parent && (
                    <p className="text-xs text-gray-500 mt-1">Pai: {collection.parent}</p>
                  )}
                  {collection.userData && Object.keys(collection.userData).length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      UserData: {Object.keys(collection.userData).join(', ')}
                    </p>
                  )}
                </div>
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhes da coleção selecionada */}
      {selectedCollection && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h4 className="font-semibold text-gray-800 mb-2">Detalhes da Coleção</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Nome:</strong> {selectedCollection.name}</p>
            <p><strong>Tipo:</strong> {selectedCollection.type}</p>
            <p><strong>ID:</strong> {selectedCollection.id}</p>
            {selectedCollection.parent && (
              <p><strong>Pai:</strong> {selectedCollection.parent}</p>
            )}
            {selectedCollection.children.length > 0 && (
              <div>
                <p><strong>Filhos:</strong></p>
                <ul className="ml-4 list-disc">
                  {selectedCollection.children.map((child, index) => (
                    <li key={index}>{child}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedCollection.userData && (
              <div>
                <p><strong>UserData:</strong></p>
                <pre className="ml-4 text-xs bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(selectedCollection.userData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlenderCollectionAnalyzer;
