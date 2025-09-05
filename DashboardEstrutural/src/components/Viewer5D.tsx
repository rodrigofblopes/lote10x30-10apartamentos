import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { carregarDados5D } from '../services/orcamento5DService';
import { Calculator, Eye, EyeOff, Box, Search } from 'lucide-react';


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
}

function StructuralModel({ highlightedElements }: StructuralModelProps) {
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
            
            // Função de matching mais inteligente para coleções do Blender
            const isMatch = (searchPattern: string, objectName: string): boolean => {
              // Matching exato
              if (objectName === searchPattern) return true;
              
              // Matching por início (mais comum para coleções)
              if (objectName.startsWith(searchPattern)) return true;
              
              // Matching específico para padrões de coleção do Blender
              // Ex: "2.1_" deve match com "2.1_.001", "2.1_.002", etc.
              if (searchPattern.endsWith('_') && objectName.startsWith(searchPattern)) return true;
              
              // Matching para padrões como "2.1_.001" (com underscore e ponto)
              if (searchPattern.includes('_.') && objectName.startsWith(searchPattern)) return true;
              
              // Matching por contém (para casos como "2.1_.001" contém "2.1_")
              if (objectName.includes(searchPattern)) return true;
              
              // Matching com variações de separadores
              const normalizedPattern = searchPattern.replace(/[._-]/g, '');
              const normalizedName = objectName.replace(/[._-]/g, '');
              if (normalizedName.startsWith(normalizedPattern)) return true;
              
              // Matching hierárquico para coleções
              // Se procurar por "2.1", deve encontrar "2.1_.001", "2.1_.002", etc.
              if (searchPattern.includes('.') && !searchPattern.endsWith('_')) {
                const basePattern = searchPattern + '_.';
                if (objectName.startsWith(basePattern)) return true;
                
                const basePattern2 = searchPattern + '_';
                if (objectName.startsWith(basePattern2)) return true;
              }
              
              // Matching para coleções pai (IfcBuildingStorey)
              if (searchPattern === '2' && objectName.includes('Térreo')) return true;
              if (searchPattern === '1' && objectName.includes('Fundação')) return true;
              if (searchPattern === '3' && objectName.includes('Superior')) return true;
              
              // Matching por palavras-chave específicas
              if (searchPattern.includes('Viga') && objectName.toLowerCase().includes('viga')) return true;
              if (searchPattern.includes('Pilar') && objectName.toLowerCase().includes('pilar')) return true;
              if (searchPattern.includes('Laje') && objectName.toLowerCase().includes('laje')) return true;
              if (searchPattern.includes('Fundacao') && objectName.toLowerCase().includes('fundacao')) return true;
              
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
            return (
              <mesh
                key={`highlight-${elementId}-${(targetObject as any).name}`}
                geometry={mesh.geometry}
                position={mesh.position}
                rotation={mesh.rotation}
                scale={mesh.scale}
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
  const [show3D, setShow3D] = useState(true);
  const [showSpreadsheet, setShowSpreadsheet] = useState(true);

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
    
    const allElementsToHighlight: string[] = [];
    
    selectedItemIds.forEach(itemId => {
      const patterns = generateSearchPatterns(itemId);
      allElementsToHighlight.push(...patterns);
      console.log(`Padrões para ${itemId}:`, patterns.length, 'padrões');
    });
    
    // Remover duplicatas
    const uniqueElements = [...new Set(allElementsToHighlight)];
    
    console.log('Total de elementos únicos para destacar:', uniqueElements.length);
    setHighlightedElements(uniqueElements);
    console.log('=== FIM ATUALIZAÇÃO ===');
  };

  // Função para gerar padrões de busca (extraída da função anterior)
  const generateSearchPatterns = (code: string): string[] => {
    const patterns: string[] = [];
    
    // Padrão exato
    patterns.push(code);
    
    // Padrões com underscore (mais comum no Blender)
    patterns.push(`${code}_`);
    patterns.push(`${code.replace('.', '_')}_`);
    
    // Padrões específicos para coleções do Blender (baseado na estrutura mostrada)
    if (code === '1') {
      // Fundação - incluir todas as sub-coleções
      patterns.push('1_', '1.1_', '1.2_', '1.3_');
      // Padrões com numeração sequencial para sub-itens (formato: 1.1_.001, 1.1_.002, etc.)
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`1.1_.${num}`);
        patterns.push(`1.2_.${num}`);
        patterns.push(`1.3_.${num}`);
      }
    } else if (code === '1.1') {
      // Vigas da fundação
      patterns.push('1.1_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`1.1_.${num}`);
      }
    } else if (code === '1.2') {
      // Pilares da fundação
      patterns.push('1.2_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`1.2_.${num}`);
      }
    } else if (code === '1.3') {
      // Fundações
      patterns.push('1.3_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`1.3_.${num}`);
      }
    } else if (code === '2') {
      // Térreo - incluir todas as sub-coleções
      patterns.push('2_', '2.1_', '2.2_', '2.3_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`2.1_.${num}`);
        patterns.push(`2.2_.${num}`);
        patterns.push(`2.3_.${num}`);
      }
    } else if (code === '2.1') {
      // Vigas do térreo (como mostrado na imagem: 2.1_.001, 2.1_.002, etc.)
      patterns.push('2.1_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`2.1_.${num}`);
      }
    } else if (code === '2.2') {
      // Pilares do térreo
      patterns.push('2.2_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`2.2_.${num}`);
      }
    } else if (code === '2.3') {
      // Lajes do térreo
      patterns.push('2.3_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`2.3_.${num}`);
      }
    } else if (code === '3') {
      // Pavimento Superior
      patterns.push('3_', '3.1_', '3.3_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`3.1_.${num}`);
        patterns.push(`3.3_.${num}`);
      }
    } else if (code === '3.1') {
      // Vigas do pavimento superior
      patterns.push('3.1_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`3.1_.${num}`);
      }
    } else if (code === '3.3') {
      // Pilares do pavimento superior
      patterns.push('3.3_');
      for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(3, '0');
        patterns.push(`3.3_.${num}`);
      }
    }
    
    // Padrões genéricos com numeração sequencial
    for (let i = 1; i <= 50; i++) {
      const num = i.toString().padStart(3, '0');
      patterns.push(`${code}_${num}`);
      patterns.push(`${code.replace('.', '_')}_${num}`);
      patterns.push(`${code}.${num}`);
      patterns.push(`${code}_${i}`);
      patterns.push(`${code.replace('.', '_')}_${i}`);
    }
    
    // Padrões com espaços e hífens
    patterns.push(`${code} `);
    patterns.push(`${code}-`);
    patterns.push(`${code.replace('.', '-')}`);
    
    return patterns;
  };
  





  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };


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
              onClick={() => {
                setHighlightedElements([]);
                setSelectedItems([]);
              }}
              className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md transition-colors bg-red-600 text-white hover:bg-red-700 text-xs lg:text-sm"
            >
              <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Limpar</span>
              <span className="sm:hidden">Limpar</span>
            </button>
            
            
          </div>
        </div>




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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>
                <button
                  onClick={() => setSearchTerm('')}
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
                              ? 'bg-orange-100 border-l-4 border-orange-500 shadow-sm'
                              : ''
                          }`}
                          onClick={() => handleItemSelect(item)}
                        >
                      <td className="px-2 lg:px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                        {item.codigo || item.id}
                      </td>
                      <td className={`px-2 lg:px-3 py-2 text-xs max-w-[150px] lg:max-w-[200px] truncate ${
                        isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                      }`} title={item.descricao}>
                        {item.descricao}
                      </td>
                      <td className={`px-2 lg:px-3 py-2 whitespace-nowrap text-xs ${
                        isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                      }`}>
                        {isEtapaTotal ? '-' : `${item.quantidade.toFixed(2)} ${item.unidade}`}
                      </td>
                      <td className={`px-2 lg:px-3 py-2 whitespace-nowrap text-xs ${
                        isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                      }`}>
                        {formatarMoeda(item.maoDeObra)}
                      </td>
                      <td className={`px-2 lg:px-3 py-2 whitespace-nowrap text-xs ${
                        isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                      }`}>
                        {formatarMoeda(item.materiais)}
                      </td>
                      <td className={`px-2 lg:px-3 py-2 whitespace-nowrap text-xs font-medium ${
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


      {/* Instruções de Uso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-blue-800 mb-3">
          💡 Como Usar o Visualizador 5D:
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="mb-2"><strong>1.</strong> Clique nos itens da planilha para destacar elementos 3D</p>
            <p className="mb-2"><strong>2.</strong> Clique novamente para <strong>deselecionar</strong></p>
            <p className="mb-2"><strong>3.</strong> Selecione múltiplos itens clicando em várias linhas</p>
            <p className="mb-2"><strong>4.</strong> Use os botões para mostrar/ocultar 3D e planilha</p>
          </div>
          <div>
            <p className="mb-2"><strong>5.</strong> Navegue no 3D com mouse (arrastar, zoom, rotação)</p>
            <p className="mb-2"><strong>6.</strong> Use "Limpar" para remover todas as seleções</p>
            <p className="mb-2"><strong>7.</strong> Elementos destacados aparecem em laranja no 3D</p>
            <p className="mb-2"><strong>8.</strong> Linhas selecionadas ficam destacadas em laranja</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Viewer5D;
