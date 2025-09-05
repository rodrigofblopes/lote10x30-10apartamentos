import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { Calculator, Eye, EyeOff, Link, Unlink, Box, Search, Filter, Trash2, Plus, Check } from 'lucide-react';

// Interfaces para o sistema de linking
interface ElementLink {
  id: string;
  elementId: string;
  elementName: string;
  itemId: string;
  itemDescription: string;
  itemCode: string;
  linkedAt: Date;
  notes?: string;
}

interface LinkingState {
  selectedElement: { id: string; data: any } | null;
  selectedItem: any | null;
  links: ElementLink[];
  linkMode: boolean;
  searchTerm: string;
  filterCategory: string;
  showLinkedOnly: boolean;
}

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
  highlightedElements: string[];
}

function StructuralModel({ onElementSelect, selectedElementId: _selectedElementId, linkedElements: _linkedElements, highlightedElements }: StructuralModelProps) {
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

  // Adicionar interatividade aos elementos
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const elementName = child.name || `Elemento_${child.id}`;
          
          // Aplicar material baseado no nome
          applyMaterialByElementName(child, elementName);
          
          // Adicionar evento de clique
          (child as any).onClick = (event: any) => {
            event.stopPropagation();
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
              child.material.emissive = new THREE.Color(0x333333);
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
      {scene && (
        <primitive 
          object={scene} 
          onClick={(event: any) => {
            event.stopPropagation();
            const elementId = event.object.name || 'unknown';
            onElementSelect(elementId, { 
              name: elementId, 
              position: event.object.position,
              type: 'structural_element'
            });
          }}
          onPointerOver={(event: any) => {
            event.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        />
      )}
      
      {/* Renderizar elementos destacados com cores diferentes */}
      {highlightedElements.map((elementId) => {
        // Encontrar o objeto correspondente na cena
        let targetObject: THREE.Object3D | null = null;
        if (scene) {
          scene.traverse((child) => {
            if (child.name === elementId) {
              targetObject = child;
            }
          });
        }
        
        if (targetObject) {
          const mesh = targetObject as any;
          if (mesh.geometry) {
            return (
              <mesh
                key={`highlight-${elementId}`}
                geometry={mesh.geometry}
                position={mesh.position}
                rotation={mesh.rotation}
                scale={mesh.scale}
                onClick={(event: any) => {
                  event.stopPropagation();
                  onElementSelect(elementId, { 
                    name: elementId, 
                    position: mesh.position,
                    type: 'highlighted_element'
                  });
                }}
              >
                <meshStandardMaterial 
                  color="#ff6b35" 
                  transparent 
                  opacity={0.8}
                  emissive="#ff6b35"
                  emissiveIntensity={0.3}
                />
              </mesh>
            );
          }
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
  const { itens } = useOrcamentoStore();
  
  // Estado do sistema de linking
  const [linkingState, setLinkingState] = useState<LinkingState>({
    selectedElement: null,
    selectedItem: null,
    links: [],
    linkMode: false,
    searchTerm: '',
    filterCategory: '',
    showLinkedOnly: false
  });

  // Estado para links automáticos
  const [autoLinks, setAutoLinks] = useState<ElementLink[]>([]);
  
  // Estado para elementos destacados no 3D
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);

  // Estado para links automáticos (removido por enquanto)
  // const [autoLinks, setAutoLinks] = useState<AutoLink[]>([]);
  // const [linkingStats, setLinkingStats] = useState<any>(null);
  // const [showAutoLinking, setShowAutoLinking] = useState(false);
  

  // Estados de visibilidade
  const [show3D, setShow3D] = useState(true);
  const [showSpreadsheet, setShowSpreadsheet] = useState(true);

  // Funções do sistema de linking
  const handleElementSelect = (elementId: string, elementData: any) => {
    setLinkingState(prev => ({
      ...prev,
      selectedElement: { id: elementId, data: elementData }
    }));
  };

  const handleItemSelect = (item: any) => {
    setLinkingState(prev => ({
      ...prev,
      selectedItem: item
    }));
    
    // Destacar elementos 3D correspondentes ao item selecionado
    highlightElementsForItem(item);
  };
  
  // Função para destacar elementos 3D baseado no item da planilha
  const highlightElementsForItem = (item: any) => {
    const elementsToHighlight: string[] = [];
    
    // Procurar links automáticos que correspondem ao item
    autoLinks.forEach(link => {
      if (link.itemId === item.id) {
        elementsToHighlight.push(link.elementId);
      }
    });
    
    // Procurar links manuais que correspondem ao item
    linkingState.links.forEach(link => {
      if (link.itemId === item.id) {
        elementsToHighlight.push(link.elementId);
      }
    });
    
    // Se não houver links, tentar fazer matching direto baseado no código
    if (elementsToHighlight.length === 0) {
      const itemCode = item.id.trim();
      
      // Simular elementos 3D baseados no código do item
      const possibleElements = [
        itemCode + '_',
        itemCode + '_.001',
        itemCode + '_.002',
        itemCode + '_.003',
        itemCode + '_.004',
        itemCode + '_.005'
      ];
      
      // Adicionar elementos que podem existir no GLB
      possibleElements.forEach(elementId => {
        elementsToHighlight.push(elementId);
      });
    }
    
    setHighlightedElements(elementsToHighlight);
    console.log(`Destacando elementos para item ${item.id}:`, elementsToHighlight);
  };

  const createLink = () => {
    if (linkingState.selectedElement && linkingState.selectedItem) {
      const newLink: ElementLink = {
        id: `link_${Date.now()}`,
        elementId: linkingState.selectedElement.id,
        elementName: linkingState.selectedElement.data.name || linkingState.selectedElement.id,
        itemId: linkingState.selectedItem.id,
        itemDescription: linkingState.selectedItem.descricao,
        itemCode: linkingState.selectedItem.codigo,
        linkedAt: new Date(),
        notes: ''
      };

      setLinkingState(prev => ({
        ...prev,
        links: [...prev.links, newLink],
        selectedElement: null,
        selectedItem: null
      }));

      // Salvar no localStorage
      localStorage.setItem('viewer5d_links', JSON.stringify([...linkingState.links, newLink]));
    }
  };

  const removeLink = (linkId: string) => {
    const updatedLinks = linkingState.links.filter(link => link.id !== linkId);
    setLinkingState(prev => ({
      ...prev,
      links: updatedLinks
    }));
    localStorage.setItem('viewer5d_links', JSON.stringify(updatedLinks));
  };

  const toggleLinkMode = () => {
    setLinkingState(prev => ({
      ...prev,
      linkMode: !prev.linkMode,
      selectedElement: null,
      selectedItem: null
    }));
  };

  // Função para criar links automáticos baseados no matching direto dos códigos
  const createAutoLinks = () => {
    const newAutoLinks: ElementLink[] = [];
    
    // Simular coleções do GLB baseadas na estrutura real (como visto na imagem)
    const glbCollections = [
      '1.1_', '1.1_.001', '1.1_.002', '1.1_.003', '1.1_.004', '1.1_.005', '1.1_.006', '1.1_.007', '1.1_.008', '1.1_.009', '1.1_.010', '1.1_.011', '1.1_.012', '1.1_.013', '1.1_.014', '1.1_.015', '1.1_.016', '1.1_.017', '1.1_.018', '1.1_.019', '1.1_.020', '1.1_.021', '1.1_.022',
      '1.2_', '1.2_.001', '1.2_.002', '1.2_.003', '1.2_.004', '1.2_.005', '1.2_.006', '1.2_.007', '1.2_.008', '1.2_.009', '1.2_.010', '1.2_.011', '1.2_.012', '1.2_.013', '1.2_.014', '1.2_.015', '1.2_.016', '1.2_.017', '1.2_.018', '1.2_.019', '1.2_.020', '1.2_.021', '1.2_.022',
      '1.3_', '1.3_.001', '1.3_.002', '1.3_.003', '1.3_.004', '1.3_.005', '1.3_.006', '1.3_.007', '1.3_.008', '1.3_.009', '1.3_.010', '1.3_.011', '1.3_.012', '1.3_.013', '1.3_.014', '1.3_.015', '1.3_.016', '1.3_.017', '1.3_.018', '1.3_.019', '1.3_.020', '1.3_.021', '1.3_.022',
      '2.1_', '2.1_.001', '2.1_.002', '2.1_.003', '2.1_.004', '2.1_.005', '2.1_.006', '2.1_.007', '2.1_.008', '2.1_.009', '2.1_.010', '2.1_.011', '2.1_.012', '2.1_.013', '2.1_.014', '2.1_.015', '2.1_.016', '2.1_.017', '2.1_.018', '2.1_.019', '2.1_.020', '2.1_.021', '2.1_.022',
      '2.2_', '2.2_.001', '2.2_.002', '2.2_.003', '2.2_.004', '2.2_.005', '2.2_.006', '2.2_.007', '2.2_.008', '2.2_.009', '2.2_.010', '2.2_.011', '2.2_.012', '2.2_.013', '2.2_.014', '2.2_.015', '2.2_.016', '2.2_.017', '2.2_.018', '2.2_.019', '2.2_.020', '2.2_.021', '2.2_.022',
      '2.3_', '2.3_.001', '2.3_.002', '2.3_.003', '2.3_.004', '2.3_.005', '2.3_.006', '2.3_.007', '2.3_.008', '2.3_.009', '2.3_.010', '2.3_.011', '2.3_.012', '2.3_.013', '2.3_.014', '2.3_.015', '2.3_.016', '2.3_.017', '2.3_.018', '2.3_.019', '2.3_.020', '2.3_.021', '2.3_.022',
      '3.1_', '3.1_.001', '3.1_.002', '3.1_.003', '3.1_.004', '3.1_.005', '3.1_.006', '3.1_.007', '3.1_.008', '3.1_.009', '3.1_.010', '3.1_.011', '3.1_.012', '3.1_.013', '3.1_.014', '3.1_.015', '3.1_.016', '3.1_.017', '3.1_.018', '3.1_.019', '3.1_.020', '3.1_.021', '3.1_.022',
      '3.2_', '3.2_.001', '3.2_.002', '3.2_.003', '3.2_.004', '3.2_.005', '3.2_.006', '3.2_.007', '3.2_.008', '3.2_.009', '3.2_.010', '3.2_.011', '3.2_.012', '3.2_.013', '3.2_.014', '3.2_.015', '3.2_.016', '3.2_.017', '3.2_.018', '3.2_.019', '3.2_.020', '3.2_.021', '3.2_.022',
      '3.3_', '3.3_.001', '3.3_.002', '3.3_.003', '3.3_.004', '3.3_.005', '3.3_.006', '3.3_.007', '3.3_.008', '3.3_.009', '3.3_.010', '3.3_.011', '3.3_.012', '3.3_.013', '3.3_.014', '3.3_.015', '3.3_.016', '3.3_.017', '3.3_.018', '3.3_.019', '3.3_.020', '3.3_.021', '3.3_.022'
    ];

    // Fazer matching direto entre coleções GLB e itens da planilha
    glbCollections.forEach(collectionId => {
      // Extrair o código base da coleção (ex: 1.1_ -> 1.1)
      const baseCode = collectionId.replace(/[._]/g, '.').replace(/\.$/, '');
      
      // Procurar item correspondente na planilha
      const matchingItem = itens.find(item => {
        const itemCode = item.id.trim();
        
        // Matching exato para códigos principais (1.1, 1.2, etc.)
        if (baseCode === itemCode) {
          return true;
        }
        
        // Matching para subitens (1.1.1, 1.1.2, etc.)
        if (itemCode.startsWith(baseCode + '.')) {
          return true;
        }
        
        // Matching para elementos com sufixo (1.1_.001 -> 1.1.1)
        if (collectionId.includes('_')) {
          const [code, suffix] = collectionId.split('_');
          const cleanCode = code.replace(/\.$/, '');
          
          if (suffix && suffix.startsWith('.')) {
            const subCode = cleanCode + suffix;
            return itemCode === subCode;
          }
        }
        
        return false;
      });

      if (matchingItem) {
        const newLink: ElementLink = {
          id: `auto_link_${collectionId}_${matchingItem.id}`,
          elementId: collectionId,
          elementName: `${matchingItem.descricao} (${collectionId})`,
          itemId: matchingItem.id,
          itemDescription: matchingItem.descricao,
          itemCode: matchingItem.codigo,
          linkedAt: new Date(),
          notes: `Link automático: ${collectionId} → ${matchingItem.id}`
        };
        newAutoLinks.push(newLink);
      }
    });

    setAutoLinks(newAutoLinks);
    
    // Salvar no localStorage
    localStorage.setItem('viewer5d_auto_links', JSON.stringify(newAutoLinks));
    
    console.log('Links automáticos criados:', newAutoLinks.length);
    console.log('Detalhes dos links:', newAutoLinks);
  };

  // Função para criar links automáticos (comentada por enquanto)
  // const createAutoLinks = () => {
  //   // Simular elementos 3D (em um caso real, isso viria do modelo GLB)
  //   const elements3D = [
  //     { id: 'pilar_001', name: 'Pilar Central' },
  //     { id: 'viga_001', name: 'Viga Principal' },
  //     { id: 'laje_001', name: 'Laje Térreo' },
  //     { id: 'parede_001', name: 'Parede Externa' },
  //     { id: 'piso_001', name: 'Piso Porcelanato' },
  //     { id: 'janela_001', name: 'Janela Alumínio' },
  //     { id: 'porta_001', name: 'Porta Madeira' },
  //     { id: 'telhado_001', name: 'Telhado Fibrocimento' }
  //   ];

  //   const result = createAutomaticLinks(elements3D, itens);
  //   setAutoLinks(result.links);
  //   setLinkingStats(result.statistics);
  //   setShowAutoLinking(true);
    
  //   console.log('Links automáticos criados:', result);
  // };

  // Carregar links salvos do localStorage
  useEffect(() => {
    const savedLinks = localStorage.getItem('viewer5d_links');
    if (savedLinks) {
      try {
        const links = JSON.parse(savedLinks);
        setLinkingState(prev => ({
          ...prev,
          links: links.map((link: any) => ({
            ...link,
            linkedAt: new Date(link.linkedAt)
          }))
        }));
      } catch (error) {
        console.error('Erro ao carregar links salvos:', error);
      }
    }

    // Carregar links automáticos salvos
    const savedAutoLinks = localStorage.getItem('viewer5d_auto_links');
    if (savedAutoLinks) {
      try {
        const autoLinks = JSON.parse(savedAutoLinks);
        setAutoLinks(autoLinks.map((link: any) => ({
          ...link,
          linkedAt: new Date(link.linkedAt)
        })));
      } catch (error) {
        console.error('Erro ao carregar links automáticos salvos:', error);
      }
    }
  }, []);

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
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <button
              onClick={() => setShow3D(!show3D)}
              className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md transition-colors text-xs lg:text-sm ${
                show3D 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {show3D ? <Eye className="h-3 w-3 lg:h-4 lg:w-4" /> : <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" />}
              <span className="hidden sm:inline">3D</span>
              <span className="sm:hidden">3D</span>
            </button>
            
            <button
              onClick={() => setShowSpreadsheet(!showSpreadsheet)}
              className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md transition-colors text-xs lg:text-sm ${
                showSpreadsheet 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showSpreadsheet ? <Eye className="h-3 w-3 lg:h-4 lg:w-4" /> : <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" />}
              <span className="hidden sm:inline">Planilha</span>
              <span className="sm:hidden">Planilha</span>
            </button>
            
            <button
              onClick={toggleLinkMode}
              className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md transition-colors text-xs lg:text-sm ${
                linkingState.linkMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {linkingState.linkMode ? <Link className="h-3 w-3 lg:h-4 lg:w-4" /> : <Unlink className="h-3 w-3 lg:h-4 lg:w-4" />}
              <span className="hidden sm:inline">Modo Link</span>
              <span className="sm:hidden">Link</span>
            </button>
            
            <button
              onClick={() => setLinkingState(prev => ({ ...prev, showLinkedOnly: !prev.showLinkedOnly }))}
              className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md transition-colors text-xs lg:text-sm ${
                linkingState.showLinkedOnly 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Filter className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Linkados</span>
              <span className="sm:hidden">Linkados</span>
            </button>
            
            <button
              onClick={createAutoLinks}
              className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md transition-colors bg-green-600 text-white hover:bg-green-700 text-xs lg:text-sm"
            >
              <Link className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Auto Link</span>
              <span className="sm:hidden">Auto</span>
            </button>
            
            <button
              onClick={() => setHighlightedElements([])}
              className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md transition-colors bg-red-600 text-white hover:bg-red-700 text-xs lg:text-sm"
            >
              <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Limpar</span>
              <span className="sm:hidden">Limpar</span>
            </button>
            
          </div>
        </div>

        {/* Status do Sistema de Linking */}
        {(linkingState.selectedElement || linkingState.selectedItem) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-3">Sistema de Linking:</h3>
            
            {linkingState.selectedElement && (
              <div className="mb-3 p-3 bg-blue-100 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Elemento 3D Selecionado:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Nome:</span> {linkingState.selectedElement.data.name || linkingState.selectedElement.id}</div>
                  <div><span className="font-medium">ID:</span> {linkingState.selectedElement.id}</div>
                </div>
              </div>
            )}
            
            {linkingState.selectedItem && (
              <div className="mb-3 p-3 bg-green-100 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Item da Planilha Selecionado:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Código:</span> {linkingState.selectedItem.codigo}</div>
                  <div><span className="font-medium">Descrição:</span> {linkingState.selectedItem.descricao}</div>
                </div>
              </div>
            )}
            
            {linkingState.selectedElement && linkingState.selectedItem && (
              <div className="flex gap-2">
                <button
                  onClick={createLink}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Criar Link</span>
                </button>
                <button
                  onClick={() => setLinkingState(prev => ({ ...prev, selectedElement: null, selectedItem: null }))}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>
        )}


        {/* Links Automáticos Criados */}
        {autoLinks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Link className="h-5 w-5 mr-2" />
              Links Automáticos Criados ({autoLinks.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {autoLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{link.elementName}</div>
                    <div className="text-xs text-gray-600">{link.itemCode} - {link.itemDescription}</div>
                    <div className="text-xs text-blue-600">{link.notes}</div>
                  </div>
                  <button
                    onClick={() => setAutoLinks(prev => prev.filter(l => l.id !== link.id))}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Links Criados Online */}
        {linkingState.links.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Links Manuais Criados ({linkingState.links.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {linkingState.links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{link.elementName}</div>
                    <div className="text-xs text-gray-600">{link.itemCode} - {link.itemDescription}</div>
                  </div>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Visualizador 3D */}
        {show3D && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 text-white px-3 lg:px-4 py-2">
              <h3 className="font-semibold flex items-center text-sm lg:text-base">
                <Box className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                Modelo 3D - 10 Apartamentos
              </h3>
            </div>
            <div className="h-64 sm:h-80 lg:h-96 xl:h-[500px] relative">
              <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
                <Suspense fallback={<Loader />}>
                  <StructuralModel 
                    onElementSelect={handleElementSelect}
                    selectedElementId={linkingState.selectedElement?.id || null}
                    linkedElements={linkingState.links.map(link => link.elementId)}
                    highlightedElements={highlightedElements}
                  />
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={5}
                    maxDistance={50}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI - Math.PI / 6}
                  />
                  <Environment preset="city" />
                  
                  {/* Efeitos de pós-processamento */}
                  <fog attach="fog" args={['#87ceeb', 20, 100]} />
                </Suspense>
              </Canvas>
              
              {/* Overlay de Instruções */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
                <p className="font-semibold mb-2">Como Linkar:</p>
                <p>1. Ative "Modo Link"</p>
                <p>2. Clique em um elemento 3D</p>
                <p>3. Clique em um item da planilha</p>
                <p>4. Clique "Criar Link"</p>
                <p className="mt-2 text-xs text-gray-300">• Use mouse para navegar no 3D</p>
              </div>
            </div>
          </div>
        )}

        {/* Planilha de Orçamento */}
        {showSpreadsheet && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 text-white px-3 lg:px-4 py-2">
              <h3 className="font-semibold flex items-center text-sm lg:text-base">
                <Calculator className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                Orçamento 5DEST (Por Etapas)
              </h3>
            </div>
            
            {/* Barra de Busca */}
            <div className="p-3 lg:p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por código ou descrição..."
                    value={linkingState.searchTerm}
                    onChange={(e) => setLinkingState(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>
                <button
                  onClick={() => setLinkingState(prev => ({ ...prev, searchTerm: '' }))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  Limpar
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-96 lg:max-h-[500px]">
              <table className="min-w-full divide-y divide-gray-200 text-xs lg:text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      M.O.
                    </th>
                    <th className="px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-2 lg:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itens
                    .filter(item => {
                      if (linkingState.showLinkedOnly) {
                        return linkingState.links.some(link => link.itemId === item.id) ||
                               autoLinks.some(link => link.itemId === item.id);
                      }
                      if (linkingState.searchTerm) {
                        return item.descricao.toLowerCase().includes(linkingState.searchTerm.toLowerCase()) ||
                               item.codigo.toLowerCase().includes(linkingState.searchTerm.toLowerCase());
                      }
                      return true;
                    })
                    .map((item) => {
                      const isSelected = linkingState.selectedItem?.id === item.id;
                      const isLinked = linkingState.links.some(link => link.itemId === item.id);
                      const isAutoLinked = autoLinks.some(link => link.itemId === item.id);
                      
                      return (
                        <tr 
                          key={item.id} 
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-green-50 border-l-4 border-green-500'
                              : isAutoLinked
                              ? 'bg-blue-50 border-l-4 border-blue-500'
                              : isLinked
                              ? 'bg-purple-50 border-l-2 border-purple-300'
                              : ''
                          }`}
                          onClick={() => handleItemSelect(item)}
                        >
                      <td className="px-2 lg:px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                        {item.codigo}
                      </td>
                      <td className="px-2 lg:px-3 py-2 text-xs text-gray-900 max-w-[150px] lg:max-w-[200px] truncate" title={item.descricao}>
                        {item.descricao}
                      </td>
                      <td className="px-2 lg:px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {item.quantidade.toFixed(2)} {item.unidade}
                      </td>
                      <td className="px-2 lg:px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {formatarMoeda(item.maoDeObra)}
                      </td>
                      <td className="px-2 lg:px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {formatarMoeda(item.materiais)}
                      </td>
                      <td className="px-2 lg:px-3 py-2 whitespace-nowrap text-xs font-medium text-blue-600">
                        {formatarMoeda(item.total)}
                      </td>
                      <td className="px-2 lg:px-3 py-2 whitespace-nowrap text-xs">
                        <span className={`px-1 lg:px-2 py-1 rounded-full text-xs ${
                          isAutoLinked
                            ? 'bg-blue-100 text-blue-800'
                            : isLinked
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isAutoLinked ? 'Auto' : isLinked ? 'Manual' : 'Não'}
                        </span>
                      </td>
                    </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Resumo dos Elementos Linkados */}
      {linkingState.links.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Link className="h-5 w-5 mr-2 text-purple-600" />
            Elementos Linkados ({linkingState.links.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkingState.links.map((link) => (
              <div key={link.id} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-purple-800">{link.elementName}</span>
                    <div className="text-xs text-gray-600">{link.itemCode}</div>
                  </div>
                  <button
                    onClick={() => removeLink(link.id)}
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
