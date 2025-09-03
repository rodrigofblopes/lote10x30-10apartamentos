import React, { useEffect } from 'react';
import { useOrcamentoStore } from './store/orcamentoStore';
import { carregarDados } from './services/orcamentoService';
import Header from './components/Header';
import ResumoExecutivo from './components/ResumoExecutivo';
import GridOrcamento from './components/GridOrcamento';
import Graficos from './components/Graficos';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { setItens } = useOrcamentoStore();
  const [carregando, setCarregando] = React.useState(true);

  useEffect(() => {
    const inicializar = async () => {
      try {
        const dados = await carregarDados();
        setItens(dados);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    };

    inicializar();
  }, [setItens]);

  if (carregando) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <ResumoExecutivo />
          <GridOrcamento />
          <Graficos />
        </div>
      </main>
    </div>
  );
}

export default App;
