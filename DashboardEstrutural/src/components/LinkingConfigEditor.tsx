import React, { useState, useEffect } from 'react';
import { LINKING_CONFIG, validateLinkingConfig, exportLinkingConfig, importLinkingConfig, OfflineLink, LinkingConfig } from '../config/linkingConfig';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { 
  Save, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  AlertTriangle,
  Eye,
  Settings
} from 'lucide-react';

interface LinkingConfigEditorProps {
  onConfigChange: (config: LinkingConfig) => void;
  onClose: () => void;
}

const LinkingConfigEditor: React.FC<LinkingConfigEditorProps> = ({ onConfigChange, onClose }) => {
  const { itens } = useOrcamentoStore();
  const [config, setConfig] = useState<LinkingConfig>(LINKING_CONFIG);
  const [editingLink, setEditingLink] = useState<OfflineLink | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validation, setValidation] = useState(validateLinkingConfig(config));

  // Atualizar validação quando config mudar
  useEffect(() => {
    setValidation(validateLinkingConfig(config));
  }, [config]);

  const handleSave = () => {
    const newValidation = validateLinkingConfig(config);
    if (newValidation.isValid) {
      onConfigChange(config);
      alert('Configuração salva com sucesso!');
    } else {
      alert('Erro na configuração: ' + newValidation.errors.join(', '));
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    const data = exportLinkingConfig(config, format);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linking-config-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const importedConfig = importLinkingConfig(content);
        if (importedConfig) {
          setConfig(importedConfig);
          alert('Configuração importada com sucesso!');
        } else {
          alert('Erro ao importar configuração');
        }
      };
      reader.readAsText(file);
    }
  };

  const addLink = () => {
    const newLink: OfflineLink = {
      id: `link_${Date.now()}`,
      element3D: {
        id: '',
        name: '',
        category: '',
        keywords: []
      },
      budgetItem: {
        id: '',
        code: '',
        description: '',
        category: ''
      },
      linkType: 'manual',
      confidence: 0,
      createdAt: new Date().toISOString(),
      validated: false
    };
    setEditingLink(newLink);
  };

  const editLink = (link: OfflineLink) => {
    setEditingLink({ ...link });
  };

  const deleteLink = (linkId: string) => {
    if (confirm('Tem certeza que deseja excluir este link?')) {
      setConfig(prev => ({
        ...prev,
        links: prev.links.filter(link => link.id !== linkId)
      }));
    }
  };

  const saveLink = () => {
    if (editingLink) {
      setConfig(prev => ({
        ...prev,
        links: prev.links.some(link => link.id === editingLink.id)
          ? prev.links.map(link => link.id === editingLink.id ? editingLink : link)
          : [...prev.links, editingLink]
      }));
      setEditingLink(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Settings className="h-6 w-6 mr-2" />
            Editor de Configuração de Links
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Status da Validação */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              validation.isValid 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {validation.isValid ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              {validation.isValid ? 'Configuração Válida' : 'Configuração com Erros'}
            </div>
            <div className="text-sm text-gray-600">
              {config.links.length} links configurados
            </div>
            {validation.warnings.length > 0 && (
              <div className="text-sm text-yellow-600">
                {validation.warnings.length} avisos
              </div>
            )}
          </div>
          
          {validation.errors.length > 0 && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800 mb-1">Erros:</h4>
              <ul className="text-sm text-red-700 list-disc list-inside">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Salvar Configuração
          </button>
          
          <button
            onClick={() => handleExport('json')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Exportar JSON
          </button>
          
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer">
            <Upload className="h-4 w-4" />
            Importar
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={addLink}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Adicionar Link
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              showPreview 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-auto p-4">
          {editingLink ? (
            <LinkEditor
              link={editingLink}
              items={itens}
              onSave={saveLink}
              onCancel={() => setEditingLink(null)}
              onChange={setEditingLink}
            />
          ) : (
            <div className="space-y-4">
              {/* Lista de Links */}
              <div className="grid gap-4">
                {config.links.map((link) => (
                  <div key={link.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{link.element3D.name}</span>
                        <span className="text-gray-500">→</span>
                        <span className="font-medium">{link.budgetItem.code}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          link.validated 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {link.validated ? 'Validado' : 'Pendente'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editLink(link)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Categoria:</strong> {link.element3D.category} → {link.budgetItem.category}</div>
                      <div><strong>Confiança:</strong> {link.confidence}% | <strong>Tipo:</strong> {link.linkType}</div>
                      {link.notes && <div><strong>Notas:</strong> {link.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Preview da Configuração
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Projeto:</strong> {config.project}
                    </div>
                    <div>
                      <strong>Versão:</strong> {config.version}
                    </div>
                    <div>
                      <strong>Última Atualização:</strong> {new Date(config.lastUpdated).toLocaleString()}
                    </div>
                    <div>
                      <strong>Total de Links:</strong> {config.links.length}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para editar um link individual
interface LinkEditorProps {
  link: OfflineLink;
  items: any[];
  onSave: () => void;
  onCancel: () => void;
  onChange: (link: OfflineLink) => void;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ link, items, onSave, onCancel, onChange }) => {
  const updateLink = (updates: Partial<OfflineLink>) => {
    onChange({ ...link, ...updates });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Editar Link</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Elemento 3D */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Elemento 3D</label>
          <input
            type="text"
            value={link.element3D.name}
            onChange={(e) => updateLink({
              element3D: { ...link.element3D, name: e.target.value }
            })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Nome do elemento 3D"
          />
          <input
            type="text"
            value={link.element3D.id}
            onChange={(e) => updateLink({
              element3D: { ...link.element3D, id: e.target.value }
            })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="ID do elemento"
          />
        </div>

        {/* Item do Orçamento */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Item do Orçamento</label>
          <select
            value={link.budgetItem.id}
            onChange={(e) => {
              const selectedItem = items.find(item => item.id === e.target.value);
              if (selectedItem) {
                updateLink({
                  budgetItem: {
                    id: selectedItem.id,
                    code: selectedItem.codigo,
                    description: selectedItem.descricao,
                    category: selectedItem.categoria
                  }
                });
              }
            }}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Selecione um item</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.codigo} - {item.descricao}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Tipo de Link</label>
          <select
            value={link.linkType}
            onChange={(e) => updateLink({ linkType: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="exact">Exato</option>
            <option value="category">Categoria</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Confiança (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={link.confidence}
            onChange={(e) => updateLink({ confidence: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Validado</label>
          <input
            type="checkbox"
            checked={link.validated}
            onChange={(e) => updateLink({ validated: e.target.checked })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Notas</label>
        <textarea
          value={link.notes || ''}
          onChange={(e) => updateLink({ notes: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          placeholder="Notas sobre este link..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Check className="h-4 w-4" />
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default LinkingConfigEditor;
