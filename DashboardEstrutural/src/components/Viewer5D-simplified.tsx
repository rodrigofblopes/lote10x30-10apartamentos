import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { carregarDados5D } from '../services/orcamento5DService';
import { Calculator, Box, Search, Settings } from 'lucide-react';

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

// Componente para carregar o modelo GLB
function StructuralModel() {
  const meshRef = useRef<THREE.Group>(null);

  // Carregar o modelo GLB
  const { scene } = useGLTF('/Estrutural.glb');

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

// Componente principal do Viewer 5D
export default function Viewer5D() {
  // Estados principais
  const [itens5D, setItens5D] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);

  // Estados de visibilidade
  const [show3D] = useState(true);
  const [showSpreadsheet] = useState(true);

  // Carregar dados da planilha
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const dados = await carregarDados5D();
        setItens5D(dados);
        console.log('✅ Dados carregados:', dados.length, 'itens');
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err);
        setError('Erro ao carregar dados da planilha');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Função para selecionar item da planilha
  const handleItemSelect = (item: any) => {
    const itemId = item.id;
    
    setSelectedItems(prev => {
      const isSelected = prev.includes(itemId);
      if (isSelected) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Função para determinar categoria baseada no nome
  const determineCategory = (name: string): string => {
    if (name.includes('1.1') || name.toLowerCase().includes('viga')) return 'Vigas';
    if (name.includes('1.2') || name.toLowerCase().includes('pilar')) return 'Pilares';
    if (name.includes('1.3') || name.toLowerCase().includes('fundação')) return 'Fundações';
    if (name.includes('2.1') || name.includes('2.2') || name.includes('2.3')) return 'Térreo';
    if (name.includes('3.1') || name.includes('3.2') || name.includes('3.3')) return 'Pavimento Superior';
    
    return 'Outros';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Erro</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard 5D</h1>
                <p className="text-sm text-gray-500">Lote 10x30 - 10 Apartamentos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Box className="h-4 w-4" />
                <span>Modelo 3D</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Search className="h-4 w-4" />
                <span>Planilha Orçamentária</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Visualizador 3D */}
          {show3D && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Box className="h-5 w-5 mr-2 text-blue-600" />
                  Modelo Estrutural 3D
                </h3>
              </div>
              <div className="h-96 lg:h-[500px]">
                <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
                  <Suspense fallback={<Loader />}>
                    <Environment preset="sunset" />
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <StructuralModel />
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
          )}

          {/* Planilha Orçamentária */}
          {showSpreadsheet && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Search className="h-5 w-5 mr-2 text-green-600" />
                  Planilha Orçamentária
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {itens5D.length} itens carregados
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Unidade
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Valor Unit.
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
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
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 border-l-4 border-blue-500' 
                              : isEtapaTotal 
                                ? 'bg-blue-25 hover:bg-blue-50' 
                                : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleItemSelect(item)}
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                            {item.codigo || item.id}
                          </td>
                          <td className={`px-3 py-2 text-xs max-w-[120px] sm:max-w-[150px] lg:max-w-[200px] truncate ${
                            isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                          }`} title={item.descricao}>
                            {item.descricao}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs hidden sm:table-cell ${
                            isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-500'
                          }`}>
                            {item.unidade}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs ${
                            isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                          }`}>
                            {item.quantidade.toLocaleString('pt-BR', { 
                              minimumFractionDigits: 1, 
                              maximumFractionDigits: 1 
                            })}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs hidden lg:table-cell ${
                            isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-500'
                          }`}>
                            R$ {item.valorUnitario.toLocaleString('pt-BR', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs font-medium ${
                            isEtapaTotal ? 'font-bold text-blue-800' : 'text-gray-900'
                          }`}>
                            R$ {item.total.toLocaleString('pt-BR', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
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
      </div>
    </div>
  );
}
