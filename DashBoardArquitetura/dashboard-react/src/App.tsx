import { useEffect, useState } from 'react';
import { useOrcamentoStore } from './store/orcamentoStore';
import { carregarDados } from './services/orcamentoService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ResumoExecutivo from './components/ResumoExecutivo';
import GridOrcamento from './components/GridOrcamento';
import CotacaoReal from './components/CotacaoReal';
import Projeto from './components/Projeto';
import Graficos from './components/Graficos';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { setItens, carregando } = useOrcamentoStore();
  const [activeTab, setActiveTab] = useState('resumo');

  useEffect(() => {
    const carregarDadosInicial = async () => {
      try {
        const dados = await carregarDados();
        setItens(dados);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDadosInicial();
  }, [setItens]);

  const renderContent = () => {
    switch (activeTab) {
      case 'resumo':
        return <ResumoExecutivo />;
      case 'orcamento':
        return <GridOrcamento />;
      case 'cotacao':
        return <CotacaoReal />;
      case 'projeto':
        return <Projeto />;
      case 'graficos':
        return <Graficos />;
      default:
        return <ResumoExecutivo />;
    }
  };

  if (carregando) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
