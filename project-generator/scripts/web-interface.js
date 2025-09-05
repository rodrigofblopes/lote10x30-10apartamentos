#!/usr/bin/env node

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { generateProject } = require('./generate-project');

const app = express();
const PORT = 3000;

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../input');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'model/gltf-binary', // .glb
      'image/jpeg', // .jpg
      'image/png', // .png
      'application/pdf' // .pdf
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'), false);
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota para upload de arquivos
app.post('/upload', upload.fields([
  { name: 'orcamento', maxCount: 1 },
  { name: 'modeloArquitetura', maxCount: 1 },
  { name: 'modeloEstrutural', maxCount: 1 },
  { name: 'plantas', maxCount: 10 },
  { name: 'relatorios', maxCount: 10 },
  { name: 'logo', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files;
    
    // Validar arquivos obrigatórios
    if (!files.orcamento || !files.modeloArquitetura || !files.modeloEstrutural) {
      return res.status(400).json({
        error: 'Arquivos obrigatórios não encontrados',
        required: ['orcamento.xlsx', 'modelo-arquitetura.glb', 'modelo-estrutural.glb']
      });
    }
    
    // Renomear arquivos para nomes padrão
    const inputPath = path.join(__dirname, '../input');
    
    // Orçamento
    await fs.move(
      files.orcamento[0].path,
      path.join(inputPath, 'orcamento.xlsx')
    );
    
    // Modelos 3D
    await fs.move(
      files.modeloArquitetura[0].path,
      path.join(inputPath, 'modelo-arquitetura.glb')
    );
    
    await fs.move(
      files.modeloEstrutural[0].path,
      path.join(inputPath, 'modelo-estrutural.glb')
    );
    
    // Plantas (se existirem)
    if (files.plantas) {
      const plantasPath = path.join(inputPath, 'plantas');
      await fs.ensureDir(plantasPath);
      
      for (const planta of files.plantas) {
        await fs.move(planta.path, path.join(plantasPath, planta.originalname));
      }
    }
    
    // Relatórios (se existirem)
    if (files.relatorios) {
      const relatoriosPath = path.join(inputPath, 'relatorios');
      await fs.ensureDir(relatoriosPath);
      
      for (const relatorio of files.relatorios) {
        await fs.move(relatorio.path, path.join(relatoriosPath, relatorio.originalname));
      }
    }
    
    // Logo (se existir)
    if (files.logo) {
      await fs.move(
        files.logo[0].path,
        path.join(inputPath, 'logo.png')
      );
    }
    
    res.json({
      success: true,
      message: 'Arquivos enviados com sucesso',
      files: Object.keys(files)
    });
    
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      error: 'Erro ao processar arquivos',
      message: error.message
    });
  }
});

// Rota para gerar projeto
app.post('/generate', async (req, res) => {
  try {
    const { projectInfo } = req.body;
    
    if (!projectInfo || !projectInfo.name) {
      return res.status(400).json({
        error: 'Informações do projeto são obrigatórias'
      });
    }
    
    const options = {
      name: projectInfo.name,
      input: path.join(__dirname, '../input'),
      output: path.join(__dirname, '../output'),
      type: projectInfo.type || 'residential',
      skipValidation: false,
      autoDeploy: projectInfo.autoDeploy || false
    };
    
    // Gerar projeto
    await generateProject(options);
    
    res.json({
      success: true,
      message: 'Projeto gerado com sucesso',
      projectPath: path.join(__dirname, '../output', projectInfo.name.toLowerCase().replace(/\s+/g, '-'))
    });
    
  } catch (error) {
    console.error('Erro na geração:', error);
    res.status(500).json({
      error: 'Erro ao gerar projeto',
      message: error.message
    });
  }
});

// Rota para listar projetos gerados
app.get('/projects', async (req, res) => {
  try {
    const outputPath = path.join(__dirname, '../output');
    
    if (!await fs.pathExists(outputPath)) {
      return res.json([]);
    }
    
    const projects = await fs.readdir(outputPath);
    const projectList = [];
    
    for (const project of projects) {
      const projectPath = path.join(outputPath, project);
      const configPath = path.join(projectPath, 'project-config.json');
      
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJSON(configPath);
        projectList.push({
          name: project,
          config: config.project,
          createdAt: config.generated
        });
      }
    }
    
    res.json(projectList);
    
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    res.status(500).json({
      error: 'Erro ao listar projetos',
      message: error.message
    });
  }
});

// Rota para validar arquivos
app.post('/validate', async (req, res) => {
  try {
    const inputPath = path.join(__dirname, '../input');
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      files: {}
    };
    
    // Verificar arquivos obrigatórios
    const requiredFiles = [
      'orcamento.xlsx',
      'modelo-arquitetura.glb',
      'modelo-estrutural.glb'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(inputPath, file);
      const exists = await fs.pathExists(filePath);
      
      validation.files[file] = {
        exists,
        path: filePath
      };
      
      if (!exists) {
        validation.valid = false;
        validation.errors.push(`Arquivo obrigatório não encontrado: ${file}`);
      }
    }
    
    // Verificar arquivos opcionais
    const optionalFiles = ['plantas', 'relatorios', 'logo.png'];
    
    for (const file of optionalFiles) {
      const filePath = path.join(inputPath, file);
      const exists = await fs.pathExists(filePath);
      
      validation.files[file] = {
        exists,
        path: filePath
      };
    }
    
    res.json(validation);
    
  } catch (error) {
    console.error('Erro na validação:', error);
    res.status(500).json({
      error: 'Erro ao validar arquivos',
      message: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Interface web rodando em http://localhost:${PORT}`);
  console.log('📁 Pasta de entrada:', path.join(__dirname, '../input'));
  console.log('📁 Pasta de saída:', path.join(__dirname, '../output'));
});

module.exports = app;
