#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { Command } = require('commander');

const program = new Command();

// Configuração do programa
program
  .name('deploy-vercel')
  .description('Deploy automático para Vercel')
  .version('1.0.0');

program
  .option('-p, --project <path>', 'Caminho do projeto')
  .option('-n, --name <name>', 'Nome do projeto no Vercel')
  .option('--architecture', 'Deploy apenas Dashboard Arquitetura')
  .option('--structural', 'Deploy apenas Dashboard Estrutural')
  .option('--both', 'Deploy ambos os dashboards')
  .option('--prod', 'Deploy para produção')
  .action(async (options) => {
    try {
      await deployToVercel(options);
    } catch (error) {
      console.error(chalk.red('❌ Erro no deploy:'), error.message);
      process.exit(1);
    }
  });

async function deployToVercel(options) {
  const spinner = ora('Iniciando deploy...').start();
  
  try {
    const projectPath = path.resolve(options.project || './output');
    
    if (!await fs.pathExists(projectPath)) {
      throw new Error(`Pasta do projeto não encontrada: ${projectPath}`);
    }
    
    // Determinar quais dashboards fazer deploy
    const dashboards = [];
    
    if (options.architecture) {
      dashboards.push('dashboard-arquitetura');
    } else if (options.structural) {
      dashboards.push('dashboard-estrutural');
    } else if (options.both) {
      dashboards.push('dashboard-arquitetura', 'dashboard-estrutural');
    } else {
      // Deploy automático baseado no que existe
      if (await fs.pathExists(path.join(projectPath, 'dashboard-arquitetura'))) {
        dashboards.push('dashboard-arquitetura');
      }
      if (await fs.pathExists(path.join(projectPath, 'dashboard-estrutural'))) {
        dashboards.push('dashboard-estrutural');
      }
    }
    
    if (dashboards.length === 0) {
      throw new Error('Nenhum dashboard encontrado para deploy');
    }
    
    // Ler configuração do projeto
    const configPath = path.join(projectPath, 'project-config.json');
    let projectConfig = {};
    
    if (await fs.pathExists(configPath)) {
      projectConfig = await fs.readJSON(configPath);
    }
    
    const projectName = options.name || projectConfig.project?.name || 'dashboard-project';
    const projectSlug = slugify(projectName);
    
    // Fazer deploy de cada dashboard
    for (const dashboard of dashboards) {
      await deployDashboard(projectPath, dashboard, projectSlug, options.prod);
    }
    
    spinner.succeed(chalk.green('✅ Deploy concluído com sucesso!'));
    
    // Mostrar URLs
    showDeployResults(dashboards, projectSlug);
    
  } catch (error) {
    spinner.fail(chalk.red('❌ Erro no deploy:'));
    throw error;
  }
}

async function deployDashboard(projectPath, dashboard, projectSlug, isProd) {
  const dashboardPath = path.join(projectPath, dashboard);
  
  if (!await fs.pathExists(dashboardPath)) {
    throw new Error(`Dashboard não encontrado: ${dashboard}`);
  }
  
  const spinner = ora(`Fazendo deploy do ${dashboard}...`).start();
  
  try {
    // Verificar se é um projeto Vite válido
    const packageJsonPath = path.join(dashboardPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      throw new Error(`package.json não encontrado em ${dashboard}`);
    }
    
    const packageJson = await fs.readJSON(packageJsonPath);
    
    // Instalar dependências se necessário
    if (!await fs.pathExists(path.join(dashboardPath, 'node_modules'))) {
      spinner.text = `Instalando dependências do ${dashboard}...`;
      execSync('npm install', {
        cwd: dashboardPath,
        stdio: 'inherit'
      });
    }
    
    // Build do projeto
    spinner.text = `Fazendo build do ${dashboard}...`;
    execSync('npm run build', {
      cwd: dashboardPath,
      stdio: 'inherit'
    });
    
    // Deploy para Vercel
    spinner.text = `Deployando ${dashboard} para Vercel...`;
    
    const deployCommand = isProd ? 'vercel --prod' : 'vercel';
    const deployOutput = execSync(deployCommand, {
      cwd: dashboardPath,
      encoding: 'utf8'
    });
    
    // Extrair URL do deploy
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
    const deployUrl = urlMatch ? urlMatch[0] : null;
    
    // Salvar informações do deploy
    const deployInfo = {
      dashboard,
      url: deployUrl,
      deployedAt: new Date().toISOString(),
      production: isProd
    };
    
    const deployInfoPath = path.join(dashboardPath, 'deploy-info.json');
    await fs.writeJSON(deployInfoPath, deployInfo, { spaces: 2 });
    
    spinner.succeed(chalk.green(`✅ ${dashboard} deployado com sucesso!`));
    
    if (deployUrl) {
      console.log(chalk.cyan(`   URL: ${deployUrl}`));
    }
    
  } catch (error) {
    spinner.fail(chalk.red(`❌ Erro no deploy do ${dashboard}:`));
    throw error;
  }
}

function showDeployResults(dashboards, projectSlug) {
  console.log('\n' + chalk.blue('🚀 Deploy Concluído'));
  console.log(chalk.gray('─'.repeat(50)));
  
  dashboards.forEach(dashboard => {
    const dashboardName = dashboard.replace('dashboard-', '');
    const url = `https://${projectSlug}-${dashboardName}.vercel.app`;
    
    console.log(chalk.green(`✅ ${dashboard}:`));
    console.log(chalk.cyan(`   ${url}`));
  });
  
  console.log('\n' + chalk.blue('📋 Próximos passos:'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.green('1. Acesse os dashboards pelos links acima'));
  console.log(chalk.green('2. Teste todas as funcionalidades'));
  console.log(chalk.green('3. Configure domínio personalizado se necessário'));
  console.log(chalk.green('4. Monitore performance e erros'));
  
  console.log('\n' + chalk.yellow('💡 Dicas:'));
  console.log(chalk.gray('• Use vercel --prod para deploy em produção'));
  console.log(chalk.gray('• Configure variáveis de ambiente se necessário'));
  console.log(chalk.gray('• Monitore logs no painel do Vercel'));
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

module.exports = { deployToVercel };
