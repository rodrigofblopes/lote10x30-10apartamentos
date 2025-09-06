// Script simples para debugar a planilha
const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG SIMPLES DA PLANILHA');
console.log('============================');

const csvPath = path.join(__dirname, '../public/5DEST.csv');
console.log('📁 Caminho do arquivo:', csvPath);

if (!fs.existsSync(csvPath)) {
  console.error('❌ Arquivo não encontrado!');
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, 'utf8');
console.log('📊 Tamanho do arquivo:', csvContent.length, 'caracteres');

const lines = csvContent.split('\n');
console.log('📋 Total de linhas:', lines.length);

console.log('\n📝 Primeiras 10 linhas:');
for (let i = 0; i < Math.min(10, lines.length); i++) {
  console.log(`Linha ${i}: "${lines[i]}"`);
}

console.log('\n🔍 Analisando linhas com dados:');
for (let i = 3; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const columns = line.split(';');
  console.log(`Linha ${i}: ${columns.length} colunas`);
  console.log(`  Coluna 0 (item): "${columns[0]}"`);
  console.log(`  Coluna 1 (descrição): "${columns[1]}"`);
  console.log(`  Coluna 2 (unidade): "${columns[2]}"`);
  console.log(`  Coluna 3 (quantidade): "${columns[3]}"`);
  
  if (i >= 8) break; // Mostrar apenas as primeiras linhas com dados
}

console.log('\n✅ Debug concluído!');
