import { useState, useEffect } from 'react';
import { useOrcamentoStore } from './store/orcamentoStore';
import { carregarDados } from './services/orcamentoService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ResumoExecutivo from './components/ResumoExecutivo';
import GridOrcamento from './components/GridOrcamento';
import Graficos from './components/Graficos';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [activeTab, setActiveTab] = useState('resumo');
  const { setItens } = useOrcamentoStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const inicializar = async () => {
      try {
        setLoading(true);
        const dados = await carregarDados();
        setItens(dados);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    inicializar();
  }, [setItens]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'resumo':
        return <ResumoExecutivo />;
      case 'orcamento':
        return <GridOrcamento />;
      case 'graficos':
        return <Graficos />;
      default:
        return <ResumoExecutivo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
