# 🏗️ Dashboard de Orçamento - Lote 10x30 - 10 Apartamentos

Dashboard interativo e moderno para análise de orçamentos de construção, desenvolvido especificamente para o projeto Lote 10x30 - 10 Apartamentos baseado na planilha SINAPI.

## ✨ Características

- **📊 Interface Moderna**: Design responsivo com cards elegantes e cores temáticas
- **🔍 Filtros Avançados**: Busca por texto, categoria, subcategoria, valor e área
- **📈 Gráficos Interativos**: Visualizações de distribuição de custos e comparações
- **💾 Export de Dados**: Exportação para CSV com dados filtrados
- **📱 Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **🎨 Tema Verde**: Paleta de cores profissional para engenharia

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Estado**: Zustand
- **Ícones**: Lucide React
- **Build**: Vite
- **Gráficos**: Chart.js (preparado para implementação)

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalação

1. **Clone o repositório**:
```bash
git clone <url-do-repositorio>
cd DashboardEstrutural
```

2. **Instale as dependências**:
```bash
npm install
# ou
yarn install
```

3. **Execute o projeto**:
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse no navegador**:
```
http://localhost:3000
```

## 📊 Estrutura dos Dados

O dashboard está configurado para trabalhar com dados estruturados da seguinte forma:

```typescript
interface OrcamentoItem {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;        // Ex: Fundação, Térreo, Pavimento Superior
  subcategoria: string;     // Ex: Vigas, Pilares, Lajes
  unidade: string;          // Ex: m², m³, KG
  quantidade: number;
  valorUnitario: number;
  maoDeObra: number;        // Valor total da mão de obra
  materiais: number;        // Valor total dos materiais
  total: number;            // Valor total do item
  maoDeObraPorM2: number;   // M.O. por m²
  materiaisPorM2: number;   // Materiais por m²
  totalPorM2: number;       // Total por m²
  peso: number;             // Percentual do item no orçamento
  area?: number;            // Área em m² (opcional)
}
```

## 🎯 Funcionalidades

### 1. **Resumo Executivo**
- Valor total do orçamento
- Distribuição mão de obra vs materiais
- Área total construída
- Custo médio por m²
- Item mais caro e mais barato

### 2. **Filtros e Busca**
- **Busca por texto**: Nome, código ou descrição
- **Filtro por categoria**: Fundação, Térreo, Pavimento Superior
- **Filtro por subcategoria**: Vigas, Pilares, Lajes, etc.
- **Filtro por valor**: Faixa de valores configurável
- **Filtro por área**: Faixa de área em m²
- **Ordenação**: Por qualquer campo (crescente/decrescente)

### 3. **Grid de Cards**
- **Layout responsivo**: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop)
- **Cards informativos**: Todos os dados do item organizados visualmente
- **Hover effects**: Animações suaves e interativas
- **Export CSV**: Download dos dados filtrados

### 4. **Gráficos e Visualizações**
- **Distribuição por categoria**: Gráfico de pizza com legenda
- **M.O. vs Materiais**: Gráfico de barras empilhadas
- **Custo por m²**: Análise de custo-benefício
- **Estatísticas rápidas**: Métricas resumidas

## 🎨 Personalização

### Cores
O tema pode ser personalizado editando `tailwind.config.js`:

```javascript
colors: {
  'green': {
    50: '#E8F5E8',   // Fundo dos cards
    100: '#D1EBD1',
    500: '#4A9B6B',  // Números em destaque
    600: '#2D5A4D',  // Texto principal
  }
}
```

### Layout
- **Grid responsivo**: Ajuste o número de colunas em `GridOrcamento.tsx`
- **Espaçamento**: Modifique as classes Tailwind para ajustar espaçamentos
- **Tipografia**: Altere as fontes no CSS global

## 📱 Responsividade

- **Desktop (lg+)**: 3-4 colunas, sidebar lateral
- **Tablet (md)**: 2 colunas, layout adaptado
- **Mobile**: 1 coluna, cards empilhados, filtros colapsáveis

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executa linter
```

### Estrutura de Arquivos

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Cabeçalho principal
│   ├── ResumoExecutivo.tsx  # Cards de resumo
│   ├── Filtros.tsx     # Sidebar de filtros
│   ├── GridOrcamento.tsx    # Grid de cards
│   ├── Graficos.tsx    # Componentes de gráficos
│   └── LoadingSpinner.tsx   # Tela de carregamento
├── store/              # Gerenciamento de estado
│   └── orcamentoStore.ts    # Store Zustand
├── services/           # Serviços e dados
│   └── orcamentoService.ts  # Dados mockados e funções
├── types/              # Definições TypeScript
│   └── orcamento.ts    # Interfaces e tipos
├── App.tsx             # Componente principal
├── main.tsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 📊 Dados de Exemplo

O dashboard inclui dados mockados baseados na planilha real da Vila Andriw:

- **Fundação**: Vigas, Pilares, Sapatas
- **Térreo**: Vigas, Pilares, Lajes
- **Pavimento Superior**: Vigas, Pilares, Concreto

Cada item inclui valores reais de:
- Mão de obra (SINAPI)
- Materiais (SINAPI)
- Quantidades e unidades
- Custos por m²

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

### Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Configure o build command: `npm run build`
3. Configure o output directory: `dist`
4. Deploy automático a cada push

### Deploy Estático

O build gera arquivos estáticos na pasta `dist/` que podem ser servidos por qualquer servidor web.

## 🔮 Próximas Funcionalidades

- [ ] **Gráficos Chart.js**: Implementação completa dos gráficos interativos
- [ ] **Upload de arquivos**: Suporte para CSV/Excel personalizados
- [ ] **Comparação de projetos**: Análise entre diferentes orçamentos
- [ ] **Relatórios PDF**: Geração de relatórios em PDF
- [ ] **Dashboard em tempo real**: Atualizações automáticas
- [ ] **Métricas avançadas**: Análise de variação de preços

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvido por

**Engenharia Vila Andriw** - Setor de Engenharia
- Rodrigo Ryzen - Responsável Técnico

## 📞 Suporte

Para dúvidas ou suporte técnico:
- 📧 Email: engenharia@vilaandriw.com
- 📱 WhatsApp: (XX) XXXXX-XXXX
- 🏢 Endereço: Rondônia - RO

---

**🏗️ Dashboard de Orçamento - Vila Andriw**  
*Análise interativa baseada em dados reais da planilha SINAPI*
