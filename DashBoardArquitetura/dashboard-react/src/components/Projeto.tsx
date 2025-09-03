import React, { useState } from 'react';
import { File, Download, Plus, X, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

interface DocumentoProjeto {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  dataCriacao: Date;
  dataModificacao: Date;
  categoria: string;
  descricao: string;
  caminho?: string;
}

const Projeto: React.FC = () => {
  const [documentos] = useState<DocumentoProjeto[]>([
    {
      id: '1',
      nome: 'Pavimento Térreo.jpg',
      tipo: 'jpg',
      tamanho: '108KB',
      dataCriacao: new Date('2024-01-15'),
      dataModificacao: new Date('2024-01-15'),
      categoria: 'Plantas',
      descricao: 'Planta baixa do pavimento térreo - Lote 10x30 - 10 Apartamentos',
      caminho: '/Pavimento Térreo.jpg'
    },
    {
      id: '2',
      nome: 'Pavimento Superior.jpg',
      tipo: 'jpg',
      tamanho: '73KB',
      dataCriacao: new Date('2024-01-15'),
      dataModificacao: new Date('2024-01-15'),
      categoria: 'Plantas',
      descricao: 'Planta baixa do pavimento superior - Lote 10x30 - 10 Apartamentos',
      caminho: '/Pavimento Superior.jpg'
    }
  ]);

  const [visualizacao, setVisualizacao] = useState<'grid' | 'list'>('grid');
  const [imagemSelecionada, setImagemSelecionada] = useState<DocumentoProjeto | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [zoom, setZoom] = useState(1);

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR');
  };

  const getUltimaAtualizacao = () => {
    if (documentos.length === 0) return 'N/A';
    const datas = documentos.map(doc => doc.dataModificacao);
    const maisRecente = new Date(Math.max(...datas.map(d => d.getTime())));
    return formatarData(maisRecente);
  };

  const handleVisualizar = (documento: DocumentoProjeto) => {
    setImagemSelecionada(documento);
    setModalAberto(true);
    setZoom(1); // Reset zoom ao abrir nova imagem
  };

  const handleDownload = (documento: DocumentoProjeto) => {
    // Simular download - em produção, isso seria um link real para o arquivo
    const link = document.createElement('a');
    link.href = `#`; // Em produção, seria o caminho real do arquivo
    link.download = documento.nome;
    link.click();
  };



  const fecharModal = () => {
    setModalAberto(false);
    setImagemSelecionada(null);
    setZoom(1);
  };

  const aumentarZoom = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const diminuirZoom = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700">
              🏠 Plantas do Projeto
            </h2>
            <p className="text-gray-600 mt-2">
              Visualize diretamente as plantas arquitetônicas do Lote 10x30 - 10 Apartamentos
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setVisualizacao('grid')}
              className={`p-2 rounded-lg ${
                visualizacao === 'grid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setVisualizacao('list')}
              className={`p-2 rounded-lg ${
                visualizacao === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg mr-3">
                <File className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Plantas JPG</p>
                <p className="text-2xl font-bold text-blue-700">{documentos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg mr-3">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-600">Tamanho Total</p>
                <p className="text-2xl font-bold text-green-700">
                  {documentos.reduce((acc, doc) => acc + parseInt(doc.tamanho), 0)} KB
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg mr-3">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-purple-600">Última Atualização</p>
                <p className="text-2xl font-bold text-purple-700">
                  {getUltimaAtualizacao()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Documentos */}
        {visualizacao === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {documentos.map((documento) => (
              <div key={documento.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {/* Header do Card */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{documento.nome}</h3>
                        <p className="text-sm text-blue-600 font-medium">{documento.categoria}</p>
                      </div>
                    </div>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {documento.tipo.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Imagem Principal - Carregada Diretamente */}
                <div className="relative group">
                  <div className="h-80 bg-gray-100 overflow-hidden">
                    <img
                      src={documento.caminho || `data:image/jpeg;base64,${btoa('placeholder')}`}
                      alt={documento.descricao}
                      className="w-full h-full object-contain cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      onClick={() => handleVisualizar(documento)}
                    />
                  </div>
                  
                  {/* Overlay com Botões */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                      <button
                        onClick={() => handleVisualizar(documento)}
                        className="bg-white bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
                        title="Visualizar em Tela Cheia"
                      >
                        <Maximize2 className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleDownload(documento)}
                        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 hover:scale-110"
                        title="Download"
                      >
                        <Download className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informações do Documento */}
                <div className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">{documento.descricao}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Tamanho:</span>
                      <br />
                      <span className="text-gray-600">{documento.tamanho}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Data:</span>
                      <br />
                      <span className="text-gray-600">{formatarData(documento.dataModificacao)}</span>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleVisualizar(documento)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Maximize2 className="h-4 w-4" />
                      <span>Visualizar</span>
                    </button>
                    <button
                      onClick={() => handleDownload(documento)}
                      className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200 hover:border-green-300"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentos.map((documento) => (
                  <tr key={documento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:scale-105 transition-transform duration-200">
                        <img
                          src={documento.caminho || `data:image/jpeg;base64,${btoa('placeholder')}`}
                          alt={documento.descricao}
                          className="w-full h-full object-cover"
                          onClick={() => handleVisualizar(documento)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{documento.nome}</div>
                          <div className="text-sm text-gray-500">{documento.descricao}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {documento.tipo.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {documento.tamanho}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatarData(documento.dataModificacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVisualizar(documento)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Maximize2 className="h-4 w-4" />
                          <span>Visualizar</span>
                        </button>
                        <button
                          onClick={() => handleDownload(documento)}
                          className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Estado Vazio */}
        {documentos.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma planta encontrada</h3>
            <p className="text-gray-500 mb-6">
              Adicione plantas JPG do projeto arquitetônico para começar.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Planta
            </button>
          </div>
        )}
      </div>

      {/* Modal de Visualização com Zoom */}
      {modalAberto && imagemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl max-h-full overflow-hidden relative">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{imagemSelecionada.nome}</h3>
                <p className="text-sm text-gray-600">{imagemSelecionada.descricao}</p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Controles de Zoom */}
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                  <button
                    onClick={diminuirZoom}
                    className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                    title="Diminuir Zoom"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={aumentarZoom}
                    className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                    title="Aumentar Zoom"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={resetZoom}
                    className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                </div>
                <button
                  onClick={fecharModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Conteúdo da Imagem com Zoom */}
            <div className="p-4 max-h-[80vh] overflow-auto bg-gray-100">
              <div className="flex justify-center">
                <img
                  src={imagemSelecionada.caminho || `data:image/jpeg;base64,${btoa('placeholder')}`}
                  alt={imagemSelecionada.descricao}
                  className="max-w-full h-auto object-contain rounded-lg shadow-2xl transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
            </div>
            
            {/* Footer do Modal */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Tamanho:</span> {imagemSelecionada.tamanho} | 
                <span className="font-medium ml-2">Data:</span> {formatarData(imagemSelecionada.dataModificacao)} |
                <span className="font-medium ml-2">Zoom:</span> {Math.round(zoom * 100)}%
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(imagemSelecionada)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={fecharModal}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projeto;
