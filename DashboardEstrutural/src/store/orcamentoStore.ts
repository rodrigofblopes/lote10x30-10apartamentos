import { create } from 'zustand';
import { OrcamentoItem, ResumoExecutivo } from '../types/orcamento';

interface OrcamentoStore {
  itens: OrcamentoItem[];
  resumo: ResumoExecutivo;
  setItens: (itens: OrcamentoItem[]) => void;
  calcularResumo: () => void;
}

export const useOrcamentoStore = create<OrcamentoStore>((set, get) => ({
  itens: [],
  resumo: {
    valorTotal: 0,
    maoDeObraTotal: 0,
    materiaisTotal: 0,
    areaTotal: 0,
    custoPorM2: 0,
    itemMaisCaro: null
  },

  setItens: (itens: OrcamentoItem[]) => {
    set({ itens });
    get().calcularResumo();
  },

  calcularResumo: () => {
    const { itens } = get();
    
    if (itens.length === 0) {
      set({ resumo: {
        valorTotal: 0,
        maoDeObraTotal: 0,
        materiaisTotal: 0,
        areaTotal: 0,
        custoPorM2: 0,
        itemMaisCaro: null
      }});
      return;
    }

    const valorTotal = itens.reduce((sum, item) => sum + item.total, 0);
    const maoDeObraTotal = itens.reduce((sum, item) => sum + item.maoDeObra, 0);
    const materiaisTotal = itens.reduce((sum, item) => sum + item.materiais, 0);
    const areaTotal = itens.reduce((sum, item) => sum + (item.area || 0), 0);
    const custoPorM2 = areaTotal > 0 ? valorTotal / areaTotal : 0;
    
    const itemMaisCaro = itens.reduce((max, item) => 
      item.total > (max?.total || 0) ? item : max
    );

    set({ resumo: {
      valorTotal,
      maoDeObraTotal,
      materiaisTotal,
      areaTotal,
      custoPorM2,
      itemMaisCaro
    }});
  }
}));
