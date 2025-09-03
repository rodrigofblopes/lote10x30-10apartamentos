import { create } from 'zustand';

export interface ItemCotacao {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  quantidade: number;
  unidade: string;
  sinapiMO: number;
  sinapiMat: number;
  sinapiTotal: number;
  realMO: number;
  realMat: number;
  realTotal: number;
  economia: number;
  percentualEconomia: number;
  custoPorM2: number;
  peso: number;
}

interface CotacaoStore {
  itens: ItemCotacao[];
  setItens: (itens: ItemCotacao[]) => void;
  updateItem: (id: string, updates: Partial<ItemCotacao>) => void;
  getResumo: () => {
    totalGeral: number;
    totalMaoObra: number;
    totalMateriais: number;
    percentualMaoObra: number;
    percentualMateriais: number;
    numItens: number;
    totalTerreo: number;
    totalSuperior: number;
  };
}

export const useCotacaoStore = create<CotacaoStore>((set, get) => ({
  itens: [],
  
  setItens: (itens) => set({ itens }),
  
  updateItem: (id, updates) => set((state) => ({
    itens: state.itens.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  getResumo: () => {
    const { itens } = get();
    
    if (itens.length === 0) {
      return {
        totalGeral: 0,
        totalMaoObra: 0,
        totalMateriais: 0,
        percentualMaoObra: 0,
        percentualMateriais: 0,
        numItens: 0,
        totalTerreo: 0,
        totalSuperior: 0
      };
    }

    const totalGeral = itens.reduce((acc, item) => acc + item.sinapiTotal, 0);
    const totalMaoObra = itens.reduce((acc, item) => acc + item.sinapiMO, 0);
    const totalMateriais = itens.reduce((acc, item) => acc + item.sinapiMat, 0);
    
    const totalTerreo = itens
      .filter(item => item.categoria === 'Pavimento Térreo')
      .reduce((acc, item) => acc + item.sinapiTotal, 0);
    
    const totalSuperior = itens
      .filter(item => item.categoria === 'Pavimento Superior')
      .reduce((acc, item) => acc + item.sinapiTotal, 0);

    return {
      totalGeral,
      totalMaoObra,
      totalMateriais,
      percentualMaoObra: totalGeral > 0 ? (totalMaoObra / totalGeral) * 100 : 0,
      percentualMateriais: totalGeral > 0 ? (totalMateriais / totalGeral) * 100 : 0,
      numItens: itens.length,
      totalTerreo,
      totalSuperior
    };
  }
}));
