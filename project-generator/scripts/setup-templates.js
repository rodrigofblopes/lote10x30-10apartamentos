#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

async function setupTemplates() {
  const spinner = ora('Configurando templates...').start();
  
  try {
    const templatesPath = path.join(__dirname, '../templates');
    await fs.ensureDir(templatesPath);
    
    // Criar estrutura de templates
    await createTemplateStructure(templatesPath);
    
    // Copiar templates dos projetos existentes
    await copyExistingTemplates(templatesPath);
    
    // Criar arquivos de configuração
    await createTemplateConfigs(templatesPath);
    
    spinner.succeed(chalk.green('✅ Templates configurados com sucesso!'));
    
    console.log(chalk.blue('\n📁 Estrutura criada:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.cyan('templates/'));
    console.log(chalk.cyan('├── dashboard-arquitetura/'));
    console.log(chalk.cyan('├── dashboard-estrutural/'));
    console.log(chalk.cyan('└── shared/'));
    
  } catch (error) {
    spinner.fail(chalk.red('❌ Erro ao configurar templates:'));
    console.error(error);
    process.exit(1);
  }
}

async function createTemplateStructure(templatesPath) {
  const folders = [
    'dashboard-arquitetura',
    'dashboard-estrutural',
    'shared'
  ];
  
  for (const folder of folders) {
    await fs.ensureDir(path.join(templatesPath, folder));
  }
}

async function copyExistingTemplates(templatesPath) {
  const sourcePaths = {
    'dashboard-arquitetura': path.join(__dirname, '../../DashBoardArquitetura/dashboard-react'),
    'dashboard-estrutural': path.join(__dirname, '../../DashboardEstrutural')
  };
  
  for (const [templateName, sourcePath] of Object.entries(sourcePaths)) {
    if (await fs.pathExists(sourcePath)) {
      const targetPath = path.join(templatesPath, templateName);
      
      // Copiar arquivos, excluindo node_modules e dist
      await fs.copy(sourcePath, targetPath, {
        filter: (src) => {
          const relativePath = path.relative(sourcePath, src);
          return !relativePath.startsWith('node_modules') && 
                 !relativePath.startsWith('dist') &&
                 !relativePath.startsWith('.git');
        }
      });
      
      console.log(chalk.green(`✅ Template ${templateName} copiado`));
    } else {
      console.log(chalk.yellow(`⚠️  Pasta não encontrada: ${sourcePath}`));
    }
  }
}

async function createTemplateConfigs(templatesPath) {
  // Configuração do template arquitetura
  const archConfig = {
    name: 'dashboard-arquitetura',
    description: 'Template para Dashboard Arquitetura',
    version: '1.0.0',
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'typescript': '^5.0.0',
      'vite': '^4.4.0',
      'tailwindcss': '^3.3.0',
      'lucide-react': '^0.263.1',
      'zustand': '^4.4.1',
      'three': '^0.155.0',
      '@react-three/fiber': '^8.15.12',
      '@react-three/drei': '^9.88.13',
      '@types/three': '^0.155.0'
    },
    files: {
      required: [
        'package.json',
        'vite.config.js',
        'tailwind.config.js',
        'tsconfig.json',
        'src/App.tsx',
        'src/main.tsx',
        'src/index.css'
      ],
      optional: [
        'public/modelo-arquitetura.glb',
        'public/plantas/',
        'vercel.json'
      ]
    },
    placeholders: {
      '{{PROJECT_NAME}}': 'Nome do projeto',
      '{{PROJECT_DESCRIPTION}}': 'Descrição do projeto',
      '{{PROJECT_SLUG}}': 'Slug do projeto',
      '{{MODEL_FILE}}': 'Arquivo do modelo 3D'
    }
  };
  
  // Configuração do template estrutural
  const structConfig = {
    name: 'dashboard-estrutural',
    description: 'Template para Dashboard Estrutural',
    version: '1.0.0',
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'typescript': '^5.0.0',
      'vite': '^4.4.0',
      'tailwindcss': '^3.3.0',
      'lucide-react': '^0.263.1',
      'zustand': '^4.4.1',
      'three': '^0.155.0',
      '@react-three/fiber': '^8.15.12',
      '@react-three/drei': '^9.88.13',
      '@types/three': '^0.155.0'
    },
    files: {
      required: [
        'package.json',
        'vite.config.ts',
        'tailwind.config.js',
        'tsconfig.json',
        'src/App.tsx',
        'src/main.tsx',
        'src/index.css'
      ],
      optional: [
        'public/modelo-estrutural.glb',
        'public/wasm/',
        'vercel.json'
      ]
    },
    placeholders: {
      '{{PROJECT_NAME}}': 'Nome do projeto',
      '{{PROJECT_DESCRIPTION}}': 'Descrição do projeto',
      '{{PROJECT_SLUG}}': 'Slug do projeto',
      '{{MODEL_FILE}}': 'Arquivo do modelo 3D'
    }
  };
  
  // Salvar configurações
  await fs.writeJSON(
    path.join(templatesPath, 'dashboard-arquitetura', 'template-config.json'),
    archConfig,
    { spaces: 2 }
  );
  
  await fs.writeJSON(
    path.join(templatesPath, 'dashboard-estrutural', 'template-config.json'),
    structConfig,
    { spaces: 2 }
  );
  
  // Criar arquivo de configuração geral
  const generalConfig = {
    version: '1.0.0',
    templates: {
      'dashboard-arquitetura': {
        name: 'Dashboard Arquitetura',
        description: 'Template para visualização arquitetônica',
        path: 'dashboard-arquitetura/',
        type: 'architecture'
      },
      'dashboard-estrutural': {
        name: 'Dashboard Estrutural',
        description: 'Template para visualização estrutural',
        path: 'dashboard-estrutural/',
        type: 'structural'
      }
    },
    shared: {
      path: 'shared/',
      files: [
        'orcamento.xlsx',
        'logo.png',
        'config.json'
      ]
    }
  };
  
  await fs.writeJSON(
    path.join(templatesPath, 'templates-config.json'),
    generalConfig,
    { spaces: 2 }
  );
}

// Executar se chamado diretamente
if (require.main === module) {
  setupTemplates();
}

module.exports = { setupTemplates };
