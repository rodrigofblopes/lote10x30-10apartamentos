import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Componente de loading
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando modelo 3D... {Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

// Componente para carregar o modelo GLB real
interface StructuralModelProps {
  setSelectedElement: (element: string) => void;
}

function StructuralModel({ setSelectedElement }: StructuralModelProps) {
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
            const elementName = child.name || `Elemento ${child.id}`;
            setSelectedElement(elementName);
            console.log('Elemento clicado:', elementName, child.userData);
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
  }, [scene, setSelectedElement]);

  return (
    <group ref={meshRef}>
      {scene && <primitive object={scene} />}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
    </group>
  );
}

// Componente principal do visualizador
const IFCViewer: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Visualizador 3D - Modelo Estrutural
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
            >
              {showInfo ? 'Ocultar Info' : 'Mostrar Info'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Visualizador 3D */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [10, 10, 10], fov: 60 }}
            style={{ background: '#f8fafc' }}
          >
            <Suspense fallback={<Loader />}>
              <StructuralModel setSelectedElement={setSelectedElement} />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
              />
              <Environment preset="sunset" />
            </Suspense>
          </Canvas>
          
          {/* Controles de navegação */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <p>🖱️ <strong>Botão esquerdo:</strong> Rotacionar</p>
              <p>🖱️ <strong>Botão direito:</strong> Pan</p>
              <p>🖱️ <strong>Scroll:</strong> Zoom</p>
            </div>
          </div>
        </div>

        {/* Painel de informações */}
        {showInfo && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informações do Elemento
            </h3>
            
            {selectedElement ? (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Elemento Selecionado</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Nome:</strong> {selectedElement}</p>
                    <p><strong>Tipo:</strong> Elemento Estrutural</p>
                    <div className="mt-2">
                      <p className="font-medium">Propriedades:</p>
                      <p className="ml-2">• Material: Concreto Armado</p>
                      <p className="ml-2">• Resistência: C25</p>
                      <p className="ml-2">• Aço: CA-50</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🏗️</div>
                <p>Clique em um elemento do modelo para ver suas informações</p>
              </div>
            )}

            {/* Informações gerais do modelo */}
            <div className="mt-6 bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-700 mb-2">Sobre o Modelo</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Projeto:</strong> Vila Andriw</p>
                <p><strong>Tipo:</strong> Modelo Estrutural</p>
                <p><strong>Elementos:</strong> Colunas, Vigas, Lajes</p>
                <p><strong>Disciplina:</strong> Estrutural</p>
              </div>
            </div>

            {/* Legenda */}
            <div className="mt-6 bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-700 mb-2">Legenda</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-amber-800 rounded"></div>
                  <span>Colunas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-amber-600 rounded"></div>
                  <span>Vigas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-slate-500 rounded opacity-70"></div>
                  <span>Lajes</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsividade mobile */}
      <div className="md:hidden p-4 bg-blue-50 border-t border-blue-200">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">📱 Controles Mobile:</p>
          <p>• Toque e arraste para rotacionar</p>
          <p>• Pinça para zoom</p>
          <p>• Dois dedos para pan</p>
        </div>
      </div>
    </div>
  );
};

export default IFCViewer;
