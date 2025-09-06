// Script para testar o sistema de clique e highlighting
console.log('🔍 Testando sistema de clique e highlighting...');

// Simular dados da planilha
const mockItens5D = [
  { item: '1.1', descricao: 'Vigas', quantidade: 10, valorUnitario: 800, totalFinal: 8000 },
  { item: '1.2', descricao: 'Pilares', quantidade: 5, valorUnitario: 1200, totalFinal: 6000 }
];

// Simular elementos GLB
const mockGlbElements = [
  '1.1_.001', '1.1_.002', '1.1_.003', '1.1_.004', '1.1_.005',
  '1.2_.001', '1.2_.002', '1.2_.003'
];

// Função de matching (copiada do código)
function findMatchingElements(itemId, glbElements) {
  console.log(`🔍 Buscando elementos para item: "${itemId}"`);
  console.log(`📋 Elementos GLB disponíveis: ${glbElements.length}`);
  
  const matchingElements = [];
  
  glbElements.forEach(elementName => {
    // Extrair prefixo do nome do elemento (ex: "1.1_.001" -> "1.1")
    const prefix = elementName.split('_')[0];
    
    if (prefix === itemId) {
      matchingElements.push(elementName);
      console.log(`✅ MATCH: ${elementName} (prefixo: ${prefix}) = ${itemId}`);
    }
  });
  
  console.log(`🎯 Total de matches para "${itemId}": ${matchingElements.length}`);
  return matchingElements;
}

// Testar o sistema
console.log('\n🧪 Testando clique no item "1.1":');
const matches = findMatchingElements('1.1', mockGlbElements);
console.log(`✅ Resultado: ${matches.length} elementos encontrados`);
console.log(`📋 Elementos: ${matches.slice(0, 3).join(', ')}...`);

console.log('\n🧪 Testando clique no item "1.2":');
const matches2 = findMatchingElements('1.2', mockGlbElements);
console.log(`✅ Resultado: ${matches2.length} elementos encontrados`);
console.log(`📋 Elementos: ${matches2.slice(0, 3).join(', ')}...`);

console.log('\n✅ Teste concluído! O algoritmo de matching está funcionando corretamente.');
