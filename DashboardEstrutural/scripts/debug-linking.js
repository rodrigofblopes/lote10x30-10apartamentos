// Script para debugar o linking entre planilha e GLB
// Execute com: node scripts/debug-linking.js

const fs = require('fs');
const path = require('path');

// Função para simular o processamento da planilha
function processarPlanilha() {
  const csvPath = path.join(__dirname, '../public/5DEST.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Arquivo 5DEST.csv não encontrado');
    return [];
  }
  
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  const itens = [];
  
  console.log('📊 Processando planilha 5DEST.csv...');
  
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(';');
    if (columns.length < 12) continue;
    
    const item = columns[0]?.trim();
    const descricao = columns[1]?.trim() || '';
    const unidade = columns[2]?.trim() || 'un';
    const quantidade = parseFloat(columns[3]?.replace(',', '.') || '0');
    
    // Debug: mostrar o que está sendo processado
    console.log(`Linha ${i}: item="${item}", descricao="${descricao}", quantidade=${quantidade}`);
    
    if (!item || !descricao || item.includes('Totais') || item === '') {
      console.log(`   → Pulando linha ${i}: item vazio ou inválido`);
      continue;
    }
    
    itens.push({
      id: item,
      descricao: descricao,
      unidade: unidade,
      quantidade: quantidade
    });
  }
  
  console.log('✅ Itens da planilha processados:', itens.length);
  return itens;
}

// Função para simular elementos do GLB (baseado na análise anterior)
function simularElementosGLB() {
  const elementos = [
    // Fundação - Vigas (1.1)
    '1.1_', '1.1_.001', '1.1_.002', '1.1_.003', '1.1_.004', '1.1_.005',
    '1.1_.006', '1.1_.007', '1.1_.008', '1.1_.009', '1.1_.010', '1.1_.011',
    '1.1_.012', '1.1_.013', '1.1_.014', '1.1_.015', '1.1_.016', '1.1_.017',
    '1.1_.018', '1.1_.019', '1.1_.020', '1.1_.021', '1.1_.022', '1.1_.023',
    '1.1_.024', '1.1_.025', '1.1_.026', '1.1_.027', '1.1_.028', '1.1_.029',
    '1.1_.030', '1.1_.031', '1.1_.032', '1.1_.033', '1.1_.034', '1.1_.035',
    '1.1_.036', '1.1_.037', '1.1_.038', '1.1_.039', '1.1_.040', '1.1_.041',
    '1.1_.042', '1.1_.043', '1.1_.044', '1.1_.045', '1.1_.046', '1.1_.047',
    '1.1_.048', '1.1_.049', '1.1_.050', '1.1_.051', '1.1_.052',
    
    // Fundação - Pilares (1.2)
    '1.2_', '1.2_.001', '1.2_.002', '1.2_.003', '1.2_.004', '1.2_.005',
    '1.2_.006', '1.2_.007', '1.2_.008', '1.2_.009', '1.2_.010', '1.2_.011',
    '1.2_.012', '1.2_.013', '1.2_.014', '1.2_.015', '1.2_.016', '1.2_.017',
    '1.2_.018', '1.2_.019', '1.2_.020', '1.2_.021', '1.2_.022', '1.2_.023',
    '1.2_.024', '1.2_.025', '1.2_.026', '1.2_.027',
    
    // Fundação - Fundações (1.3)
    '1.3_.028', '1.3_.029', '1.3_.030', '1.3_.031', '1.3_.032', '1.3_.033',
    '1.3_.034', '1.3_.035', '1.3_.036', '1.3_.037', '1.3_.038', '1.3_.039',
    '1.3_.040', '1.3_.041', '1.3_.042', '1.3_.043', '1.3_.044', '1.3_.045',
    '1.3_.046', '1.3_.047', '1.3_.048', '1.3_.049', '1.3_.050', '1.3_.051',
    '1.3_.052', '1.3_.053', '1.3_.054', '1.3_.055',
    
    // Térreo - Vigas (2.1)
    '2.1_', '2.1_.001', '2.1_.002', '2.1_.003', '2.1_.004', '2.1_.005',
    '2.1_.006', '2.1_.007', '2.1_.008', '2.1_.009', '2.1_.010', '2.1_.011',
    '2.1_.012', '2.1_.013', '2.1_.014', '2.1_.015', '2.1_.016', '2.1_.017',
    '2.1_.018', '2.1_.019', '2.1_.020', '2.1_.021', '2.1_.022', '2.1_.023',
    '2.1_.024', '2.1_.025', '2.1_.026', '2.1_.027', '2.1_.028', '2.1_.029',
    '2.1_.030', '2.1_.031', '2.1_.032', '2.1_.033', '2.1_.034', '2.1_.035',
    '2.1_.036', '2.1_.037', '2.1_.038', '2.1_.039', '2.1_.040', '2.1_.041',
    '2.1_.042', '2.1_.043', '2.1_.044', '2.1_.045', '2.1_.046', '2.1_.047',
    '2.1_.048', '2.1_.049', '2.1_.050', '2.1_.051', '2.1_.052',
    
    // Térreo - Pilares (2.2)
    '2.2_.028', '2.2_.029', '2.2_.030', '2.2_.031', '2.2_.032', '2.2_.033',
    '2.2_.034', '2.2_.035', '2.2_.036', '2.2_.037', '2.2_.038', '2.2_.039',
    '2.2_.040', '2.2_.041', '2.2_.042', '2.2_.043', '2.2_.044', '2.2_.045',
    '2.2_.046', '2.2_.047', '2.2_.048', '2.2_.049', '2.2_.050', '2.2_.051',
    '2.2_.052', '2.2_.053', '2.2_.054', '2.2_.055',
    
    // Térreo - Lajes (2.3)
    '2.3_', '2.3_.001', '2.3_.002', '2.3_.003', '2.3_.004', '2.3_.005',
    '2.3_.006', '2.3_.007', '2.3_.008', '2.3_.009', '2.3_.010', '2.3_.011',
    '2.3_.012', '2.3_.013', '2.3_.014', '2.3_.015', '2.3_.016', '2.3_.017',
    '2.3_.018', '2.3_.019', '2.3_.020',
    
    // Pavimento Superior - Vigas (3.1)
    '3.1_', '3.1_.001', '3.1_.002', '3.1_.003', '3.1_.004', '3.1_.005',
    '3.1_.006', '3.1_.007', '3.1_.008', '3.1_.009', '3.1_.010', '3.1_.011',
    '3.1_.012', '3.1_.013', '3.1_.014', '3.1_.015', '3.1_.016', '3.1_.017',
    '3.1_.018', '3.1_.019', '3.1_.020', '3.1_.021', '3.1_.022', '3.1_.023',
    '3.1_.024', '3.1_.025', '3.1_.026', '3.1_.027', '3.1_.028', '3.1_.029',
    '3.1_.030', '3.1_.031', '3.1_.032', '3.1_.033', '3.1_.034', '3.1_.035',
    '3.1_.036', '3.1_.037', '3.1_.038', '3.1_.039', '3.1_.040', '3.1_.041',
    '3.1_.042', '3.1_.043', '3.1_.044', '3.1_.045', '3.1_.046', '3.1_.047',
    '3.1_.048', '3.1_.049', '3.1_.050', '3.1_.051', '3.1_.052',
    
    // Pavimento Superior - Pilares (3.2)
    '3.2_.053', '3.2_.054', '3.2_.055', '3.2_.056', '3.2_.057', '3.2_.058',
    '3.2_.059', '3.2_.060', '3.2_.061', '3.2_.062', '3.2_.063', '3.2_.064',
    '3.2_.065', '3.2_.066', '3.2_.067', '3.2_.068', '3.2_.069', '3.2_.070',
    '3.2_.071', '3.2_.072', '3.2_.073', '3.2_.074', '3.2_.075', '3.2_.076',
    '3.2_.077', '3.2_.078', '3.2_.079', '3.2_.080',
    
    // Pavimento Superior - Lajes (3.3)
    '3.3_', '3.3_.001', '3.3_.002', '3.3_.003', '3.3_.004'
  ];
  
  console.log('📦 Elementos GLB simulados:', elementos.length);
  return elementos;
}

// Função de linking (igual ao código do React)
function testarLinking(itemId, elementosGLB) {
  console.log(`\n🔍 TESTANDO LINKING para item: "${itemId}"`);
  
  const matchingElements = [];
  
  elementosGLB.forEach(elementName => {
    // Extrair prefixo do elemento (ex: "1.1_.001" -> "1.1")
    const underscoreIndex = elementName.indexOf('_');
    if (underscoreIndex !== -1) {
      const elementPrefix = elementName.substring(0, underscoreIndex);
      
      // Verificar se corresponde ao item da planilha
      if (elementPrefix === itemId) {
        matchingElements.push(elementName);
        console.log(`✅ MATCH: ${elementName} (prefixo: ${elementPrefix}) = ${itemId}`);
      }
    }
  });
  
  console.log(`🎯 RESULTADO: ${matchingElements.length} elementos encontrados para "${itemId}"`);
  return matchingElements;
}

// Função principal
function main() {
  console.log('🚀 DEBUG DO SISTEMA DE LINKING');
  console.log('==============================');
  
  // Processar planilha
  const itensPlanilha = processarPlanilha();
  console.log('\n📋 Itens da Planilha:');
  itensPlanilha.forEach(item => {
    console.log(`   ${item.id}: ${item.descricao} (${item.quantidade} ${item.unidade})`);
  });
  
  // Simular elementos GLB
  const elementosGLB = simularElementosGLB();
  
  // Testar linking para cada item
  console.log('\n🔗 TESTANDO LINKING:');
  console.log('====================');
  
  const resultados = {};
  
  itensPlanilha.forEach(item => {
    const matches = testarLinking(item.id, elementosGLB);
    resultados[item.id] = {
      item: item,
      matches: matches,
      count: matches.length
    };
  });
  
  // Análise dos resultados
  console.log('\n📊 ANÁLISE DOS RESULTADOS:');
  console.log('==========================');
  
  Object.entries(resultados).forEach(([itemId, resultado]) => {
    const status = resultado.count > 0 ? '✅' : '❌';
    console.log(`${status} ${itemId}: ${resultado.count} elementos (${resultado.item.descricao})`);
    
    if (resultado.count > 0) {
      console.log(`   Primeiros elementos: ${resultado.matches.slice(0, 3).join(', ')}`);
    }
  });
  
  // Identificar problemas
  const semMatches = Object.entries(resultados).filter(([_, resultado]) => resultado.count === 0);
  const comMatches = Object.entries(resultados).filter(([_, resultado]) => resultado.count > 0);
  
  console.log('\n🔍 DIAGNÓSTICO:');
  console.log('===============');
  console.log(`✅ Itens COM matches: ${comMatches.length}`);
  console.log(`❌ Itens SEM matches: ${semMatches.length}`);
  
  if (semMatches.length > 0) {
    console.log('\n❌ Itens sem matches:');
    semMatches.forEach(([itemId, resultado]) => {
      console.log(`   - ${itemId}: ${resultado.item.descricao}`);
    });
  }
  
  // Sugestões de correção
  console.log('\n💡 SUGESTÕES DE CORREÇÃO:');
  console.log('==========================');
  
  if (semMatches.length > 0) {
    console.log('1. Verificar se os nomes dos elementos no GLB correspondem aos códigos da planilha');
    console.log('2. Verificar se há espaços extras nos códigos da planilha');
    console.log('3. Verificar se o formato de nomenclatura está consistente');
  }
  
  // Salvar relatório
  const report = {
    timestamp: new Date().toISOString(),
    planilha: {
      totalItens: itensPlanilha.length,
      itens: itensPlanilha
    },
    glb: {
      totalElementos: elementosGLB.length,
      elementos: elementosGLB
    },
    linking: {
      resultados: resultados,
      resumo: {
        comMatches: comMatches.length,
        semMatches: semMatches.length,
        taxaSucesso: Math.round((comMatches.length / itensPlanilha.length) * 100)
      }
    }
  };
  
  const reportPath = path.join(__dirname, '../linking-debug-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n💾 Relatório salvo em:', reportPath);
  console.log(`📈 Taxa de sucesso: ${report.linking.resumo.taxaSucesso}%`);
}

// Executar debug
main();
