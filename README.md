# 🏗️ Vila Andriw - Hub Central de Projetos

## 📋 Descrição

Hub Central integrado para gerenciamento de projetos multidisciplinares de engenharia da Vila Andriw. Interface moderna e responsiva que centraliza o acesso a todos os dashboards e disciplinas do projeto.

## ✨ Funcionalidades

- **Hub Central Integrado**: Navegação unificada para todas as disciplinas
- **Cards Interativos**: Interface clicável para acesso direto aos dashboards
- **Design Responsivo**: Interface adaptável para desktop e mobile
- **Navegação Intuitiva**: Acesso direto aos dashboards sem configurações complexas

## 🎯 Disciplinas Disponíveis

### 🏠 **Arquitetura**
- Dashboard interativo de orçamento
- Análise detalhada por pavimento
- Custos de mão de obra e materiais
- **URL**: [Dashboard Arquitetura](http://localhost:5173)

### 🏗️ **Estrutural**
- Dashboard interativo de orçamento
- Análise detalhada por pavimento
- Custos de mão de obra e materiais
- **URL**: [Dashboard Estrutural](http://localhost:5174)

### 🔄 **Em Desenvolvimento**
- Hidrosanitário
- Elétrico
- HVAC
- Gerenciamento

## 🚀 Como Executar Localmente

### **1. Hub Central**
```bash
# Abrir o arquivo index.html no navegador
start index.html
```

### **2. Dashboard Arquitetura**
```bash
cd DashBoardArquitetura/dashboard-react
npm install
npm run dev
# Acessar: http://localhost:5173
```

### **3. Dashboard Estrutural**
```bash
cd DashboardEstrutural
npm install
npm run dev
# Acessar: http://localhost:5174
```

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Ícones**: Font Awesome
- **Dashboards**: React + TypeScript + Vite
- **Deploy**: Vercel

## 📁 Estrutura do Projeto

```
lote10x30-10apartamentos/
├── index.html                 # Hub Central
├── DashBoardArquitetura/     # Dashboard de Arquitetura
│   └── dashboard-react/      # Aplicação React
├── DashboardEstrutural/      # Dashboard Estrutural
│   └── src/                  # Código fonte React
├── .gitignore               # Arquivos ignorados pelo Git
└── README.md                # Documentação do projeto
```

## 🌐 Deploy

### **Hub Central**
- **URL**: [Vila Andriw Hub](https://vila-andriw-hub.vercel.app)
- **Status**: ✅ Deployado

### **Dashboards**
- **Arquitetura**: [Dashboard Arquitetura](https://dashboard-arquitetura.vercel.app)
- **Estrutural**: [Dashboard Estrutural](https://dashboard-estrutural.vercel.app)

## 🔧 Configuração para Produção

Para configurar as URLs de produção, atualize o arquivo `index.html`:

```javascript
const urls = {
    'arquitetura': 'https://dashboard-arquitetura.vercel.app',
    'estrutural': 'https://dashboard-estrutural.vercel.app'
};
```

## 📱 Responsividade

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

## 🎨 Design System

- **Cores**: Paleta baseada em verde, azul e cinza
- **Tipografia**: Inter + Font Awesome
- **Componentes**: Cards, botões, indicadores de status
- **Animações**: Hover effects, ripple effects, transições suaves

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

## 📄 Licença

© 2024 Vila Andriw - Projeto de Engenharia Integrada
Todos os direitos reservados.

---

**Desenvolvido com ❤️ pela equipe Vila Andriw**
