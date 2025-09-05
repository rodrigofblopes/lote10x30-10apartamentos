#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { Command } = require('commander');

const program = new Command();

// Configuração do programa
program
  .name('generate-project')
  .description('Gerador automático de dashboards para projetos arquitetônicos')
  .version('1.0.0');

program
  .option('-n, --name <name>', 'Nome do projeto')
  .option('-i, --input <path>', 'Pasta com arquivos de entrada', './input')
  .option('-o, --output <path>', 'Pasta de saída', './output')
  .option('-t, --type <type>', 'Tipo de projeto (residential|commercial|industrial)', 'residential')
  .option('--skip-validation', 'Pular validação de arquivos')
  .option('--auto-deploy', 'Deploy automático para Vercel')
  .action(async (options) => {
    try {
      await generateProject(options);
    } catch (error) {
      console.error(chalk.red('❌ Erro ao gerar projeto:'), error.message);
      process.exit(1);
    }
  });

async function generateProject(options) {
  const spinner = ora('Iniciando geração do projeto...').start();
  
  try {
    // 1. Validar entrada
    spinner.text = 'Validando arquivos de entrada...';
    const inputPath = path.resolve(options.input);
    const outputPath = path.resolve(options.output);
    
    if (!await fs.pathExists(inputPath)) {
      throw new Error(`Pasta de entrada não encontrada: ${inputPath}`);
    }
    
    // 2. Coletar informações do projeto
    spinner.stop();
    const projectInfo = await collectProjectInfo(options);
    spinner.start('Processando informações do projeto...');
    
    // 3. Validar arquivos (se não pulado)
    if (!options.skipValidation) {
      spinner.text = 'Validando arquivos...';
      await validateInputFiles(inputPath);
    }
    
    // 4. Criar estrutura do projeto
    spinner.text = 'Criando estrutura do projeto...';
    const projectPath = path.join(outputPath, projectInfo.slug);
    await createProjectStructure(projectPath, projectInfo);
    
    // 5. Copiar e processar arquivos
    spinner.text = 'Processando arquivos...';
    await processProjectFiles(inputPath, projectPath, projectInfo);
    
    // 6. Configurar dashboards
    spinner.text = 'Configurando dashboards...';
    await configureDashboards(projectPath, projectInfo);
    
    // 7. Instalar dependências
    spinner.text = 'Instalando dependências...';
    await installDependencies(projectPath);
    
    // 8. Deploy (se solicitado)
    if (options.autoDeploy) {
      spinner.text = 'Fazendo deploy para Vercel...';
      await deployToVercel(projectPath, projectInfo);
    }
    
    spinner.succeed(chalk.green(`✅ Projeto "${projectInfo.name}" gerado com sucesso!`));
    
    // 9. Mostrar próximos passos
    showNextSteps(projectPath, projectInfo, options.autoDeploy);
    
  } catch (error) {
    spinner.fail(chalk.red('❌ Erro na geração:'));
    throw error;
  }
}

async function collectProjectInfo(options) {
  const questions = [];
  
  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'Nome do projeto:',
      validate: (input) => input.length > 0 || 'Nome é obrigatório'
    });
  }
  
  questions.push(
    {
      type: 'input',
      name: 'description',
      message: 'Descrição do projeto:',
      default: 'Projeto arquitetônico gerado automaticamente'
    },
    {
      type: 'input',
      name: 'location',
      message: 'Localização:',
      default: 'São Paulo, SP'
    },
    {
      type: 'number',
      name: 'area',
      message: 'Área total (m²):',
      default: 1000
    },
    {
      type: 'number',
      name: 'floors',
      message: 'Número de pavimentos:',
      default: 2
    },
    {
      type: 'list',
      name: 'type',
      message: 'Tipo de projeto:',
      choices: [
        { name: 'Residencial', value: 'residential' },
        { name: 'Comercial', value: 'commercial' },
        { name: 'Industrial', value: 'industrial' },
        { name: 'Institucional', value: 'institutional' }
      ],
      default: options.type
    }
  );
  
  const answers = await inquirer.prompt(questions);
  
  return {
    name: options.name || answers.name,
    description: answers.description,
    location: answers.location,
    area: answers.area,
    floors: answers.floors,
    type: answers.type,
    slug: slugify(options.name || answers.name),
    createdAt: new Date().toISOString()
  };
}

async function validateInputFiles(inputPath) {
  const requiredFiles = [
    'orcamento.xlsx',
    'modelo-arquitetura.glb',
    'modelo-estrutural.glb'
  ];
  
  const missingFiles = [];
  
  for (const file of requiredFiles) {
    const filePath = path.join(inputPath, file);
    if (!await fs.pathExists(filePath)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    throw new Error(`Arquivos obrigatórios não encontrados: ${missingFiles.join(', ')}`);
  }
  
  // Validar estrutura da planilha
  await validateBudgetFile(path.join(inputPath, 'orcamento.xlsx'));
  
  // Validar modelos GLB
  await validateGLBFile(path.join(inputPath, 'modelo-arquitetura.glb'));
  await validateGLBFile(path.join(inputPath, 'modelo-estrutural.glb'));
}

async function validateBudgetFile(filePath) {
  const XLSX = require('xlsx');
  
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      throw new Error('Planilha de orçamento está vazia');
    }
    
    // Verificar colunas obrigatórias
    const requiredColumns = ['codigo', 'descricao', 'unidade', 'quantidade', 'preco_unitario'];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      throw new Error(`Colunas obrigatórias não encontradas: ${missingColumns.join(', ')}`);
    }
    
  } catch (error) {
    throw new Error(`Erro ao validar planilha: ${error.message}`);
  }
}

async function validateGLBFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    
    if (stats.size === 0) {
      throw new Error('Arquivo GLB está vazio');
    }
    
    if (stats.size > 100 * 1024 * 1024) { // 100MB
      console.warn(chalk.yellow(`⚠️  Arquivo GLB muito grande: ${(stats.size / 1024 / 1024).toFixed(1)}MB`));
    }
    
  } catch (error) {
    throw new Error(`Erro ao validar GLB: ${error.message}`);
  }
}

async function createProjectStructure(projectPath, projectInfo) {
  // Criar pasta principal
  await fs.ensureDir(projectPath);
  
  // Criar estrutura de pastas
  const folders = [
    'dashboard-arquitetura',
    'dashboard-estrutural',
    'shared',
    'docs',
    'assets'
  ];
  
  for (const folder of folders) {
    await fs.ensureDir(path.join(projectPath, folder));
  }
  
  // Criar arquivo de configuração
  const config = {
    project: projectInfo,
    generated: new Date().toISOString(),
    version: '1.0.0'
  };
  
  await fs.writeJSON(path.join(projectPath, 'project-config.json'), config, { spaces: 2 });
}

async function processProjectFiles(inputPath, projectPath, projectInfo) {
  // Copiar planilha de orçamento
  await fs.copy(
    path.join(inputPath, 'orcamento.xlsx'),
    path.join(projectPath, 'shared', 'orcamento.xlsx')
  );
  
  // Copiar modelos 3D
  await fs.copy(
    path.join(inputPath, 'modelo-arquitetura.glb'),
    path.join(projectPath, 'dashboard-arquitetura', 'public', 'modelo-arquitetura.glb')
  );
  
  await fs.copy(
    path.join(inputPath, 'modelo-estrutural.glb'),
    path.join(projectPath, 'dashboard-estrutural', 'public', 'modelo-estrutural.glb')
  );
  
  // Copiar plantas (se existirem)
  const plantasPath = path.join(inputPath, 'plantas');
  if (await fs.pathExists(plantasPath)) {
    await fs.copy(plantasPath, path.join(projectPath, 'dashboard-arquitetura', 'public', 'plantas'));
  }
  
  // Copiar relatórios (se existirem)
  const relatoriosPath = path.join(inputPath, 'relatorios');
  if (await fs.pathExists(relatoriosPath)) {
    await fs.copy(relatoriosPath, path.join(projectPath, 'docs', 'relatorios'));
  }
  
  // Copiar logo (se existir)
  const logoPath = path.join(inputPath, 'logo.png');
  if (await fs.pathExists(logoPath)) {
    await fs.copy(logoPath, path.join(projectPath, 'shared', 'logo.png'));
  }
}

async function configureDashboards(projectPath, projectInfo) {
  // Configurar Dashboard Arquitetura
  await configureArchitectureDashboard(projectPath, projectInfo);
  
  // Configurar Dashboard Estrutural
  await configureStructuralDashboard(projectPath, projectInfo);
}

async function configureArchitectureDashboard(projectPath, projectInfo) {
  const dashboardPath = path.join(projectPath, 'dashboard-arquitetura');
  
  // Copiar template
  await fs.copy(
    path.join(__dirname, '../templates/dashboard-arquitetura'),
    dashboardPath
  );
  
  // Atualizar package.json
  const packageJson = await fs.readJSON(path.join(dashboardPath, 'package.json'));
  packageJson.name = `${projectInfo.slug}-arquitetura`;
  packageJson.description = `Dashboard Arquitetura - ${projectInfo.name}`;
  await fs.writeJSON(path.join(dashboardPath, 'package.json'), packageJson, { spaces: 2 });
  
  // Atualizar configuração do Vercel
  const vercelConfig = {
    name: `${projectInfo.slug}-arquitetura`,
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    framework: 'vite',
    rewrites: [
      { source: '/(.*)', destination: '/index.html' }
    ]
  };
  
  await fs.writeJSON(path.join(dashboardPath, 'vercel.json'), vercelConfig, { spaces: 2 });
}

async function configureStructuralDashboard(projectPath, projectInfo) {
  const dashboardPath = path.join(projectPath, 'dashboard-estrutural');
  
  // Copiar template
  await fs.copy(
    path.join(__dirname, '../templates/dashboard-estrutural'),
    dashboardPath
  );
  
  // Atualizar package.json
  const packageJson = await fs.readJSON(path.join(dashboardPath, 'package.json'));
  packageJson.name = `${projectInfo.slug}-estrutural`;
  packageJson.description = `Dashboard Estrutural - ${projectInfo.name}`;
  await fs.writeJSON(path.join(dashboardPath, 'package.json'), packageJson, { spaces: 2 });
  
  // Atualizar configuração do Vercel
  const vercelConfig = {
    name: `${projectInfo.slug}-estrutural`,
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    framework: 'vite',
    rewrites: [
      { source: '/(.*)', destination: '/index.html' }
    ]
  };
  
  await fs.writeJSON(path.join(dashboardPath, 'vercel.json'), vercelConfig, { spaces: 2 });
}

async function installDependencies(projectPath) {
  const { execSync } = require('child_process');
  
  // Instalar dependências do Dashboard Arquitetura
  execSync('npm install', {
    cwd: path.join(projectPath, 'dashboard-arquitetura'),
    stdio: 'inherit'
  });
  
  // Instalar dependências do Dashboard Estrutural
  execSync('npm install', {
    cwd: path.join(projectPath, 'dashboard-estrutural'),
    stdio: 'inherit'
  });
}

async function deployToVercel(projectPath, projectInfo) {
  const { execSync } = require('child_process');
  
  // Deploy Dashboard Arquitetura
  execSync('vercel --prod', {
    cwd: path.join(projectPath, 'dashboard-arquitetura'),
    stdio: 'inherit'
  });
  
  // Deploy Dashboard Estrutural
  execSync('vercel --prod', {
    cwd: path.join(projectPath, 'dashboard-estrutural'),
    stdio: 'inherit'
  });
}

function showNextSteps(projectPath, projectInfo, autoDeploy) {
  console.log('\n' + chalk.blue('📋 Próximos passos:'));
  console.log(chalk.gray('─'.repeat(50)));
  
  console.log(chalk.green('1. Projeto criado em:'), chalk.cyan(projectPath));
  
  if (!autoDeploy) {
    console.log(chalk.green('2. Para fazer deploy:'));
    console.log(chalk.cyan(`   cd ${projectPath}/dashboard-arquitetura && vercel --prod`));
    console.log(chalk.cyan(`   cd ${projectPath}/dashboard-estrutural && vercel --prod`));
  }
  
  console.log(chalk.green('3. Para desenvolvimento local:'));
  console.log(chalk.cyan(`   cd ${projectPath}/dashboard-arquitetura && npm run dev`));
  console.log(chalk.cyan(`   cd ${projectPath}/dashboard-estrutural && npm run dev`));
  
  console.log(chalk.green('4. URLs dos dashboards:'));
  console.log(chalk.cyan(`   Arquitetura: https://${projectInfo.slug}-arquitetura.vercel.app`));
  console.log(chalk.cyan(`   Estrutural: https://${projectInfo.slug}-estrutural.vercel.app`));
  
  console.log('\n' + chalk.green('✅ Projeto pronto para uso!'));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Executar se chamado diretamente
if (require.main === module) {
  program.parse();
}

module.exports = { generateProject };
