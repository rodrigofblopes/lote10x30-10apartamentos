import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { carregarDados5D } from '../services/orcamento5DService';
import { Calculator, Box, Search, Settings } from 'lucide-react';
import { generateSearchPatterns, getElementColor, getElementType } from '../config/elementLinkingConfig';
import BlenderCollectionAnalyzer from './BlenderCollectionAnalyzer';
import { blenderCollectionService, BlenderCollection } from '../services/blenderCollectionService';


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
  highlightedElements: string[];
  blenderCollections?: BlenderCollection[];
}

function StructuralModel({ highlightedElements, blenderCollections = [] }: StructuralModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Carregar o modelo GLB com coleções renomeadas
  const { scene } = useGLTF('/Estrutural.glb');
  
  // Extrair coleções do modelo GLB
  const extractCollections = (scene: THREE.Group): string[] => {
    const collections: string[] = [];
    
    scene.traverse((child) => {
      if (child.name && child.name.trim() !== '') {
        collections.push(child.name);
      }
    });
    
    return collections;
  };
  
  // Expor coleções para o componente pai
  useEffect(() => {
    if (scene) {
      const collections = extractCollections(scene);
      console.log('Coleções encontradas no GLB:', collections);
      // Aqui você pode passar as coleções para o componente pai se necessário
    }
  }, [scene]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // Função para aplicar materiais baseados no nome do elemento
  const applyMaterialByElementName = (mesh: THREE.Mesh, elementName: string) => {
    const name = elementName.toLowerCase();
    
    // Criar materiais específicos para cada tipo de elemento
    if (name.includes('pilar') || name.includes('coluna') || name.includes('column')) {
      // Concreto armado - cinza com textura
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#8B8B8B',
        roughness: 0.8,
        metalness: 0.1,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('viga') || name.includes('beam')) {
      // Vigas - cinza mais escuro
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#696969',
        roughness: 0.7,
        metalness: 0.2,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('laje') || name.includes('slab')) {
      // Lajes - cinza claro
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#A9A9A9',
        roughness: 0.9,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('parede') || name.includes('wall')) {
      // Paredes - cor de tijolo
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#CD853F',
        roughness: 0.8,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('janela') || name.includes('window') || name.includes('vidro')) {
      // Vidros - azul transparente
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#87CEEB',
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.7,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('porta') || name.includes('door')) {
      // Portas - madeira
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#8B4513',
        roughness: 0.9,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else {
      // Material padrão - concreto
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#8B8B8B',
        roughness: 0.8,
        metalness: 0.1,
        emissive: new THREE.Color(0x000000)
      });
    }
  };

  // Aplicar materiais aos elementos
  useEffect(() => {
    if (scene) {
      const allObjectNames: string[] = [];
      const allChildren: any[] = [];
      const meshObjects: any[] = [];
      
      scene.traverse((child) => {
        const childInfo = {
          name: child.name,
          type: child.type,
          id: child.id,
          isMesh: child instanceof THREE.Mesh,
          parent: child.parent?.name || 'root'
        };
        
        allChildren.push(childInfo);
        
        if (child instanceof THREE.Mesh) {
          const elementName = child.name || `Elemento_${child.id}`;
          allObjectNames.push(elementName);
          meshObjects.push({
            name: child.name,
            id: child.id,
            type: child.type,
            parent: child.parent?.name || 'root'
          });
          
          // Aplicar material baseado no nome
          applyMaterialByElementName(child, elementName);
        }
      });
      
      // Filtrar nomes que começam com números (códigos da planilha)
      const numericNames = allObjectNames.filter(name => /^\d/.test(name));
      const numericMeshes = meshObjects.filter(mesh => mesh.name && /^\d/.test(mesh.name));
      
      console.log('=== INFORMAÇÕES DO MODELO GLB ===');
      console.log('Modelo GLB carregado com sucesso!');
      console.log('Total de objetos na cena:', allChildren.length);
      console.log('Total de meshes:', meshObjects.length);
      console.log('NOMES DE TODOS OS OBJETOS NA CENA:', allObjectNames);
      console.log('NOMES QUE COMEÇAM COM NÚMEROS (códigos):', numericNames);
      console.log('MESHES COM CÓDIGOS NUMÉRICOS:', numericMeshes);
      console.log('MESHES (objetos 3D):', meshObjects);
      console.log('DETALHES COMPLETOS DOS OBJETOS:', allChildren);
      console.log('=== FIM INFORMAÇÕES ===');
    }
  }, [scene]);


  return (
    <group ref={meshRef}>
      {scene && (
        <primitive object={scene} />
      )}
      
      {/* Renderizar elementos destacados com cores diferentes */}
      {highlightedElements.map((elementId) => {
        console.log('Tentando destacar elemento:', elementId);
        
        // Encontrar o objeto correspondente na cena
        let targetObject: THREE.Object3D | null = null;
        if (scene) {
          scene.traverse((child) => {
            const childName = child.name || '';
            console.log('Verificando objeto na cena:', childName);
            
            // Função de matching melhorada usando coleções analisadas
            const isMatch = (searchPattern: string, objectName: string): boolean => {
              console.log(`🔍 Verificando match: "${searchPattern}" vs "${objectName}"`);
              
              // Matching exato
              if (objectName === searchPattern) {
                console.log(`✅ MATCH EXATO: ${objectName}`);
                return true;
              }
              
              // Matching por início (mais comum para coleções)
              if (objectName.startsWith(searchPattern)) {
                console.log(`✅ MATCH INÍCIO: ${objectName} starts with ${searchPattern}`);
                return true;
              }
              
              // Matching específico para padrões de coleção do Blender
              if (searchPattern.endsWith('_') && objectName.startsWith(searchPattern)) {
                console.log(`✅ MATCH UNDERSCORE: ${objectName} starts with ${searchPattern}`);
                return true;
              }
              
              // Matching para padrões como "2.1_.001" (com underscore e ponto)
              if (searchPattern.includes('_.') && objectName.startsWith(searchPattern)) {
                console.log(`✅ MATCH PONTO: ${objectName} starts with ${searchPattern}`);
                return true;
              }
              
              // Matching por contém (para casos como "2.1_.001" contém "2.1_")
              if (objectName.includes(searchPattern)) {
                console.log(`✅ MATCH CONTÉM: ${objectName} contains ${searchPattern}`);
                return true;
              }
              
              // Matching com variações de separadores
              const normalizedPattern = searchPattern.replace(/[._-]/g, '');
              const normalizedName = objectName.replace(/[._-]/g, '');
              if (normalizedName.startsWith(normalizedPattern)) {
                console.log(`✅ MATCH NORMALIZADO: ${objectName} normalized starts with ${searchPattern} normalized`);
                return true;
              }
              
              // Matching hierárquico para coleções
              if (searchPattern.includes('.') && !searchPattern.endsWith('_')) {
                const basePattern = searchPattern + '_.';
                if (objectName.startsWith(basePattern)) {
                  console.log(`✅ MATCH HIERÁRQUICO 1: ${objectName} starts with ${basePattern}`);
                  return true;
                }
                
                const basePattern2 = searchPattern + '_';
                if (objectName.startsWith(basePattern2)) {
                  console.log(`✅ MATCH HIERÁRQUICO 2: ${objectName} starts with ${basePattern2}`);
                  return true;
                }
              }
              
              // Matching usando coleções analisadas
              const matchingCollection = blenderCollections.find(collection => 
                collection.name === objectName
              );
              
              if (matchingCollection) {
                console.log(`📋 Coleção encontrada: ${matchingCollection.name}`);
                
                // Verificar se a coleção corresponde ao padrão de busca
                const collectionName = matchingCollection.name.toLowerCase();
                const searchLower = searchPattern.toLowerCase();
                
                if (collectionName.includes(searchLower) || 
                    collectionName.startsWith(searchLower) ||
                    collectionName.endsWith(searchLower)) {
                  console.log(`✅ MATCH COLEÇÃO: ${matchingCollection.name} matches ${searchPattern}`);
                  return true;
                }
                
                // Verificar userData se disponível
                if (matchingCollection.userData) {
                  const userDataStr = JSON.stringify(matchingCollection.userData).toLowerCase();
                  if (userDataStr.includes(searchLower)) {
                    console.log(`✅ MATCH USERDATA: ${matchingCollection.name} userData contains ${searchPattern}`);
                    return true;
                  }
                }
              }
              
              // Matching para coleções pai (IfcBuildingStorey)
              if (searchPattern === '2' && objectName.includes('Térreo')) {
                console.log(`✅ MATCH TÉRREO: ${objectName}`);
                return true;
              }
              if (searchPattern === '1' && objectName.includes('Fundação')) {
                console.log(`✅ MATCH FUNDAÇÃO: ${objectName}`);
                return true;
              }
              if (searchPattern === '3' && objectName.includes('Superior')) {
                console.log(`✅ MATCH SUPERIOR: ${objectName}`);
                return true;
              }
              
              // Matching por palavras-chave específicas
              if (searchPattern.includes('Viga') && objectName.toLowerCase().includes('viga')) {
                console.log(`✅ MATCH VIGA: ${objectName}`);
                return true;
              }
              if (searchPattern.includes('Pilar') && objectName.toLowerCase().includes('pilar')) {
                console.log(`✅ MATCH PILAR: ${objectName}`);
                return true;
              }
              if (searchPattern.includes('Laje') && objectName.toLowerCase().includes('laje')) {
                console.log(`✅ MATCH LAJE: ${objectName}`);
                return true;
              }
              if (searchPattern.includes('Fundacao') && objectName.toLowerCase().includes('fundacao')) {
                console.log(`✅ MATCH FUNDAÇÃO: ${objectName}`);
                return true;
              }
              
              console.log(`❌ SEM MATCH: ${objectName} não corresponde a ${searchPattern}`);
              return false;
            };
            
            if (isMatch(elementId, childName)) {
              console.log('ENCONTRADO! Matching:', childName, 'para padrão:', elementId);
              targetObject = child;
            }
          });
        }
        
        if (targetObject) {
          const mesh = targetObject as any;
          if (mesh.geometry) {
            console.log('Renderizando elemento destacado:', elementId, '->', (targetObject as any).name);
            
            // Usar a função de cor da configuração
            const elementColor = getElementColor(elementId);
            
            return (
              <mesh
                key={`highlight-${elementId}-${(targetObject as any).name}`}
                geometry={mesh.geometry}
                position={mesh.position}
                rotation={mesh.rotation}
                scale={mesh.scale}
              >
                <meshStandardMaterial 
                  color={elementColor}
                  transparent 
                  opacity={0.8}
                  emissive={elementColor}
                  emissiveIntensity={0.3}
                />
              </mesh>
            );
          }
        } else {
          console.log('Elemento NÃO encontrado na cena:', elementId);
        }
        return null;
      })}
      
      {/* Iluminação Profissional */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Luz principal (sol) */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        color="#ffebcd"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Luz de preenchimento */}
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.4} 
        color="#87ceeb"
      />
      
      {/* Luz ambiente superior */}
      <hemisphereLight 
        args={["#87ceeb", "#8b7355", 0.6]}
      />
      
      {/* Luz pontual para detalhes */}
      <pointLight 
        position={[0, 8, 0]} 
        intensity={0.5} 
        color="#ffffff"
        distance={20}
      />
    </group>
  );
}

// Componente principal do visualizador 5D
const Viewer5D: React.FC = () => {
  const [itens5D, setItens5D] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carregar dados específicos do 5D
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const dados = await carregarDados5D();
        setItens5D(dados);
      } catch (error) {
        console.error('Erro ao carregar dados 5D:', error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  // Estado para elementos destacados no 3D
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);
  
  // Estado para busca na planilha
  const [searchTerm, setSearchTerm] = useState('');
  
  
  // Estado para itens selecionados (múltipla seleção)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  

  // Estados de visibilidade
  const [show3D] = useState(true);
  const [showSpreadsheet] = useState(true);
  const [showCollectionAnalyzer] = useState(false);
  
  // Estado para coleções do Blender
  const [blenderCollections, setBlenderCollections] = useState<BlenderCollection[]>([]);

  // Função para selecionar item da planilha e destacar elementos 3D
  const handleItemSelect = (item: any) => {
    const itemId = item.id;
    
    setSelectedItems(prev => {
      const isSelected = prev.includes(itemId);
      let newSelection: string[];
      
      if (isSelected) {
        // Remover da seleção (toggle off)
        newSelection = prev.filter(id => id !== itemId);
      } else {
        // Adicionar à seleção (toggle on)
        newSelection = [...prev, itemId];
      }
      
      // Atualizar elementos destacados no 3D
      updateHighlightedElements(newSelection);
      return newSelection;
    });
  };

  // Função para atualizar elementos destacados baseado na seleção múltipla
  const updateHighlightedElements = (selectedItemIds: string[]) => {
    console.log('=== ATUALIZANDO ELEMENTOS DESTACADOS ===');
    console.log('Itens selecionados:', selectedItemIds);
    console.log('Coleções disponíveis:', blenderCollections.length);
    
    const allElementsToHighlight: string[] = [];
    
    selectedItemIds.forEach(itemId => {
      // Primeiro, tentar encontrar correspondências diretas nas coleções
      const directMatches = blenderCollections.filter(collection => {
        const collectionTitle = blenderCollectionService.extractCollectionTitle(collection.name);
        return collectionTitle === itemId || 
               collectionTitle.startsWith(itemId) || 
               collection.name.includes(itemId);
      });
      
      if (directMatches.length > 0) {
        console.log(`✅ MATCHES DIRETOS para ${itemId}:`, directMatches.map(c => c.name));
        allElementsToHighlight.push(...directMatches.map(c => c.name));
      } else {
        // Fallback para padrões gerados
        const patterns = generateSearchPatterns(itemId);
        allElementsToHighlight.push(...patterns);
        console.log(`⚠️ Usando padrões gerados para ${itemId}:`, patterns.length, 'padrões');
      }
    });
    
    // Remover duplicatas
    const uniqueElements = [...new Set(allElementsToHighlight)];
    
    console.log('Total de elementos únicos para destacar:', uniqueElements.length);
    console.log('Elementos para destacar:', uniqueElements);
    setHighlightedElements(uniqueElements);
    console.log('=== FIM ATUALIZAÇÃO ===');
  };

  // Função para processar coleções encontradas pelo analisador
  const handleCollectionsFound = (collections: any[]) => {
    console.log('=== PROCESSANDO COLEÇÕES ENCONTRADAS ===');
    console.log('Total de coleções:', collections.length);
    
    // Mostrar todas as coleções com seus títulos extraídos
    collections.forEach(collection => {
      const title = blenderCollectionService.extractCollectionTitle(collection.name);
      console.log(`📋 ${collection.name} -> Título: "${title}"`);
    });
    
    setBlenderCollections(collections);
    
    // Gerar mapeamentos automáticos
    const mappings = blenderCollectionService.generateAutomaticMappings();
    
    console.log('Mapeamentos gerados:', mappings);
    console.log('=== FIM PROCESSAMENTO ===');
  };

  // Usar a função de geração de padrões da configuração
  





  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  // Função para determinar a classe de destaque baseada no código
  const getRowHighlightClass = (code: string) => {
    const elementType = getElementType(code);
    
    switch (elementType) {
      case 'viga':
        return 'bg-orange-100 border-l-4 border-orange-500 shadow-sm';
      case 'pilar':
        return 'bg-teal-100 border-l-4 border-teal-500 shadow-sm';
      case 'laje':
      case 'fundacao':
        return 'bg-blue-100 border-l-4 border-blue-500 shadow-sm';
      case 'grupo':
        return 'bg-green-100 border-l-4 border-green-500 shadow-sm';
      default:
        return 'bg-orange-100 border-l-4 border-orange-500 shadow-sm';
    }
  };


  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">

      {/* Layout Principal - Mobile First */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
        {/* Visualizador 3D */}
        {show3D && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden order-2 lg:order-1">
            <div className="bg-gray-800 text-white px-2 sm:px-3 lg:px-4 py-2">
              <h3 className="font-semibold flex items-center text-xs sm:text-sm lg:text-base">
                <Box className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
                <span className="truncate">Modelo 3D - 10 Apartamentos</span>
              </h3>
            </div>
            <div className="h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] relative">
              <Canvas 
                camera={{ position: [10, 10, 10], fov: 50 }}
                dpr={[1, 2]} // Otimização para mobile
                performance={{ min: 0.5 }} // Performance otimizada
              >
                <Suspense fallback={<Loader />}>
                  <StructuralModel 
                    highlightedElements={highlightedElements}
                    blenderCollections={blenderCollections}
                  />
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={5}
                    maxDistance={50}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI - Math.PI / 6}
                    // Otimizações para touch
                    touches={{
                      ONE: 1, // Um dedo para rotação
                      TWO: 2  // Dois dedos para zoom e pan
                    }}
                    mouseButtons={{
                      LEFT: 1, // Botão esquerdo para rotação
                      MIDDLE: 2, // Scroll para zoom
                      RIGHT: 2 // Botão direito para pan
                    }}
                  />
                  <Environment preset="city" />
                  
                  {/* Efeitos de pós-processamento otimizados para mobile */}
                  <fog attach="fog" args={['#87ceeb', 20, 100]} />
                </Suspense>
              </Canvas>
            </div>
          </div>
        )}

        {/* Planilha de Orçamento */}
        {showSpreadsheet && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden order-1 lg:order-2">
            <div className="bg-gray-800 text-white px-2 sm:px-3 lg:px-4 py-2">
              <h3 className="font-semibold flex items-center text-xs sm:text-sm lg:text-base">
                <Calculator className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
                <span className="truncate">Orçamento 5DEST (Por Etapas)</span>
              </h3>
            </div>
            
            {/* Barra de Busca Mobile-First */}
            <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-6 sm:pl-8 lg:pl-10 pr-2 sm:pr-3 lg:pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm lg:text-base"
                  />
                </div>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-800 text-xs sm:text-sm"
                >
                  Limpar
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-64 sm:max-h-80 lg:max-h-96 xl:max-h-[500px]">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-1 sm:px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-1 sm:px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-1 sm:px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Qtd
                    </th>
                    <th className="px-1 sm:px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      M.O.
                    </th>
                    <th className="px-1 sm:px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Material
                    </th>
                    <th className="px-1 sm:px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Carregando dados 5D...
                      </td>
                    </tr>
                  ) : (
                    itens5D
                    .filter(item => {
                      if (searchTerm) {
                        return item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
                      }
                      return true;
                    })
                    .map((item) => {
                      const isEtapaTotal = item.isEtapaTotal;
                      
                      return (
                        <tr 
                          key={item.id} 
                          className={`hover:bg-gray-50 cursor-pointer transition-all duration-200 ease-in-out ${
                            isEtapaTotal
                              ? 'bg-blue-100 border-l-4 border-blue-600 font-bold'
                              : selectedItems.includes(item.id)
                              ? getRowHighlightClass(item.codigo || item.id)
                              : ''
                          }`}
                          onClick={() => handleItemSelect(item)}
                        >
                      <td className="px-1 sm:px-2 lg:px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                        {item.codigo || item.id}
                      </td>
                      <td className={`px-1 sm:px-2 lg:px-3 py-2 text-xs max-w-[120px] sm:max-w-[150px] lg:max-w-[200px] truncate ${
                        isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                      }`} title={item.descricao}>
                        {item.descricao}
                      </td>
                      <td className={`px-1 sm:px-2 lg:px-3 py-2 whitespace-nowrap text-xs hidden sm:table-cell ${
                        isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                      }`}>
                        {isEtapaTotal ? '-' : `${item.quantidade.toFixed(2)} ${item.unidade}`}
                      </td>
                      <td className={`px-1 sm:px-2 lg:px-3 py-2 whitespace-nowrap text-xs hidden md:table-cell ${
                        isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                      }`}>
                        {formatarMoeda(item.maoDeObra)}
                      </td>
                      <td className={`px-1 sm:px-2 lg:px-3 py-2 whitespace-nowrap text-xs hidden md:table-cell ${
                        isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                      }`}>
                        {formatarMoeda(item.materiais)}
                      </td>
                      <td className={`px-1 sm:px-2 lg:px-3 py-2 whitespace-nowrap text-xs font-medium ${
                        isEtapaTotal ? 'text-blue-800 font-bold' : 'text-blue-600'
                      }`}>
                        {formatarMoeda(item.total)}
                      </td>
                    </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Analisador de Coleções Blender */}
      {showCollectionAnalyzer && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-800 text-white px-2 sm:px-3 lg:px-4 py-2">
            <h3 className="font-semibold flex items-center text-xs sm:text-sm lg:text-base">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
              <span className="truncate">Analisador de Coleções Blender</span>
            </h3>
          </div>
          <div className="p-2 sm:p-3 lg:p-4">
            <BlenderCollectionAnalyzer onCollectionsFound={handleCollectionsFound} />
          </div>
        </div>
      )}

      {/* Legenda de Cores */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
          🎨 Legenda de Cores:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-gray-700">Vigas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-teal-500 rounded"></div>
            <span className="text-gray-700">Pilares</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-700">Lajes/Fundações</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-700">Grupos Principais</span>
          </div>
        </div>
      </div>

      {/* Instruções de Uso Mobile-First */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-6">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-blue-800 mb-2 sm:mb-3">
          💡 Como Usar o Visualizador 5D:
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-blue-700">
          <div className="space-y-1 sm:space-y-2">
            <p><strong>1.</strong> Toque nos itens da planilha para destacar elementos 3D</p>
            <p><strong>2.</strong> Toque novamente para <strong>deselecionar</strong></p>
            <p><strong>3.</strong> Selecione múltiplos itens tocando em várias linhas</p>
            <p><strong>4.</strong> Use os botões para mostrar/ocultar 3D e planilha</p>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p><strong>5.</strong> Navegue no 3D com toque (arrastar, zoom, rotação)</p>
            <p><strong>6.</strong> Use "Limpar" para remover todas as seleções</p>
            <p><strong>7.</strong> Elementos destacados aparecem com cores específicas no 3D</p>
            <p><strong>8.</strong> Linhas selecionadas ficam destacadas com cores correspondentes</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Viewer5D;
