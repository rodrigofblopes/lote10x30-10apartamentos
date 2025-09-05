import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Eye, EyeOff } from 'lucide-react';

// Componente de loading
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando modelo arquitetônico...</p>
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

// Componente para carregar o modelo GLB arquitetônico
interface ArquiteturaModelProps {
  onElementSelect: (elementId: string, elementData: any) => void;
  selectedElementId: string | null;
}

function ArquiteturaModel({ onElementSelect, selectedElementId: _selectedElementId }: ArquiteturaModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Carregar o modelo GLB
  const { scene } = useGLTF('/10apartamentosarq.glb');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  // Função para aplicar materiais arquitetônicos baseados no nome do elemento
  const applyArchitecturalMaterial = (mesh: THREE.Mesh, elementName: string) => {
    const name = elementName.toLowerCase();
    
    // Materiais específicos para arquitetura
    if (name.includes('parede') || name.includes('wall') || name.includes('alvenaria')) {
      // Paredes - cor de tijolo/argamassa
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#F5DEB3',
        roughness: 0.9,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('piso') || name.includes('floor') || name.includes('laje')) {
      // Pisos - concreto/cimento
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#D3D3D3',
        roughness: 0.8,
        metalness: 0.1,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('janela') || name.includes('window') || name.includes('vidro')) {
      // Janelas - vidro transparente
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#87CEEB',
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.6,
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
    } else if (name.includes('telhado') || name.includes('roof') || name.includes('cobertura')) {
      // Telhado - telha/cobertura
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#A0522D',
        roughness: 0.8,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('forro') || name.includes('teto') || name.includes('ceiling')) {
      // Forro - gesso/pintura
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.7,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('revestimento') || name.includes('ceramica') || name.includes('azulejo')) {
      // Revestimentos - cerâmica
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#F0F8FF',
        roughness: 0.3,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else {
      // Material padrão - concreto
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#C0C0C0',
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
          
          // Aplicar material arquitetônico baseado no nome
          applyArchitecturalMaterial(child, elementName);
          
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
            console.log('Elemento arquitetônico clicado:', elementName, elementData);
          };
          
          // Adicionar hover effects
          (child as any).onPointerOver = () => {
            document.body.style.cursor = 'pointer';
            if (child.material) {
              child.material.emissive = new THREE.Color(0x444444);
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
      
      console.log('Modelo arquitetônico GLB carregado com sucesso!');
      console.log('Elementos encontrados:', scene.children.length);
    }
  }, [scene, onElementSelect]);

  return (
    <group ref={meshRef}>
      {scene && <primitive object={scene} />}
      
      {/* Iluminação Arquitetônica Profissional */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Luz principal (sol) */}
      <directionalLight 
        position={[15, 15, 10]} 
        intensity={1.5} 
        color="#ffebcd"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Luz de preenchimento */}
      <directionalLight 
        position={[-10, 10, -10]} 
        intensity={0.6} 
        color="#87ceeb"
      />
      
      {/* Luz ambiente superior */}
      <hemisphereLight 
        args={["#87ceeb", "#f5deb3", 0.8]}
      />
      
      {/* Luz pontual para detalhes internos */}
      <pointLight 
        position={[0, 5, 0]} 
        intensity={0.8} 
        color="#ffffff"
        distance={30}
      />
      
      {/* Luz adicional para fachada */}
      <spotLight
        position={[20, 10, 0]}
        angle={Math.PI / 4}
        penumbra={0.5}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />
    </group>
  );
}

// Componente principal do visualizador 3D arquitetônico
const Arquitetura3D: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<{id: string, data: any} | null>(null);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showShadows, setShowShadows] = useState(true);

  const handleElementSelect = (elementId: string, elementData: any) => {
    setSelectedElement({ id: elementId, data: elementData });
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header e Controles */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl lg:text-2xl font-bold text-blue-700 flex items-center">
              🏠 Visualizador 3D Arquitetônico - Vila Andriw
            </h2>
            <p className="text-sm lg:text-base text-gray-600 mt-2">
              Modelo 3D completo dos 10 apartamentos - Clique nos elementos para interagir
            </p>
          </div>
          
          {/* Controles */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowWireframe(!showWireframe)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                showWireframe 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Box className="h-4 w-4" />
              <span>Wireframe</span>
            </button>
            
            <button
              onClick={() => setShowShadows(!showShadows)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                showShadows 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showShadows ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>Sombras</span>
            </button>
          </div>
        </div>

        {/* Status do Elemento Selecionado */}
        {selectedElement && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Elemento Selecionado:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Nome:</span> {selectedElement.id}
              </div>
              <div>
                <span className="font-medium">ID:</span> {selectedElement.data.id}
              </div>
              <div>
                <span className="font-medium">Posição:</span> 
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  X: {selectedElement.data.position.x.toFixed(2)}, 
                  Y: {selectedElement.data.position.y.toFixed(2)}, 
                  Z: {selectedElement.data.position.z.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visualizador 3D */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2">
          <h3 className="font-semibold flex items-center">
            <Box className="h-5 w-5 mr-2" />
            Modelo 3D - 10 Apartamentos Vila Andriw
          </h3>
        </div>
        <div className="h-96 lg:h-[600px] relative">
          <Canvas 
            camera={{ position: [20, 15, 20], fov: 50 }}
            shadows={showShadows}
          >
            <Suspense fallback={<Loader />}>
              <ArquiteturaModel 
                onElementSelect={handleElementSelect}
                selectedElementId={selectedElement?.id || null}
              />
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={10}
                maxDistance={100}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI - Math.PI / 6}
              />
              <Environment preset="city" />
              
              {/* Efeitos de pós-processamento */}
              <fog attach="fog" args={['#87ceeb', 30, 150]} />
            </Suspense>
          </Canvas>
          
          {/* Overlay de Instruções */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
            <p className="font-semibold mb-2">Controles:</p>
            <p>• Clique nos elementos para selecionar</p>
            <p>• Arraste para rotacionar</p>
            <p>• Scroll para zoom</p>
            <p>• Botão direito + arrastar para pan</p>
          </div>
          
          {/* Overlay de Informações */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
            <p className="font-semibold mb-2">Projeto:</p>
            <p>• 10 Apartamentos</p>
            <p>• 2 Pavimentos</p>
            <p>• Área Total: 298 m²</p>
            <p>• Lote: 10x30m</p>
          </div>
        </div>
      </div>

      {/* Informações do Projeto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Características Arquitetônicas */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            🏗️ Características Arquitetônicas
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pavimentos:</span>
              <span className="font-medium">2 (Térreo + Superior)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Apartamentos:</span>
              <span className="font-medium">10 unidades</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Área por apartamento:</span>
              <span className="font-medium">~30 m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estrutura:</span>
              <span className="font-medium">Concreto armado</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cobertura:</span>
              <span className="font-medium">Telhado de fibrocimento</span>
            </div>
          </div>
        </div>

        {/* Materiais e Acabamentos */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            🎨 Materiais e Acabamentos
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Paredes:</span>
              <span className="font-medium">Alvenaria + reboco</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pisos:</span>
              <span className="font-medium">Porcelanato 60x60</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Esquadrias:</span>
              <span className="font-medium">Alumínio + vidro</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Forro:</span>
              <span className="font-medium">Placas de gesso</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pintura:</span>
              <span className="font-medium">Tinta acrílica</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções de Uso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-blue-800 mb-3">
          💡 Como Usar o Visualizador 3D:
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="mb-2"><strong>1.</strong> Clique nos elementos 3D para selecioná-los</p>
            <p className="mb-2"><strong>2.</strong> Use o mouse para navegar no modelo</p>
            <p className="mb-2"><strong>3.</strong> Ative/desative wireframe e sombras</p>
          </div>
          <div>
            <p className="mb-2"><strong>4.</strong> Elementos são coloridos por tipo de material</p>
            <p className="mb-2"><strong>5.</strong> Hover para destacar elementos</p>
            <p className="mb-2"><strong>6.</strong> Informações detalhadas no painel superior</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arquitetura3D;
