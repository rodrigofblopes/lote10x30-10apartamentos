import React, { useEffect } from 'react';
import { useOrcamentoStore } from './store/orcamentoStore';
import { carregarDados } from './services/orcamentoService';
import Header from './components/Header';
import ResumoExecutivo from './components/ResumoExecutivo';
import GridOrcamento from './components/GridOrcamento';
import Graficos from './components/Graficos';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { setItens, carregando } = useOrcamentoStore();

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

  if (carregando) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <ResumoExecutivo />
        
        <div className="mt-8">
          <GridOrcamento />
          <Graficos />
        </div>
      </div>
    </div>
  );
}

export default App;
