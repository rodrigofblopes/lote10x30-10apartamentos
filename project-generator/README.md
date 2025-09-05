# 🏗️ Gerador de Dashboards de Projetos

Sistema automatizado para criar novos dashboards de projetos arquitetônicos e estruturais a partir de templates.

## 📁 Estrutura do Sistema

```
project-generator/
├── templates/                    # Templates base
│   ├── dashboard-arquitetura/   # Template Dashboard Arquitetura
│   ├── dashboard-estrutural/    # Template Dashboard Estrutural
│   └── shared/                  # Componentes compartilhados
├── config/                      # Configurações
│   ├── project-config.json     # Configuração do projeto
│   └── budget-mappings.json    # Mapeamentos de orçamento
├── scripts/                     # Scripts de automação
│   ├── generate-project.js     # Gerador principal
│   ├── validate-files.js       # Validador de arquivos
│   └── deploy-vercel.js        # Deploy automático
├── input/                       # Pasta para arquivos de entrada
│   ├── orcamento.xlsx          # Planilha de orçamento
│   ├── modelo-3d.glb           # Modelo 3D
│   ├── plantas/                # Plantas arquitetônicas
│   └── relatorios/             # Relatórios técnicos
└── output/                      # Projetos gerados
    └── [nome-do-projeto]/      # Novo projeto criado
```

## 🚀 Como Usar

### 1. Preparar Arquivos do Projeto

Coloque os arquivos na pasta `input/`:

```
input/
├── orcamento.xlsx              # Planilha SINAPI
├── modelo-arquitetura.glb      # Modelo 3D arquitetônico
├── modelo-estrutural.glb       # Modelo 3D estrutural
├── plantas/
│   ├── pavimento-terreo.jpg
│   ├── pavimento-superior.jpg
│   └── cortes.jpg
└── relatorios/
    ├── memoria-calculada.pdf
    └── especificacoes.pdf
```

### 2. Configurar o Projeto

Edite `config/project-config.json`:

```json
{
  "project": {
    "name": "Vila Andriw",
    "description": "Projeto residencial 10 apartamentos",
    "location": "São Paulo, SP",
    "area": 1200,
    "floors": 2,
    "apartments": 10
  },
  "budget": {
    "currency": "BRL",
    "baseYear": 2024,
    "source": "SINAPI"
  },
  "models": {
    "architecture": "modelo-arquitetura.glb",
    "structural": "modelo-estrutural.glb"
  },
  "deployment": {
    "vercel": true,
    "domain": "vila-andriw.vercel.app"
  }
}
```

### 3. Gerar o Projeto

```bash
# Instalar dependências
npm install

# Gerar novo projeto
npm run generate -- --name "Vila Andriw" --input ./input

# Ou usar interface web
npm run web-interface
```

### 4. Deploy Automático

```bash
# Deploy para Vercel
npm run deploy -- --project "vila-andriw"

# Ou deploy manual
cd output/vila-andriw
vercel --prod
```

## 🎯 Funcionalidades

### ✅ Geração Automática
- **Dashboard Arquitetura** com dados do orçamento
- **Dashboard Estrutural** com modelo 3D
- **Configurações personalizadas** por projeto
- **Deploy automático** para Vercel

### ✅ Validação de Arquivos
- **Planilha Excel** com estrutura SINAPI
- **Modelos GLB** com metadados
- **Imagens** em formatos suportados
- **Relatórios** em PDF

### ✅ Personalização
- **Cores e temas** por projeto
- **Logos e branding**
- **Configurações específicas**
- **Mapeamentos customizados**

## 📋 Checklist de Arquivos

### Obrigatórios
- [ ] `orcamento.xlsx` - Planilha de orçamento SINAPI
- [ ] `modelo-arquitetura.glb` - Modelo 3D arquitetônico
- [ ] `modelo-estrutural.glb` - Modelo 3D estrutural

### Opcionais
- [ ] `plantas/` - Plantas arquitetônicas (JPG/PNG)
- [ ] `relatorios/` - Relatórios técnicos (PDF)
- [ ] `logo.png` - Logo do projeto
- [ ] `config.json` - Configurações específicas

## 🔧 Configurações Avançadas

### Mapeamento de Orçamento
Edite `config/budget-mappings.json` para personalizar:

```json
{
  "estrutura": {
    "pilares": "103355",
    "vigas": "87905",
    "lajes": "87703"
  },
  "alvenaria": {
    "paredes_externas": "103355",
    "paredes_internas": "103355"
  },
  "revestimentos": {
    "pisos": "87263",
    "azulejos": "87264"
  }
}
```

### Temas Personalizados
```json
{
  "theme": {
    "primary": "#2563eb",
    "secondary": "#64748b",
    "accent": "#f59e0b",
    "background": "#f8fafc"
  }
}
```

## 🚀 Exemplos de Uso

### Projeto Residencial
```bash
npm run generate -- --name "Residencial Solar" --type "residential"
```

### Projeto Comercial
```bash
npm run generate -- --name "Shopping Center" --type "commercial"
```

### Projeto Industrial
```bash
npm run generate -- --name "Galpão Industrial" --type "industrial"
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os exemplos
3. Abra uma issue no repositório

---

**🎯 Objetivo**: Transformar qualquer projeto em dashboard profissional em minutos!
