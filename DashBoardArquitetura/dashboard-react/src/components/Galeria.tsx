import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';

interface Foto {
  id: string;
  titulo: string;
  descricao: string;
  url: string;
  categoria: string;
  data: string;
}

const Galeria: React.FC = () => {
  const [fotoSelecionada, setFotoSelecionada] = useState<Foto | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  // Fotos do projeto - plantas baixas dos pavimentos
  const fotos: Foto[] = [
    {
      id: '1',
      titulo: 'Pavimento Térreo',
      descricao: 'Planta baixa do pavimento térreo com 5 apartamentos',
      url: '/Pavimento Térreo.jpg',
      categoria: 'Plantas',
      data: '2024-01-10'
    },
    {
      id: '2',
      titulo: 'Pavimento Superior',
      descricao: 'Planta baixa do pavimento superior com 5 apartamentos',
      url: '/Pavimento Superior.jpg',
      categoria: 'Plantas',
      data: '2024-01-10'
    }
  ];

  const categorias = ['todas', ...Array.from(new Set(fotos.map(foto => foto.categoria)))];

  const fotosFiltradas = filtroCategoria === 'todas' 
    ? fotos 
    : fotos.filter(foto => foto.categoria === filtroCategoria);

  const abrirModal = (foto: Foto) => {
    setFotoSelecionada(foto);
  };

  const fecharModal = () => {
    setFotoSelecionada(null);
  };

  const navegarFoto = (direcao: 'anterior' | 'proxima') => {
    if (!fotoSelecionada) return;
    
    const indexAtual = fotosFiltradas.findIndex(f => f.id === fotoSelecionada.id);
    let novoIndex;
    
    if (direcao === 'anterior') {
      novoIndex = indexAtual > 0 ? indexAtual - 1 : fotosFiltradas.length - 1;
    } else {
      novoIndex = indexAtual < fotosFiltradas.length - 1 ? indexAtual + 1 : 0;
    }
    
    setFotoSelecionada(fotosFiltradas[novoIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Galeria de Fotos</h1>
        <p className="text-gray-600">
          Visualize plantas, cortes, fachadas e detalhes do projeto arquitetônico
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-2">
          {categorias.map(categoria => (
            <button
              key={categoria}
              onClick={() => setFiltroCategoria(categoria)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filtroCategoria === categoria
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoria === 'todas' ? 'Todas' : categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fotosFiltradas.map(foto => (
          <div
            key={foto.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => abrirModal(foto)}
          >
            <div className="relative">
              <img
                src={foto.url}
                alt={foto.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute top-2 right-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {foto.categoria}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{foto.titulo}</h3>
              <p className="text-sm text-gray-600 mb-2">{foto.descricao}</p>
              <p className="text-xs text-gray-500">{foto.data}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Visualização */}
      {fotoSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Botão Fechar */}
            <button
              onClick={fecharModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navegação */}
            {fotosFiltradas.length > 1 && (
              <>
                <button
                  onClick={() => navegarFoto('anterior')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => navegarFoto('proxima')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Imagem */}
            <img
              src={fotoSelecionada.url}
              alt={fotoSelecionada.titulo}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Informações */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{fotoSelecionada.titulo}</h3>
                  <p className="text-gray-300 mb-2">{fotoSelecionada.descricao}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Categoria: {fotoSelecionada.categoria}</span>
                    <span>Data: {fotoSelecionada.data}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = fotoSelecionada.url;
                    link.download = `${fotoSelecionada.titulo}.jpg`;
                    link.click();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas da Galeria</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{fotos.length}</div>
            <div className="text-sm text-gray-600">Plantas Baixas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{categorias.length - 1}</div>
            <div className="text-sm text-gray-600">Categorias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{fotosFiltradas.length}</div>
            <div className="text-sm text-gray-600">Fotos Filtradas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Pavimentos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Galeria;
