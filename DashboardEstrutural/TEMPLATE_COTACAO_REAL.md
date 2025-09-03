esta ro# 🎯 TEMPLATE: Sistema de Cotação Real para Projetos Estruturais

## 📊 **Visão Geral**
Sistema completo para comparação de valores SINAPI com cotações reais do mercado, permitindo negociação eficiente com mão de obra e análise de custos por m².

## 🏗️ **Estrutura do Sistema**

### **Componentes Principais:**
1. **CotacaoReal.tsx** - Interface principal de cotação
2. **Interface ItemCotacao** - Estrutura de dados
3. **Lógica de Cálculo** - Economia e custo por m²
4. **Dados SINAPI** - Integração com planilhas oficiais

---

## 🔧 **1. Interface de Dados (TypeScript)**

```typescript
interface ItemCotacao {
  id: string;                    // ID único do item
  codigo: string;               // Código SINAPI oficial
  descricao: string;            // Descrição completa do serviço
  categoria: string;            // Categoria principal (Fundação, Térreo, Superior)
  subcategoria: string;         // Subcategoria (Vigas, Pilares, Lajes, Fundações)
  quantidade: number;           // Quantidade do item
  unidade: string;              // Unidade de medida (m³, KG, m²)
  sinapiMO: number;             // Valor M.O. SINAPI
  sinapiMat: number;            // Valor Materiais SINAPI
  sinapiTotal: number;          // Total SINAPI calculado
  realMO: number;               // Valor M.O. real (editável)
  realMat: number;              // Valor Materiais real (editável)
  realTotal: number;            // Total real calculado
  economia: number;             // Economia calculada
  percentualEconomia: number;   // Percentual de economia
  custoPorM2: number;           // Custo por m²
  peso: number;                 // Peso percentual no projeto
}
```

---

## 📊 **2. Estrutura de Dados SINAPI**

### **Categorias Principais:**
```
1. Fundação (30,81%)
   ├── Vigas (15,25%)
   ├── Pilares (7,30%)
   └── Fundações (8,26%)

2. Térreo (37,20%)
   ├── Vigas (13,65%)
   ├── Pilares (17,57%)
   └── Lajes (5,98%)

3. Pavimento Superior (31,99%)
   ├── Vigas (11,24%)
   └── Pilares (2,21%)
```

### **Subcategorias Padrão:**
- **Vigas** - Armadura, Concreto, Formas
- **Pilares** - Armadura, Concreto, Formas
- **Lajes** - Armadura, Concreto
- **Fundações** - Armadura, Concreto, Formas

---

## 🧮 **3. Fórmulas de Cálculo**

### **Cálculo de Totais:**
```typescript
// Total por item
realTotal = (realMO × quantidade) + (realMat × quantidade)

// Economia
economia = sinapiTotal - realTotal

// Percentual de economia
percentualEconomia = (economia / sinapiTotal) × 100

// Custo por m²
custoPorM2 = realTotal / areaTotal
```

### **Totais Consolidados:**
```typescript
// Totais do projeto
totalSINAPI = Σ(sinapiTotal)
totalReal = Σ(realTotal)
totalEconomia = Σ(economia)
totalCustoPorM2 = totalReal / areaTotal
```

---

## 📁 **4. Estrutura de Arquivos**

```
src/
├── components/
│   ├── CotacaoReal.tsx          # Componente principal
│   └── [outros componentes]
├── types/
│   └── cotacao.ts               # Interfaces TypeScript
├── data/
│   └── sinapiData.ts            # Dados SINAPI (opcional)
└── utils/
    └── cotacaoCalculations.ts   # Funções de cálculo
```

---

## 🚀 **5. Passos para Replicar em Outros Projetos**

### **Passo 1: Copiar Estrutura**
```bash
# Copiar o componente CotacaoReal.tsx
cp CotacaoReal.tsx novo-projeto/src/components/

# Copiar as interfaces
cp types/cotacao.ts novo-projeto/src/types/
```

### **Passo 2: Adaptar Dados SINAPI**
1. **Extrair dados** da planilha oficial do novo projeto
2. **Mapear categorias** e subcategorias
3. **Ajustar quantidades** e unidades
4. **Atualizar valores** SINAPI

### **Passo 3: Personalizar Interface**
1. **Alterar título** do projeto
2. **Ajustar área total** padrão
3. **Modificar cores** e branding
4. **Adicionar campos** específicos se necessário

---

## 📋 **6. Checklist de Implementação**

- [ ] **Interface ItemCotacao** implementada
- [ ] **Dados SINAPI** extraídos e mapeados
- [ ] **Lógica de cálculo** implementada
- [ ] **Componente CotacaoReal** criado
- [ ] **Integração** com sistema de navegação
- [ ] **Testes** de funcionalidade
- [ ] **Documentação** atualizada

---

## 💡 **7. Dicas de Manutenção**

### **Atualizações SINAPI:**
- **Mensal** - Verificar novos valores SINAPI
- **Trimestral** - Revisar estrutura de categorias
- **Anual** - Atualizar códigos e descrições

### **Melhorias Contínuas:**
- **Exportação** para Excel/PDF
- **Histórico** de cotações
- **Comparação** entre projetos
- **Relatórios** automáticos

---

## 🔗 **8. Integração com Outros Sistemas**

### **Possíveis Integrações:**
- **Sistema de Orçamentos** - Dados SINAPI automáticos
- **Gestão de Projetos** - Controle de custos
- **Relatórios** - Exportação de dados
- **Dashboard** - Métricas em tempo real

---

## 📞 **9. Suporte e Manutenção**

### **Para Dúvidas:**
1. **Verificar** este template
2. **Consultar** código fonte original
3. **Adaptar** para necessidades específicas
4. **Testar** funcionalidades

### **Manutenção:**
- **Backup** regular do código
- **Versionamento** com Git
- **Documentação** atualizada
- **Testes** de funcionalidade

---

## 🎯 **10. Próximos Passos Recomendados**

1. **Testar** o sistema atual em produção
2. **Coletar feedback** dos usuários
3. **Identificar** melhorias necessárias
4. **Criar** versão para outros projetos
5. **Padronizar** processo de implementação

---

*Template criado para facilitar a replicação do sistema de Cotação Real em outros projetos estruturais.*
