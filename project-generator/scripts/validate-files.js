#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const XLSX = require('xlsx');

async function validateFiles(inputPath) {
  const spinner = ora('Validando arquivos...').start();
  
  try {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      files: {}
    };
    
    // Verificar se a pasta de entrada existe
    if (!await fs.pathExists(inputPath)) {
      throw new Error(`Pasta de entrada não encontrada: ${inputPath}`);
    }
    
    // Validar arquivos obrigatórios
    await validateRequiredFiles(inputPath, validation);
    
    // Validar arquivos opcionais
    await validateOptionalFiles(inputPath, validation);
    
    // Validar estrutura da planilha
    await validateBudgetStructure(inputPath, validation);
    
    // Validar modelos 3D
    await validate3DModels(inputPath, validation);
    
    // Mostrar resultados
    spinner.stop();
    showValidationResults(validation);
    
    return validation;
    
  } catch (error) {
    spinner.fail(chalk.red('❌ Erro na validação:'));
    console.error(error.message);
    process.exit(1);
  }
}

async function validateRequiredFiles(inputPath, validation) {
  const requiredFiles = [
    {
      name: 'orcamento.xlsx',
      description: 'Planilha de orçamento SINAPI',
      validator: validateBudgetFile
    },
    {
      name: 'modelo-arquitetura.glb',
      description: 'Modelo 3D arquitetônico',
      validator: validateGLBFile
    },
    {
      name: 'modelo-estrutural.glb',
      description: 'Modelo 3D estrutural',
      validator: validateGLBFile
    }
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(inputPath, file.name);
    const exists = await fs.pathExists(filePath);
    
    validation.files[file.name] = {
      exists,
      path: filePath,
      description: file.description,
      valid: false,
      errors: []
    };
    
    if (!exists) {
      validation.valid = false;
      validation.errors.push(`Arquivo obrigatório não encontrado: ${file.name}`);
      validation.files[file.name].errors.push('Arquivo não encontrado');
    } else {
      try {
        await file.validator(filePath, validation.files[file.name]);
        validation.files[file.name].valid = true;
      } catch (error) {
        validation.valid = false;
        validation.errors.push(`Erro em ${file.name}: ${error.message}`);
        validation.files[file.name].errors.push(error.message);
      }
    }
  }
}

async function validateOptionalFiles(inputPath, validation) {
  const optionalFiles = [
    {
      name: 'plantas',
      description: 'Plantas arquitetônicas',
      validator: validateImagesFolder
    },
    {
      name: 'relatorios',
      description: 'Relatórios técnicos',
      validator: validatePDFsFolder
    },
    {
      name: 'logo.png',
      description: 'Logo do projeto',
      validator: validateImageFile
    }
  ];
  
  for (const file of optionalFiles) {
    const filePath = path.join(inputPath, file.name);
    const exists = await fs.pathExists(filePath);
    
    validation.files[file.name] = {
      exists,
      path: filePath,
      description: file.description,
      valid: false,
      errors: []
    };
    
    if (exists) {
      try {
        await file.validator(filePath, validation.files[file.name]);
        validation.files[file.name].valid = true;
      } catch (error) {
        validation.warnings.push(`Aviso em ${file.name}: ${error.message}`);
        validation.files[file.name].errors.push(error.message);
      }
    }
  }
}

async function validateBudgetFile(filePath, fileInfo) {
  try {
    const workbook = XLSX.readFile(filePath);
    
    if (workbook.SheetNames.length === 0) {
      throw new Error('Planilha não contém abas');
    }
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      throw new Error('Planilha está vazia');
    }
    
    // Verificar colunas obrigatórias
    const requiredColumns = [
      'codigo',
      'descricao',
      'unidade',
      'quantidade',
      'preco_unitario'
    ];
    
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      throw new Error(`Colunas obrigatórias não encontradas: ${missingColumns.join(', ')}`);
    }
    
    // Verificar se há dados válidos
    const validRows = data.filter(row => 
      row.codigo && 
      row.descricao && 
      row.quantidade > 0
    );
    
    if (validRows.length === 0) {
      throw new Error('Nenhuma linha válida encontrada');
    }
    
    fileInfo.rows = data.length;
    fileInfo.validRows = validRows.length;
    fileInfo.sheetName = sheetName;
    
  } catch (error) {
    throw new Error(`Erro ao validar planilha: ${error.message}`);
  }
}

async function validateGLBFile(filePath, fileInfo) {
  try {
    const stats = await fs.stat(filePath);
    
    if (stats.size === 0) {
      throw new Error('Arquivo GLB está vazio');
    }
    
    if (stats.size > 100 * 1024 * 1024) { // 100MB
      fileInfo.warnings = fileInfo.warnings || [];
      fileInfo.warnings.push(`Arquivo muito grande: ${(stats.size / 1024 / 1024).toFixed(1)}MB`);
    }
    
    // Verificar se é um arquivo GLB válido
    const buffer = await fs.readFile(filePath);
    const header = buffer.slice(0, 4);
    
    if (header.toString() !== 'glTF') {
      throw new Error('Arquivo não é um GLB válido');
    }
    
    fileInfo.size = stats.size;
    fileInfo.sizeFormatted = formatFileSize(stats.size);
    
  } catch (error) {
    throw new Error(`Erro ao validar GLB: ${error.message}`);
  }
}

async function validateImagesFolder(folderPath, fileInfo) {
  try {
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      throw new Error('Nenhuma imagem encontrada na pasta');
    }
    
    fileInfo.imageCount = imageFiles.length;
    fileInfo.images = imageFiles;
    
  } catch (error) {
    throw new Error(`Erro ao validar pasta de imagens: ${error.message}`);
  }
}

async function validatePDFsFolder(folderPath, fileInfo) {
  try {
    const files = await fs.readdir(folderPath);
    const pdfFiles = files.filter(file => 
      /\.pdf$/i.test(file)
    );
    
    if (pdfFiles.length === 0) {
      throw new Error('Nenhum PDF encontrado na pasta');
    }
    
    fileInfo.pdfCount = pdfFiles.length;
    fileInfo.pdfs = pdfFiles;
    
  } catch (error) {
    throw new Error(`Erro ao validar pasta de PDFs: ${error.message}`);
  }
}

async function validateImageFile(filePath, fileInfo) {
  try {
    const stats = await fs.stat(filePath);
    
    if (stats.size === 0) {
      throw new Error('Arquivo de imagem está vazio');
    }
    
    if (stats.size > 10 * 1024 * 1024) { // 10MB
      fileInfo.warnings = fileInfo.warnings || [];
      fileInfo.warnings.push(`Imagem muito grande: ${(stats.size / 1024 / 1024).toFixed(1)}MB`);
    }
    
    fileInfo.size = stats.size;
    fileInfo.sizeFormatted = formatFileSize(stats.size);
    
  } catch (error) {
    throw new Error(`Erro ao validar imagem: ${error.message}`);
  }
}

async function validateBudgetStructure(inputPath, validation) {
  const budgetPath = path.join(inputPath, 'orcamento.xlsx');
  
  if (!await fs.pathExists(budgetPath)) {
    return;
  }
  
  try {
    const workbook = XLSX.readFile(budgetPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Verificar estrutura SINAPI
    const sinapiStructure = {
      hasCodes: data.some(row => row.codigo && /^\d+\.\d+\.\d+$/.test(row.codigo)),
      hasDescriptions: data.some(row => row.descricao && row.descricao.length > 10),
      hasQuantities: data.some(row => row.quantidade && row.quantidade > 0),
      hasPrices: data.some(row => row.preco_unitario && row.preco_unitario > 0)
    };
    
    if (!sinapiStructure.hasCodes) {
      validation.warnings.push('Códigos SINAPI não encontrados ou em formato incorreto');
    }
    
    if (!sinapiStructure.hasDescriptions) {
      validation.warnings.push('Descrições dos itens muito curtas ou ausentes');
    }
    
    if (!sinapiStructure.hasQuantities) {
      validation.warnings.push('Quantidades não encontradas ou zeradas');
    }
    
    if (!sinapiStructure.hasPrices) {
      validation.warnings.push('Preços unitários não encontrados ou zerados');
    }
    
  } catch (error) {
    validation.warnings.push(`Erro ao validar estrutura SINAPI: ${error.message}`);
  }
}

async function validate3DModels(inputPath, validation) {
  const models = [
    'modelo-arquitetura.glb',
    'modelo-estrutural.glb'
  ];
  
  for (const model of models) {
    const modelPath = path.join(inputPath, model);
    
    if (await fs.pathExists(modelPath)) {
      try {
        const stats = await fs.stat(modelPath);
        
        if (stats.size < 1024) { // 1KB
          validation.warnings.push(`${model} muito pequeno, pode estar corrompido`);
        }
        
        if (stats.size > 200 * 1024 * 1024) { // 200MB
          validation.warnings.push(`${model} muito grande (${(stats.size / 1024 / 1024).toFixed(1)}MB), pode causar problemas de performance`);
        }
        
      } catch (error) {
        validation.warnings.push(`Erro ao validar ${model}: ${error.message}`);
      }
    }
  }
}

function showValidationResults(validation) {
  console.log('\n' + chalk.blue('📋 Resultados da Validação'));
  console.log(chalk.gray('─'.repeat(50)));
  
  if (validation.valid) {
    console.log(chalk.green('✅ Todos os arquivos obrigatórios estão válidos'));
  } else {
    console.log(chalk.red('❌ Problemas encontrados:'));
    validation.errors.forEach(error => {
      console.log(chalk.red(`  • ${error}`));
    });
  }
  
  if (validation.warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️  Avisos:'));
    validation.warnings.forEach(warning => {
      console.log(chalk.yellow(`  • ${warning}`));
    });
  }
  
  console.log(chalk.blue('\n📁 Arquivos Validados:'));
  Object.entries(validation.files).forEach(([name, info]) => {
    const status = info.valid ? chalk.green('✅') : chalk.red('❌');
    const exists = info.exists ? chalk.green('Existe') : chalk.red('Não existe');
    
    console.log(`  ${status} ${name} - ${exists}`);
    
    if (info.errors && info.errors.length > 0) {
      info.errors.forEach(error => {
        console.log(chalk.red(`    • ${error}`));
      });
    }
    
    if (info.warnings && info.warnings.length > 0) {
      info.warnings.forEach(warning => {
        console.log(chalk.yellow(`    • ${warning}`));
      });
    }
    
    if (info.rows) {
      console.log(chalk.gray(`    • ${info.rows} linhas, ${info.validRows} válidas`));
    }
    
    if (info.sizeFormatted) {
      console.log(chalk.gray(`    • Tamanho: ${info.sizeFormatted}`));
    }
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Executar se chamado diretamente
if (require.main === module) {
  const inputPath = process.argv[2] || './input';
  validateFiles(inputPath);
}

module.exports = { validateFiles };
