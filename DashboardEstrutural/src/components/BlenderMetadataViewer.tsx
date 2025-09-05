import React, { useState, useEffect } from 'react';
import { 
  mapBlenderToBudget, 
  exportBlenderMappings,
  BlenderElement,
  BlenderMetadata 
} from '../services/blenderMetadataService';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { 
  Download, 
  Eye, 
  Settings, 
  Check, 
  AlertTriangle,
  Search,
  Box,
  Database
} from 'lucide-react';

interface BlenderMetadataViewerProps {
  onClose: () => void;
}

const BlenderMetadataViewer: React.FC<BlenderMetadataViewerProps> = ({ onClose }) => {
  const { itens } = useOrcamentoStore();
  const [metadata, setMetadata] = useState<BlenderMetadata | null>(null);
  const [mappings, setMappings] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<BlenderElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showUnmapped, setShowUnmapped] = useState(false);

  // Carregar metadados do GLB
  useEffect(() => {
    loadBlenderMetadata();
  }, []);

  const loadBlenderMetadata = async () => {
    try {
      // Simular carregamento do GLB (em produção, isso viria do useGLTF)
      const mockMetadata: BlenderMetadata = {
        version: "1.0.0",
        blenderVersion: "4.0.0",
        exportDate: new Date().toISOString(),
        projectName: "Vila Andriw",
        elements: [
          {
            id: "pilar_001",
            name: "Pilar Central",
            type: "Mesh",
            category: "Estrutura",
            budgetCode: "103355",
            budgetDescription: "ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS",
            material: "Concreto",
            dimensions: { width: 0.3, height: 3.0, depth: 0.3 },
            position: { x: 0, y: 1.5, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            customProperties: { budgetCode: "103355", material: "Concreto" },
            children: []
          },
          {
            id: "viga_001",
            name: "Viga Principal",
            type: "Mesh",
            category: "Estrutura",
            budgetCode: "87905",
            budgetDescription: "CHAPISCO APLICADO EM ALVENARIA",
            material: "Concreto",
            dimensions: { width: 0.2, height: 0.4, depth: 4.0 },
            position: { x: 0, y: 3.0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            customProperties: { budgetCode: "87905", material: "Concreto" },
            children: []
          }
        ],
        materials: [
          {
            name: "Concreto",
            type: "MeshStandardMaterial",
            properties: { color: "#8B8B8B", roughness: 0.8, metalness: 0.1 }
          }
        ],
        scenes: [
          {
            name: "Scene",
            elements: ["pilar_001", "viga_001"]
          }
        ]
      };

      setMetadata(mockMetadata);
      
      // Criar mapeamentos automáticos
      const autoMappings = mapBlenderToBudget(mockMetadata.elements, itens);
      setMappings(autoMappings);
      
    } catch (error) {
      console.error('Erro ao carregar metadados do Blender:', error);
    }
  };

  const handleExport = (format: 'json' | 'csv' | 'blender') => {
    if (mappings.length === 0) {
      alert('Nenhum mapeamento para exportar');
      return;
    }

    const data = exportBlenderMappings(mappings, format);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blender-mappings-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredElements = metadata?.elements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.budgetCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || element.category === filterCategory;
    const matchesUnmapped = !showUnmapped || !element.budgetCode;
    
    return matchesSearch && matchesCategory && matchesUnmapped;
  }) || [];

  const categories = [...new Set(metadata?.elements.map(el => el.category) || [])];
  const mappedCount = mappings.filter(m => m.budgetItem).length;
  const totalCount = mappings.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Database className="h-6 w-6 mr-2" />
            Metadados do Blender - Vila Andriw
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Status */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">{totalCount} elementos</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">{mappedCount} mapeados</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">{totalCount - mappedCount} não mapeados</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">{metadata?.materials.length || 0} materiais</span>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="p-4 border-b flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar elementos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showUnmapped}
              onChange={(e) => setShowUnmapped(e.target.checked)}
            />
            <span className="text-sm">Apenas não mapeados</span>
          </label>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              onClick={() => handleExport('blender')}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              <Download className="h-4 w-4" />
              Blender
            </button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de Elementos */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Box className="h-5 w-5 mr-2" />
                Elementos do Blender ({filteredElements.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredElements.map((element) => (
                  <div
                    key={element.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedElement?.id === element.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedElement(element)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{element.name}</div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        element.budgetCode
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {element.budgetCode ? 'Mapeado' : 'Não mapeado'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Categoria:</strong> {element.category}</div>
                      {element.budgetCode && (
                        <div><strong>Código:</strong> {element.budgetCode}</div>
                      )}
                      {element.dimensions && (
                        <div><strong>Dimensões:</strong> {element.dimensions.width.toFixed(2)} × {element.dimensions.height.toFixed(2)} × {element.dimensions.depth.toFixed(2)}m</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detalhes do Elemento Selecionado */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Detalhes do Elemento
              </h3>
              {selectedElement ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <strong>Nome:</strong> {selectedElement.name}
                    </div>
                    <div>
                      <strong>ID:</strong> {selectedElement.id}
                    </div>
                    <div>
                      <strong>Tipo:</strong> {selectedElement.type}
                    </div>
                    <div>
                      <strong>Categoria:</strong> {selectedElement.category}
                    </div>
                    {selectedElement.budgetCode && (
                      <div>
                        <strong>Código do Orçamento:</strong> {selectedElement.budgetCode}
                      </div>
                    )}
                    {selectedElement.budgetDescription && (
                      <div>
                        <strong>Descrição:</strong> {selectedElement.budgetDescription}
                      </div>
                    )}
                    {selectedElement.material && (
                      <div>
                        <strong>Material:</strong> {selectedElement.material}
                      </div>
                    )}
                    {selectedElement.dimensions && (
                      <div>
                        <strong>Dimensões:</strong> {selectedElement.dimensions.width.toFixed(2)} × {selectedElement.dimensions.height.toFixed(2)} × {selectedElement.dimensions.depth.toFixed(2)}m
                      </div>
                    )}
                    <div>
                      <strong>Posição:</strong> ({selectedElement.position.x.toFixed(2)}, {selectedElement.position.y.toFixed(2)}, {selectedElement.position.z.toFixed(2)})
                    </div>
                    {Object.keys(selectedElement.customProperties).length > 0 && (
                      <div>
                        <strong>Propriedades Customizadas:</strong>
                        <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(selectedElement.customProperties, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  Selecione um elemento para ver os detalhes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlenderMetadataViewer;
