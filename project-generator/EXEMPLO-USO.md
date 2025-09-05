# 🎯 Exemplo de Uso - Gerador de Dashboards

Este guia mostra como usar o sistema de templates para criar novos dashboards automaticamente.

## 📋 Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **Vercel CLI** instalado globalmente
3. **Arquivos do projeto** organizados

## 🚀 Exemplo Prático: Projeto "Residencial Solar"

### 1. Preparar Arquivos

Crie a pasta `input/` e organize os arquivos:

```
input/
├── orcamento.xlsx              # Planilha SINAPI
├── modelo-arquitetura.glb      # Modelo 3D arquitetônico
├── modelo-estrutural.glb       # Modelo 3D estrutural
├── plantas/
│   ├── pavimento-terreo.jpg
│   ├── pavimento-superior.jpg
│   └── cortes.jpg
├── relatorios/
│   ├── memoria-calculada.pdf
│   └── especificacoes.pdf
└── logo.png                    # Logo do projeto
```

### 2. Configurar o Projeto

Edite `config/project-config.json`:

```json
{
  "project": {
    "name": "Residencial Solar",
    "description": "Projeto residencial sustentável com 8 apartamentos",
    "location": "Brasília, DF",
    "area": 800,
    "floors": 3,
    "apartments": 8,
    "type": "residential"
  },
  "budget": {
    "currency": "BRL",
    "baseYear": 2024,
    "source": "SINAPI"
  },
  "theme": {
    "primary": "#059669",
    "secondary": "#6b7280",
    "accent": "#f59e0b",
    "background": "#f0fdf4"
  }
}
```

### 3. Gerar o Projeto

#### Opção A: Interface Web
```bash
# Instalar dependências
npm install

# Iniciar interface web
npm run web-interface

# Acesse http://localhost:3000
```

#### Opção B: Linha de Comando
```bash
# Gerar projeto
npm run generate -- --name "Residencial Solar" --input ./input

# Ou com mais opções
npm run generate -- \
  --name "Residencial Solar" \
  --input ./input \
  --output ./output \
  --type residential \
  --auto-deploy
```

### 4. Validação Automática

O sistema valida automaticamente:

- ✅ **Planilha Excel** com estrutura SINAPI
- ✅ **Modelos GLB** com metadados
- ✅ **Imagens** em formatos suportados
- ✅ **Relatórios** em PDF

### 5. Deploy Automático

```bash
# Deploy para Vercel
npm run deploy -- --project ./output/residencial-solar

# Ou deploy específico
npm run deploy -- \
  --project ./output/residencial-solar \
  --architecture \
  --prod
```

## 📊 Resultado Final

Após a geração, você terá:

```
output/residencial-solar/
├── dashboard-arquitetura/      # Dashboard Arquitetura
│   ├── src/
│   ├── public/
│   │   ├── modelo-arquitetura.glb
│   │   └── plantas/
│   ├── package.json
│   └── vercel.json
├── dashboard-estrutural/       # Dashboard Estrutural
│   ├── src/
│   ├── public/
│   │   └── modelo-estrutural.glb
│   ├── package.json
│   └── vercel.json
├── shared/                     # Arquivos compartilhados
│   ├── orcamento.xlsx
│   └── logo.png
├── docs/                       # Documentação
│   └── relatorios/
└── project-config.json         # Configuração do projeto
```

## 🌐 URLs dos Dashboards

- **Dashboard Arquitetura**: `https://residencial-solar-arquitetura.vercel.app`
- **Dashboard Estrutural**: `https://residencial-solar-estrutural.vercel.app`

## 🔧 Personalização Avançada

### Temas Personalizados

```json
{
  "theme": {
    "primary": "#059669",      # Verde sustentável
    "secondary": "#6b7280",    # Cinza neutro
    "accent": "#f59e0b",       # Amarelo energia solar
    "background": "#f0fdf4",   # Verde claro
    "text": "#1f2937"          # Cinza escuro
  }
}
```

### Mapeamento de Orçamento

```json
{
  "estrutura": {
    "pilares": {
      "code": "103355",
      "description": "ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS",
      "keywords": ["pilar", "coluna", "estrutura"]
    }
  },
  "sustentabilidade": {
    "painel_solar": {
      "code": "999999",
      "description": "PAINEL SOLAR FOTOVOLTAICO",
      "keywords": ["solar", "energia", "sustentável"]
    }
  }
}
```

## 📱 Funcionalidades Incluídas

### Dashboard Arquitetura
- ✅ **Visualização 3D** do modelo arquitetônico
- ✅ **Análise de Orçamento** com comparação SINAPI vs Real
- ✅ **Plantas Arquitetônicas** integradas
- ✅ **Relatórios Técnicos** em PDF
- ✅ **Tema Personalizado** por projeto

### Dashboard Estrutural
- ✅ **Visualização 3D** do modelo estrutural
- ✅ **Análise Estrutural** com cálculos
- ✅ **Integração 5D** (3D + Orçamento)
- ✅ **Lincagem Blender** para elementos
- ✅ **Validação Automática** de links

## 🚀 Comandos Úteis

```bash
# Validar arquivos
npm run validate -- ./input

# Configurar templates
npm run setup

# Deploy específico
npm run deploy -- --architecture --prod

# Interface web
npm run web-interface

# Testar gerador
npm run test
```

## 🎯 Casos de Uso

### 1. Projeto Residencial
```bash
npm run generate -- --name "Condomínio Verde" --type residential
```

### 2. Projeto Comercial
```bash
npm run generate -- --name "Shopping Center" --type commercial
```

### 3. Projeto Industrial
```bash
npm run generate -- --name "Galpão Industrial" --type industrial
```

### 4. Projeto Institucional
```bash
npm run generate -- --name "Escola Municipal" --type institutional
```

## 🔍 Troubleshooting

### Problemas Comuns

1. **Arquivo GLB muito grande**
   - Solução: Otimize no Blender antes de exportar

2. **Planilha sem estrutura SINAPI**
   - Solução: Verifique colunas obrigatórias

3. **Erro no deploy**
   - Solução: Verifique se Vercel CLI está instalado

4. **Modelo 3D não carrega**
   - Solução: Verifique se GLB tem metadados

### Logs e Debug

```bash
# Ver logs detalhados
DEBUG=* npm run generate

# Validar arquivos específicos
npm run validate -- ./input --verbose

# Testar deploy local
npm run deploy -- --project ./output/teste --dry-run
```

## 📞 Suporte

Para dúvidas ou problemas:

1. **Verifique a documentação** completa
2. **Consulte os exemplos** fornecidos
3. **Abra uma issue** no repositório
4. **Entre em contato** com a equipe

---

**🎯 Objetivo**: Transformar qualquer projeto em dashboard profissional em minutos!

**⚡ Resultado**: Dashboards prontos para produção com todas as funcionalidades implementadas.
