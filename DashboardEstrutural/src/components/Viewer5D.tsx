import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Calculator, Box, Search, Zap, Eye, RotateCcw } from 'lucide-react';
import { carregarDados5D } from '../services/orcamento5DService';

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

// Componente para carregar o modelo GLB com highlighting
interface StructuralModelProps {
  highlightedElements: string[];
  onElementsExtracted?: (elements: string[]) => void;
}

function StructuralModel({ highlightedElements, onElementsExtracted }: StructuralModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Carregar o modelo GLB
  const { scene } = useGLTF('/Estrutural.glb');
  
  // Extrair elementos quando o modelo for carregado
  useEffect(() => {
    if (scene && onElementsExtracted) {
      const elements: string[] = [];
    
    scene.traverse((child) => {
      if (child.name && child.name.trim() !== '') {
          elements.push(child.name);
        }
      });
      
      console.log('📦 ===== ELEMENTOS 3D EXTRAÍDOS =====');
      console.log('📦 Total de elementos:', elements.length);
      console.log('📦 Primeiros 10 elementos:', elements.slice(0, 10));
      console.log('📦 Elementos com underscore:', elements.filter(el => el.includes('_')).slice(0, 10));
      console.log('📦 Todos os elementos:', elements);
      onElementsExtracted(elements);
    }
  }, [scene, onElementsExtracted]);

  // Aplicar highlighting aos elementos selecionados
  useEffect(() => {
    console.log('🎨 ===== INICIANDO HIGHLIGHTING =====');
    console.log('🎨 Elementos para destacar:', highlightedElements.length);
    console.log('🎨 Lista completa:', highlightedElements);
    console.log('🎨 Scene disponível:', !!scene);
    
    if (scene) {
      let highlightedCount = 0;
      let totalMeshes = 0;
      let foundElements: string[] = [];
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          totalMeshes++;
          const isHighlighted = highlightedElements.includes(child.name);
          
          if (isHighlighted) {
            highlightedCount++;
            foundElements.push(child.name);
            console.log(`🟠 DESTACANDO: ${child.name}`);
            
            // Verificar se o material existe
            if (child.material) {
              // Salvar material original se ainda não foi salvo
              if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material.clone();
                console.log(`💾 Material original salvo para: ${child.name}`);
              }
              
              // Criar novo material laranja muito contrastante
              const newMaterial = child.material.clone();
              newMaterial.color.setHex(0xff0000); // Vermelho muito vibrante para teste
              newMaterial.emissive.setHex(0x440000); // Brilho vermelho
              newMaterial.metalness = 0.0;
              newMaterial.roughness = 0.1;
              newMaterial.needsUpdate = true;
              
              // Aplicar novo material
              child.material = newMaterial;
              
              // Forçar atualização do material
              if (child.material.map) {
                child.material.map.needsUpdate = true;
              }
              
              console.log(`✅ MATERIAL LARANJA APLICADO: ${child.name}`);
            } else {
              console.log(`⚠️ Material não encontrado para: ${child.name}`);
            }
          } else {
            // Voltar ao material original
            if (child.userData.originalMaterial) {
              child.material = child.userData.originalMaterial;
              console.log(`🔄 Material original restaurado para: ${child.name}`);
            } else if (child.material && child.material.color) {
              // Fallback: aplicar cor cinza
              child.material.color.setHex(0xcccccc);
              child.material.emissive.setHex(0x000000);
              child.material.needsUpdate = true;
            }
          }
        }
      });
      
      console.log(`🎨 ===== RESULTADO HIGHLIGHTING =====`);
      console.log(`🎨 Total de meshes: ${totalMeshes}`);
      console.log(`🎨 Meshes destacados: ${highlightedCount}`);
      console.log(`🎨 Elementos encontrados:`, foundElements);
      console.log(`🎨 Elementos não encontrados:`, highlightedElements.filter(el => !foundElements.includes(el)));
    } else {
      console.log('❌ Scene não disponível para highlighting');
    }
  }, [scene, highlightedElements]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
        <primitive object={scene} />
    </group>
  );
}

// Hook personalizado para gerenciar o linking
function usePlanilha3DLink() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);
  const [glbElements, setGlbElements] = useState<string[]>([]);
  const [linkingStats, setLinkingStats] = useState({ total: 0, linked: 0 });

  // Mapa otimizado de correspondências
  const elementMap = useMemo(() => {
    const map = new Map<string, string[]>();
    
    console.log('🗺️ ===== CRIANDO MAPA DE ELEMENTOS =====');
    console.log('🗺️ Total de elementos GLB:', glbElements.length);
    
    glbElements.forEach(elementName => {
      // Múltiplas estratégias para extrair o código
      let code = null;
      let strategy = '';
      
      // Estratégia 1: Buscar padrão "1.2" no início
      const match1 = elementName.match(/^(\d+\.\d+)/);
      if (match1) {
        code = match1[1];
        strategy = 'Estratégia 1 (regex X.Y)';
      }
      
      // Estratégia 2: Se não encontrou, buscar "1.2_" e remover o underscore
      if (!code) {
        const match2 = elementName.match(/^(\d+\.\d+)_/);
        if (match2) {
          code = match2[1];
          strategy = 'Estratégia 2 (regex X.Y_)';
        }
      }
      
      // Estratégia 3: Se ainda não encontrou, usar os primeiros 3 caracteres se contém ponto
      if (!code && elementName.length >= 3 && elementName.includes('.')) {
        const firstThree = elementName.substring(0, 3);
        if (firstThree.match(/\d+\.\d/)) {
          code = firstThree;
          strategy = 'Estratégia 3 (primeiros 3 chars)';
        }
      }
      
      if (code) {
        if (!map.has(code)) {
          map.set(code, []);
        }
        map.get(code)!.push(elementName);
        
        // Log apenas para os primeiros elementos de cada código
        if (map.get(code)!.length === 1) {
          console.log(`✅ ${strategy}: "${elementName}" → código "${code}"`);
        }
      } else {
        console.log(`❌ Não foi possível extrair código de: "${elementName}"`);
      }
    });
    
    console.log('🗺️ Prefixos encontrados (padrão X.Y):', Array.from(map.keys()));
    console.log('🗺️ Mapa completo:', Object.fromEntries(map));

    return map;
  }, [glbElements]);

  // Função otimizada para encontrar elementos correspondentes
  const findMatchingElements = useCallback((itemId: string): string[] => {
    const cleanItemId = itemId.trim();
    console.log('🔍 ===== BUSCANDO ELEMENTOS =====');
    console.log('🔍 Item ID original:', itemId);
    console.log('🔍 Item ID limpo:', cleanItemId);
    console.log('🔍 Prefixos disponíveis:', Array.from(elementMap.keys()));
    
    // Buscar usando o código da planilha (ex: "1.1")
    const result = elementMap.get(cleanItemId) || [];
    console.log('🔍 Buscando no mapa:', elementMap.has(cleanItemId));
    console.log('🔍 Resultado encontrado:', result.length, 'elementos');
    console.log('🔍 Elementos:', result.slice(0, 5));
    
    return result;
  }, [elementMap]);

  // Atualizar estatísticas de linking
  useEffect(() => {
    const linkedItems = Array.from(elementMap.keys()).length;
    setLinkingStats({ total: glbElements.length, linked: linkedItems });
  }, [elementMap, glbElements.length]);

  return {
    selectedItems,
    highlightedElements,
    glbElements,
    linkingStats,
    setGlbElements,
    setHighlightedElements,
    setSelectedItems,
    findMatchingElements,
    handleItemSelect: useCallback((item: any) => {
      const itemId = item.id;
      console.log('🖱️ ===== ITEM CLICADO =====');
      console.log('🖱️ Item completo:', item);
      console.log('🖱️ ID do item:', itemId);
      console.log('🖱️ Código do item:', item.codigo);
      console.log('🖱️ Descrição:', item.descricao);
      
      setSelectedItems(prev => {
        const isSelected = prev.includes(itemId);
        const newSelection = isSelected 
          ? prev.filter(id => id !== itemId)
          : [itemId]; // Sempre selecionar apenas um item por vez
        
        console.log('🔄 ===== ATUALIZANDO SELEÇÃO =====');
        console.log('🔄 Seleção anterior:', prev);
        console.log('🔄 Nova seleção:', newSelection);
        
        // Encontrar todos os elementos 3D correspondentes
        const allMatchingElements: string[] = [];
        newSelection.forEach(selectedId => {
          const matches = elementMap.get(selectedId.trim()) || [];
          console.log(`🔍 Buscando elementos para "${selectedId}":`, matches);
          allMatchingElements.push(...matches);
        });
        
        console.log('🔗 ===== RESULTADO LINKING =====');
        console.log('🔗 Item selecionado:', item.descricao);
        console.log('🔗 Total de itens selecionados:', newSelection.length);
        console.log('🔗 Total de elementos 3D encontrados:', allMatchingElements.length);
        console.log('🔗 Lista completa de elementos:', allMatchingElements);
        
        // Alerta visual para confirmar clique
        if (allMatchingElements.length > 0) {
          alert(`🎯 ${allMatchingElements.length} elementos 3D encontrados para "${item.descricao}"!\n\nElementos: ${allMatchingElements.slice(0, 3).join(', ')}${allMatchingElements.length > 3 ? '...' : ''}`);
        } else {
          alert(`⚠️ Nenhum elemento 3D encontrado para "${item.descricao}"\n\nCódigo: ${itemId}`);
        }
        
        setHighlightedElements(allMatchingElements);
        return newSelection;
      });
    }, [elementMap])
  };
}

// Componente principal do Viewer 5D
export default function Viewer5D() {
  const [itens5D, setItens5D] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    selectedItems,
    highlightedElements,
    glbElements,
    linkingStats,
    setGlbElements,
    setHighlightedElements,
    setSelectedItems,
    handleItemSelect
  } = usePlanilha3DLink();

  // Carregar dados da planilha 5DEST.csv
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const dados = await carregarDados5D();
        setItens5D(dados);
        console.log('✅ Dados da planilha 5DEST.csv carregados:', dados.length, 'itens');
        console.log('📋 Primeiros itens:', dados.slice(0, 5).map(item => ({
          id: item.id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          total: item.total
        })));
      } catch (err) {
        console.error('❌ Erro ao carregar dados da planilha 5DEST.csv:', err);
        setError('Erro ao carregar dados da planilha 5DEST.csv');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  // Callback para elementos extraídos do modelo 3D
  const handleElementsExtracted = useCallback((elements: string[]) => {
    setGlbElements(elements);
    console.log('🎯 Elementos 3D carregados:', elements.length);
  }, [setGlbElements]);

  // Reset da seleção
  const handleReset = () => {
    setHighlightedElements([]);
    setSelectedItems([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Carregando Dashboard 5D</h2>
          <p className="text-gray-500">Preparando modelo 3D e dados orçamentários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro no Carregamento</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const totalSelecionado = itens5D
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header Melhorado */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Calculator className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard 5D</h1>
                  <p className="text-sm text-gray-500">Lote 10x30 - 10 Apartamentos</p>
                </div>
              </div>
              
              {totalSelecionado > 0 && (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium">Valor Selecionado</div>
                  <div className="text-lg font-bold">
                    R$ {totalSelecionado.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Box className="h-4 w-4 text-blue-600" />
                <span>Modelo 3D</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {glbElements.length} elementos
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Search className="h-4 w-4 text-green-600" />
                <span>Planilha</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {itens5D.length} itens
                </span>
              </div>
              
              {linkingStats.linked > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span>Linking</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                    {linkingStats.linked} vinculados
                  </span>
                </div>
              )}
              
              {highlightedElements.length > 0 && (
                <>
                  <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{highlightedElements.length} destacados</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Limpar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
        {/* Visualizador 3D */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Box className="h-5 w-5 mr-2" />
                Modelo Estrutural 3D
                {highlightedElements.length > 0 && (
                  <span className="ml-2 bg-orange-400 text-orange-900 px-2 py-1 rounded text-xs font-medium">
                    {highlightedElements.length} em destaque
                  </span>
                )}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Clique nos itens da planilha para destacar no modelo
              </p>
            </div>
            
            <div className="h-96 lg:h-[520px]">
              <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
                <Suspense fallback={<Loader />}>
                  <Environment preset="sunset" />
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <StructuralModel 
                    highlightedElements={highlightedElements}
                    onElementsExtracted={handleElementsExtracted}
                  />
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={5}
                    maxDistance={50}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* Planilha Orçamentária */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Planilha Orçamentária
                {selectedItems.length > 0 && (
                  <span className="ml-2 bg-blue-400 text-blue-900 px-2 py-1 rounded text-xs font-medium">
                    {selectedItems.length} selecionados
                  </span>
                )}
              </h3>
              <p className="text-green-100 text-sm mt-1">
                {itens5D.length} itens carregados • Clique para destacar no 3D
              </p>
            </div>
            
            <div className="max-h-[520px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Unidade
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Quantidade
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Valor Unit.
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itens5D.map((item, index) => {
                    const isSelected = selectedItems.includes(item.id);
                      const isEtapaTotal = item.isEtapaTotal;
                      
                      return (
                        <tr 
                        key={item.id || index}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'bg-orange-50 border-l-4 border-orange-500 shadow-md transform scale-[1.02]' 
                            : isEtapaTotal 
                              ? 'bg-gray-50 hover:bg-gray-100 font-semibold' 
                              : 'hover:bg-gray-50 hover:shadow-sm'
                        }`}
                        onClick={() => !isEtapaTotal && handleItemSelect(item)}
                      >
                        <td className={`px-3 py-3 whitespace-nowrap text-xs font-medium ${
                          isEtapaTotal ? 'text-blue-800' : isSelected ? 'text-orange-800' : 'text-gray-900'
                        }`}>
                        {item.codigo || item.id}
                      </td>
                        <td className={`px-3 py-3 text-xs max-w-[120px] sm:max-w-[150px] lg:max-w-[200px] truncate ${
                          isEtapaTotal ? 'font-bold text-blue-800' : isSelected ? 'font-medium text-orange-800' : 'text-gray-900'
                      }`} title={item.descricao}>
                        {item.descricao}
                      </td>
                        <td className={`px-3 py-3 whitespace-nowrap text-xs hidden md:table-cell ${
                          isEtapaTotal ? 'font-bold text-blue-800' : isSelected ? 'text-orange-700' : 'text-gray-500'
                        }`}>
                          {item.unidade || '-'}
                        </td>
                        <td className={`px-3 py-3 whitespace-nowrap text-xs hidden lg:table-cell ${
                          isEtapaTotal ? 'font-bold text-blue-800' : isSelected ? 'text-orange-700' : 'text-gray-500'
                        }`}>
                          {item.quantidade ? item.quantidade.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 1, 
                            maximumFractionDigits: 1 
                          }) : '-'}
                      </td>
                        <td className={`px-3 py-3 whitespace-nowrap text-xs hidden lg:table-cell ${
                          isEtapaTotal ? 'font-bold text-blue-800' : isSelected ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                          {item.valorUnitario ? `R$ ${item.valorUnitario.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}` : '-'}
                      </td>
                        <td className={`px-3 py-3 whitespace-nowrap text-xs font-medium ${
                          isEtapaTotal ? 'font-bold text-blue-800' : isSelected ? 'font-bold text-orange-800' : 'text-gray-900'
                      }`}>
                          R$ {item.total.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                      </td>
                        <td className={`px-3 py-3 whitespace-nowrap text-xs hidden xl:table-cell ${
                          isSelected ? 'text-orange-600 font-medium' : 'text-gray-400'
                      }`}>
                          {isSelected ? '🟠 Destacado' : isEtapaTotal ? '📊 Total' : '⚪ Normal'}
                      </td>
                    </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
    </div>
  );
}