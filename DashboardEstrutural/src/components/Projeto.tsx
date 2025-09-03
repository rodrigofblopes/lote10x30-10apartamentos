import React, { useState } from 'react';
import { File, Download, Trash2, Plus, Eye } from 'lucide-react';

interface DocumentoProjeto {
  id: string;
  nome: string;
  tipo: 'dwg';
  descricao: string;
  url: string;
  dataUpload: Date;
  tamanho: string;
  extensao: string;
}

const Projeto: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentoProjeto[]>([
    // Arquivos DWG reais encontrados na pasta
    {
      id: '1',
      nome: 'Forma Fundação',
      tipo: 'dwg',
      descricao: 'Desenho técnico da forma de fundação com detalhes de execução',
      url: '/Forma Fundação.dwg',
      dataUpload: new Date('2025-09-02'),
      tamanho: '87.9 KB',
      extensao: 'dwg'
    },
    {
      id: '2',
      nome: 'Locação',
      tipo: 'dwg',
      descricao: 'Planta de locação com posicionamento dos elementos estruturais',
      url: '/Locação.dwg',
      dataUpload: new Date('2025-09-02'),
      tamanho: '59.7 KB',
      extensao: 'dwg'
    },
    {
      id: '3',
      nome: 'Prancha Fundação',
      tipo: 'dwg',
      descricao: 'Prancha completa da fundação com cortes e detalhes',
      url: '/Prancha Fundação.dwg',
      dataUpload: new Date('2025-09-02'),
      tamanho: '92.5 KB',
      extensao: 'dwg'
    }
  ]);

  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid');

  const handleUpload = () => {
    // Implementar lógica de upload
    alert('Funcionalidade de upload será implementada em breve!');
  };

  const handleDownload = (documento: DocumentoProjeto) => {
    // Para arquivos DWG, criar link de download
    const link = document.createElement('a');
    link.href = documento.url;
    link.download = documento.nome + '.' + documento.extensao;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      setDocumentos(documentos.filter(doc => doc.id !== id));
    }
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏗️ Projeto Estrutural - Lote 10x30 - 10 Apartamentos
          </h1>
          <p className="text-gray-600">
            Documentos DWG do projeto estrutural
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Título dos filtros */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Todos os Documentos
              </h2>
              <p className="text-sm text-gray-600">
                {documentos.length} arquivos DWG encontrados
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setVisualizacao(visualizacao === 'grid' ? 'lista' : 'grid')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {visualizacao === 'grid' ? 'Lista' : 'Grid'}
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Documento
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {documentos.length}
              </div>
              <div className="text-sm text-gray-600">Arquivos DWG</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {documentos.reduce((total, doc) => {
                  const tamanho = parseFloat(doc.tamanho.replace(' KB', ''));
                  return total + tamanho;
                }, 0).toFixed(1)} KB
              </div>
              <div className="text-sm text-gray-600">Tamanho Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatarData(new Date())}
              </div>
              <div className="text-sm text-gray-600">Última Atualização</div>
            </div>
          </div>
        </div>

        {/* Lista de Documentos */}
        {visualizacao === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentos.map((documento) => (
              <div key={documento.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Preview do Arquivo DWG */}
                <div className="h-48 bg-gray-200 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 p-2 rounded-full transition-all duration-200 hover:bg-opacity-100">
                      <Eye className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                  <div className="text-gray-500 text-center">
                    <File className="h-16 w-16 mx-auto mb-2 text-red-500" />
                    <p className="text-sm font-medium text-red-600">Arquivo DWG</p>
                    <p className="text-xs text-gray-500">{documento.extensao.toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-1">{documento.tamanho}</p>
                  </div>
                </div>

                {/* Informações do Documento */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 mb-1">{documento.nome}</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <File className="h-4 w-4 mr-1" />
                      <span>DWG</span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{documento.descricao}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{formatarData(documento.dataUpload)}</span>
                    <span>{documento.tamanho}</span>
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(documento)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(documento.id)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamanho
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
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <File className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{documento.nome}</div>
                            <div className="text-xs text-gray-500">.{documento.extensao}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{documento.descricao}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarData(documento.dataUpload)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {documento.tamanho}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload(documento)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(documento.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mensagem quando não há documentos */}
        {documentos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <File className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum arquivo DWG encontrado</h3>
            <p className="text-gray-500 mb-4">
              Adicione o primeiro arquivo DWG do projeto
            </p>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2 inline" />
              Adicionar Documento
            </button>
          </div>
        )}

        {/* Instruções */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📋 Como Usar a Aba Projeto:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="mb-2"><strong>1.</strong> Visualize todos os arquivos DWG do projeto</p>
              <p className="mb-2"><strong>2.</strong> Alternar entre visualização em grid ou lista</p>
              <p className="mb-2"><strong>3.</strong> Veja estatísticas de tamanho e quantidade</p>
            </div>
            <div>
              <p className="mb-2"><strong>4.</strong> Faça download dos arquivos DWG</p>
              <p className="mb-2"><strong>5.</strong> Adicione novos documentos (em breve)</p>
              <p className="mb-2"><strong>6.</strong> Organize por data de upload</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projeto;
