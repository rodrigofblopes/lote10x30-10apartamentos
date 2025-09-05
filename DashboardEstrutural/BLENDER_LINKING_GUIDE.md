# 🎨 Guia de Lincagem no Blender - Vila Andriw

## 📋 **Visão Geral**

Este guia mostra como preparar o modelo 3D no Blender para lincagem automática com o orçamento, similar ao Power BI mas com mais controle e precisão.

## 🎯 **Vantagens da Lincagem no Blender**

### ✅ **Mais Eficiente**
- **Visual**: Você vê exatamente o que está linkando
- **Preciso**: Seleção direta dos elementos 3D
- **Rápido**: Interface nativa do Blender
- **Profissional**: Padrão da indústria

### ✅ **Melhor Controle**
- **Nomes únicos**: Cada elemento com ID específico
- **Hierarquia**: Organização por camadas/grupos
- **Metadados**: Propriedades customizadas
- **Exportação**: Dados já linkados no GLB

## 🚀 **Passo a Passo**

### **1. Preparação do Modelo**

#### **1.1 Organizar Hierarquia**
```
Vila Andriw (Empty)
├── Estrutura (Empty)
│   ├── Pilares (Empty)
│   │   ├── Pilar_001
│   │   ├── Pilar_002
│   │   └── ...
│   ├── Vigas (Empty)
│   │   ├── Viga_001
│   │   ├── Viga_002
│   │   └── ...
│   └── Lajes (Empty)
│       ├── Laje_Terreo
│       ├── Laje_Superior
│       └── ...
├── Alvenaria (Empty)
│   ├── Paredes_Externas (Empty)
│   ├── Paredes_Internas (Empty)
│   └── ...
├── Revestimentos (Empty)
│   ├── Pisos (Empty)
│   ├── Azulejos (Empty)
│   └── ...
└── Esquadrias (Empty)
    ├── Janelas (Empty)
    ├── Portas (Empty)
    └── ...
```

#### **1.2 Nomenclatura Padronizada**
```
Estrutura:
- Pilar_001, Pilar_002, ...
- Viga_001, Viga_002, ...
- Laje_Terreo, Laje_Superior

Alvenaria:
- Parede_Externa_001, Parede_Externa_002, ...
- Parede_Interna_001, Parede_Interna_002, ...

Revestimentos:
- Piso_Porcelanato_001, Piso_Porcelanato_002, ...
- Azulejo_Banheiro_001, Azulejo_Banheiro_002, ...

Esquadrias:
- Janela_Aluminio_001, Janela_Aluminio_002, ...
- Porta_Madeira_001, Porta_Madeira_002, ...
```

### **2. Adicionar Metadados**

#### **2.1 Propriedades Customizadas**

Para cada objeto, adicione as seguintes propriedades:

**Estrutura - Pilares:**
```python
# No Blender, selecione o objeto e vá em Object Properties > Custom Properties
budget_code = "103355"
budget_description = "ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS"
material = "Concreto"
category = "Estrutura"
element_type = "Pilar"
```

**Estrutura - Vigas:**
```python
budget_code = "87905"
budget_description = "CHAPISCO APLICADO EM ALVENARIA E ESTRUTURAS DE CONCRETO"
material = "Concreto"
category = "Estrutura"
element_type = "Viga"
```

**Alvenaria - Paredes:**
```python
budget_code = "103355"
budget_description = "ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS"
material = "Bloco Cerâmico"
category = "Alvenaria"
element_type = "Parede"
```

**Revestimentos - Pisos:**
```python
budget_code = "87263"
budget_description = "REVESTIMENTO CERÂMICO PARA PISO COM PLACAS TIPO PORCELANATO"
material = "Porcelanato"
category = "Revestimento"
element_type = "Piso"
```

**Esquadrias - Janelas:**
```python
budget_code = "94573"
budget_description = "JANELA DE ALUMÍNIO DE CORRER COM 4 FOLHAS PARA VIDROS"
material = "Alumínio"
category = "Esquadrias"
element_type = "Janela"
```

**Esquadrias - Portas:**
```python
budget_code = "91329"
budget_description = "KIT DE PORTA DE MADEIRA FRISADA, SEMI-OCA"
material = "Madeira"
category = "Esquadrias"
element_type = "Porta"
```

### **3. Script Python para Automatização**

#### **3.1 Script de Lincagem Automática**

Crie um script Python no Blender para automatizar o processo:

```python
import bpy
import bmesh

# Dicionário de mapeamentos
BUDGET_MAPPINGS = {
    "Pilar": {
        "budget_code": "103355",
        "budget_description": "ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS",
        "material": "Concreto",
        "category": "Estrutura"
    },
    "Viga": {
        "budget_code": "87905", 
        "budget_description": "CHAPISCO APLICADO EM ALVENARIA E ESTRUTURAS DE CONCRETO",
        "material": "Concreto",
        "category": "Estrutura"
    },
    "Laje": {
        "budget_code": "87703",
        "budget_description": "CONTRAPISO EM ARGAMASSA PRONTA",
        "material": "Concreto",
        "category": "Estrutura"
    },
    "Parede": {
        "budget_code": "103355",
        "budget_description": "ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS",
        "material": "Bloco Cerâmico",
        "category": "Alvenaria"
    },
    "Piso": {
        "budget_code": "87263",
        "budget_description": "REVESTIMENTO CERÂMICO PARA PISO COM PLACAS TIPO PORCELANATO",
        "material": "Porcelanato",
        "category": "Revestimento"
    },
    "Janela": {
        "budget_code": "94573",
        "budget_description": "JANELA DE ALUMÍNIO DE CORRER COM 4 FOLHAS PARA VIDROS",
        "material": "Alumínio",
        "category": "Esquadrias"
    },
    "Porta": {
        "budget_code": "91329",
        "budget_description": "KIT DE PORTA DE MADEIRA FRISADA, SEMI-OCA",
        "material": "Madeira",
        "category": "Esquadrias"
    }
}

def apply_budget_mapping():
    """Aplica mapeamento de orçamento baseado no nome do objeto"""
    
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            # Determinar tipo de elemento baseado no nome
            element_type = None
            for key in BUDGET_MAPPINGS.keys():
                if key.lower() in obj.name.lower():
                    element_type = key
                    break
            
            if element_type:
                mapping = BUDGET_MAPPINGS[element_type]
                
                # Aplicar propriedades customizadas
                obj["budget_code"] = mapping["budget_code"]
                obj["budget_description"] = mapping["budget_description"]
                obj["material"] = mapping["material"]
                obj["category"] = mapping["category"]
                obj["element_type"] = element_type
                
                print(f"Aplicado mapeamento para {obj.name}: {mapping['budget_code']}")

def export_with_metadata():
    """Exporta o modelo com metadados para GLB"""
    
    # Aplicar mapeamentos
    apply_budget_mapping()
    
    # Exportar para GLB
    bpy.ops.export_scene.gltf(
        filepath="C:/Users/USUARIO/Desktop/lote10x30-10apartamentos/DashboardEstrutural/public/lote10x30-10apartamentos.glb",
        export_format='GLB',
        use_selection=False,
        export_cameras=False,
        export_lights=False,
        export_materials='EXPORT',
        export_colors=True,
        export_normals=True,
        export_texcoords=True,
        export_draco_mesh_compression_enable=False,
        export_extras=True  # Importante: exporta propriedades customizadas
    )
    
    print("Modelo exportado com metadados!")

# Executar
if __name__ == "__main__":
    export_with_metadata()
```

### **4. Exportação**

#### **4.1 Configurações de Exportação GLB**

```
File > Export > glTF 2.0 (.glb/.gltf)

Configurações:
✅ Include > Selected Objects (se necessário)
✅ Transform > +Y Up
✅ Geometry > Apply Modifiers
✅ Materials > Export
✅ Compression > Draco (opcional)
✅ Data > Extras (IMPORTANTE - exporta propriedades customizadas)
```

#### **4.2 Verificação da Exportação**

Após exportar, verifique se o arquivo GLB contém os metadados:
- Tamanho do arquivo deve incluir os metadados
- Use ferramentas como `gltf-pipeline` para verificar

### **5. Integração com o Dashboard**

#### **5.1 Carregamento Automático**

O Dashboard irá automaticamente:
1. **Extrair metadados** do arquivo GLB
2. **Mapear elementos** com itens do orçamento
3. **Validar correspondências** baseadas nas propriedades
4. **Exibir links** na interface

#### **5.2 Validação**

O sistema irá mostrar:
- ✅ **Elementos mapeados** (verde)
- ⚠️ **Elementos com baixa confiança** (amarelo)
- ❌ **Elementos não mapeados** (vermelho)

## 🔧 **Ferramentas Úteis**

### **Blender Add-ons Recomendados**
- **Archipack**: Para elementos arquitetônicos
- **MeasureIt**: Para medições precisas
- **Extra Objects**: Para formas básicas
- **Node Wrangler**: Para materiais

### **Scripts Úteis**
- **Batch Rename**: Para renomear múltiplos objetos
- **Property Manager**: Para gerenciar propriedades customizadas
- **Export Manager**: Para exportações em lote

## 📊 **Resultado Final**

Após seguir este guia, você terá:

1. **Modelo 3D organizado** com hierarquia clara
2. **Metadados completos** em cada elemento
3. **Lincagem automática** com o orçamento
4. **Validação visual** no Dashboard
5. **Exportação otimizada** para web

## 🎯 **Próximos Passos**

1. **Preparar modelo** no Blender seguindo este guia
2. **Aplicar metadados** usando o script Python
3. **Exportar GLB** com propriedades customizadas
4. **Testar no Dashboard** para validar lincagem
5. **Ajustar se necessário** e re-exportar

---

**💡 Dica**: Comece com poucos elementos para testar o fluxo, depois expanda para todo o modelo!
