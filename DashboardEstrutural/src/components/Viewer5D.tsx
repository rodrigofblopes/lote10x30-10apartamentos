import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { Calculator, Eye, EyeOff, Link, Unlink, Box } from 'lucide-react';

// Componente de loading
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando modelo 3D...</p>
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

// Componente para carregar o modelo GLB com interatividade
interface StructuralModelProps {
  onElementSelect: (elementId: string, elementData: any) => void;
  selectedElementId: string | null;
  linkedElements: string[];
}

function StructuralModel({ onElementSelect, selectedElementId: _selectedElementId, linkedElements: _linkedElements }: StructuralModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Carregar o modelo GLB
  const { scene } = useGLTF('/lote10x30-10apartamentos.glb');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // Adicionar interatividade aos elementos
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Adicionar evento de clique
          (child as any).onClick = (event: any) => {
            event.stopPropagation();
            const elementName = child.name || `Elemento_${child.id}`;
            const elementData = {
              name: elementName,
              id: child.id,
              position: child.position,
              userData: child.userData
            };
            onElementSelect(elementName, elementData);
            console.log('Elemento 3D clicado:', elementName, elementData);
          };
          
          // Adicionar hover effects
          (child as any).onPointerOver = () => {
            document.body.style.cursor = 'pointer';
            if (child.material) {
              child.material.emissive = new THREE.Color(0x222222);
            }
          };
          
          (child as any).onPointerOut = () => {
            document.body.style.cursor = 'auto';
            if (child.material) {
              child.material.emissive = new THREE.Color(0x000000);
            }
          };
        }
      });
      
      console.log('Modelo GLB carregado com sucesso!');
      console.log('Elementos encontrados:', scene.children.length);
    }
  }, [scene, onElementSelect]);

  return (
    <group ref={meshRef}>
      {scene && <primitive object={scene} />}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
    </group>
  );
}

// Componente principal do visualizador 5D
const Viewer5D: React.FC = () => {
  const { itens } = useOrcamentoStore();
  const [selectedElement, setSelectedElement] = useState<{id: string, data: any} | null>(null);
  const [linkedElements, setLinkedElements] = useState<string[]>([]);
  const [show3D, setShow3D] = useState(true);
  const [showSpreadsheet, setShowSpreadsheet] = useState(true);
  const [linkMode, setLinkMode] = useState(false);

  const handleElementSelect = (elementId: string, elementData: any) => {
    setSelectedElement({ id: elementId, data: elementData });
    
    if (linkMode) {
      // Toggle link do elemento
      setLinkedElements(prev => 
        prev.includes(elementId) 
          ? prev.filter(id => id !== elementId)
          : [...prev, elementId]
      );
    }
  };

  const handleItemSelect = (itemId: string) => {
    // Aqui você pode implementar a lógica para destacar elementos 3D
    // baseado no item selecionado da planilha
    console.log('Item da planilha selecionado:', itemId);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  // Filtrar itens que estão linkados (removido por enquanto)
  // const itensLinkados = itens.filter(item => 
  //   linkedElements.some(linkedId => 
  //     item.descricao.toLowerCase().includes(linkedId.toLowerCase()) ||
  //     item.categoria.toLowerCase().includes(linkedId.toLowerCase())
  //   )
  // );

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header e Controles */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl lg:text-2xl font-bold text-blue-700 flex items-center">
              🏗️ Visualizador 5D - Lote 10x30
            </h2>
            <p className="text-sm lg:text-base text-gray-600 mt-2">
              Integração 3D + Orçamento - Linke elementos do modelo com itens da planilha
            </p>
          </div>
          
          {/* Controles */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShow3D(!show3D)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                show3D 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {show3D ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>3D</span>
            </button>
            
            <button
              onClick={() => setShowSpreadsheet(!showSpreadsheet)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                showSpreadsheet 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showSpreadsheet ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>Planilha</span>
            </button>
            
            <button
              onClick={() => setLinkMode(!linkMode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                linkMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {linkMode ? <Unlink className="h-4 w-4" /> : <Link className="h-4 w-4" />}
              <span>Modo Link</span>
            </button>
          </div>
        </div>

        {/* Status do Elemento Selecionado */}
        {selectedElement && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Elemento 3D Selecionado:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">ID:</span> {selectedElement.id}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  linkedElements.includes(selectedElement.id)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {linkedElements.includes(selectedElement.id) ? 'Linkado' : 'Não Linkado'}
                </span>
              </div>
              <div>
                <span className="font-medium">Elementos Linkados:</span> {linkedElements.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualizador 3D */}
        {show3D && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 text-white px-4 py-2">
              <h3 className="font-semibold flex items-center">
                <Box className="h-5 w-5 mr-2" />
                Modelo 3D - Vila Andriw
              </h3>
            </div>
            <div className="h-96 lg:h-[500px] relative">
              <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
                <Suspense fallback={<Loader />}>
                  <StructuralModel 
                    onElementSelect={handleElementSelect}
                    selectedElementId={selectedElement?.id || null}
                    linkedElements={linkedElements}
                  />
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                  />
                  <Environment preset="sunset" />
                </Suspense>
              </Canvas>
              
              {/* Overlay de Instruções */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
                <p className="font-semibold mb-2">Instruções:</p>
                <p>• Clique nos elementos 3D para selecionar</p>
                <p>• Ative "Modo Link" para linkar elementos</p>
                <p>• Use mouse para navegar no 3D</p>
              </div>
            </div>
          </div>
        )}

        {/* Planilha de Orçamento */}
        {showSpreadsheet && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 text-white px-4 py-2">
              <h3 className="font-semibold flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Orçamento Estrutural
              </h3>
            </div>
            
            <div className="overflow-x-auto max-h-96 lg:max-h-[500px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      M.O.
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itens.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedElement && item.descricao.toLowerCase().includes(selectedElement.id.toLowerCase())
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : ''
                      }`}
                      onClick={() => handleItemSelect(item.id)}
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                        {item.codigo}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 max-w-[200px] truncate" title={item.descricao}>
                        {item.descricao}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {item.quantidade.toFixed(2)} {item.unidade}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {formatarMoeda(item.maoDeObra)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {formatarMoeda(item.materiais)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-blue-600">
                        {formatarMoeda(item.total)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          linkedElements.some(linkedId => 
                            item.descricao.toLowerCase().includes(linkedId.toLowerCase())
                          )
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {linkedElements.some(linkedId => 
                            item.descricao.toLowerCase().includes(linkedId.toLowerCase())
                          ) ? 'Linkado' : 'Não'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Resumo dos Elementos Linkados */}
      {linkedElements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Link className="h-5 w-5 mr-2 text-purple-600" />
            Elementos Linkados ({linkedElements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedElements.map((elementId, index) => (
              <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-800">{elementId}</span>
                  <button
                    onClick={() => setLinkedElements(prev => prev.filter(id => id !== elementId))}
                    className="text-purple-600 hover:text-purple-800 text-xs"
                  >
                    <Unlink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instruções de Uso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-blue-800 mb-3">
          💡 Como Usar o Visualizador 5D:
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="mb-2"><strong>1.</strong> Clique nos elementos 3D para selecioná-los</p>
            <p className="mb-2"><strong>2.</strong> Ative "Modo Link" para linkar elementos</p>
            <p className="mb-2"><strong>3.</strong> Clique nos itens da planilha para destacar</p>
          </div>
          <div>
            <p className="mb-2"><strong>4.</strong> Use os botões para mostrar/ocultar 3D e planilha</p>
            <p className="mb-2"><strong>5.</strong> Elementos linkados ficam destacados</p>
            <p className="mb-2"><strong>6.</strong> Navegue no 3D com mouse (arrastar, zoom, rotação)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer5D;
