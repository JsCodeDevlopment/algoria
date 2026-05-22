/* eslint-disable */
/**
 * Script de Criação do JSON para Importação na Algoria
 * 
 * Como usar:
 * 1. Edite as configurações abaixo (CONFIGURAÇÃO DO CONTEÚDO).
 * 2. Crie ou edite o seu arquivo markdown (padrão: "conteudo.md") na mesma pasta.
 * 3. Execute o script usando Node.js no seu terminal:
 *    node compilar-json.js
 * 4. Um arquivo "importar.json" será gerado no mesmo diretório. 
 *    Basta fazer o upload ou copiar seu conteúdo e colar no importador do painel admin.
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// 1. CONFIGURAÇÃO DO CONTEÚDO (Edite aqui)
// ==========================================
const CONFIG = {
  // Título amigável do conteúdo
  title: 'Título Exemplo do Artigo',
  
  // URL amigável (slug) do conteúdo. Apenas letras minúsculas, números e hifens.
  slug: 'titulo-exemplo-do-artigo',
  
  // Tipo do conteúdo:
  // - "engineering-work" (para posts e guias técnicos de engenharia)
  // - "interview-en" (para tópicos de inglês técnico)
  // - "concept" (para guias conceituais)
  // - "problem" (para desafios/problemas de lógica)
  type: 'engineering-work',

  // Configurações de acesso e visibilidade
  publish: false, // se true, entra como PUBLICADO; se false, entra como RASCUNHO (DRAFT)

  // Metadados específicos do conteúdo
  meta: {
    // Acesso: 'free' (gratuito) ou 'pro' (exclusivo para assinantes pagantes)
    access: 'free',
    
    // Resumo simples do conteúdo (aparece na listagem)
    summary: 'Um resumo curto e atrativo descrevendo o que o leitor aprenderá neste artigo.',
    
    // Tempo estimado de leitura em minutos
    estimatedMinutes: 5,

    // Pilar do conteúdo (OBRIGATÓRIO apenas para type "engineering-work"):
    // Opções: 'frontend' | 'backend' | 'devops' | 'softskills' | 'ia'
    pillar: 'frontend',
    
    // Caminho da imagem de destaque (opcional)
    image: '/default-cover.png'
  }
};

// ==========================================
// 2. LÓGICA DE COMPILAÇÃO (Não modifique)
// ==========================================
function compilar() {
  const markdownFileName = 'conteudo.md';
  const outputFileName = 'importar.json';

  const mdPath = path.join(__dirname, markdownFileName);
  const outputPath = path.join(__dirname, outputFileName);

  console.log('--- Compilador de Conteúdo Algoria ---');
  
  // Verifica se o arquivo markdown existe
  if (!fs.existsSync(mdPath)) {
    console.log(`\n⚠️  ERRO: O arquivo "${markdownFileName}" não foi encontrado nesta pasta.`);
    console.log(`Por favor, crie um arquivo chamado "${markdownFileName}" com seu conteúdo em markdown e tente novamente.\n`);
    
    // Tenta gerar um arquivo de exemplo para o usuário não ficar perdido
    try {
      const exemploTemplate = `# Meu Primeiro Artigo\n\nEscreva seu conteúdo aqui em markdown...\n`;
      fs.writeFileSync(mdPath, exemploTemplate, 'utf8');
      console.log(`Criado automaticamente um arquivo de exemplo "${markdownFileName}" para você começar!\n`);
    } catch (e) {
      // Ignora erro
    }
    return;
  }

  try {
    // Lê o conteúdo do arquivo markdown
    let body = fs.readFileSync(mdPath, 'utf8');

    // Normaliza finais de linha do Windows (\r\n) para Linux (\n)
    body = body.replace(/\r\n/g, '\n');

    // Monta o objeto final
    const payload = {
      title: CONFIG.title,
      slug: CONFIG.slug,
      type: CONFIG.type,
      publish: CONFIG.publish,
      body: body,
      meta: CONFIG.meta
    };

    // Validações básicas de segurança
    if (!payload.title || !payload.title.trim()) {
      throw new Error('O campo "title" é obrigatório nas configurações.');
    }
    if (!payload.slug || !payload.slug.trim()) {
      throw new Error('O campo "slug" é obrigatório nas configurações.');
    }
    if (!/^[a-z0-9-_]+$/.test(payload.slug)) {
      throw new Error('O campo "slug" deve conter apenas letras minúsculas, números, hifens ou underscores.');
    }

    // Salva o arquivo JSON
    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8');
    
    console.log('\n✅ SUCESSO!');
    console.log(`Arquivo "${outputFileName}" gerado com sucesso em:`);
    console.log(`${outputPath}\n`);
    console.log('Agora você pode:');
    console.log('1. Abrir esse arquivo e copiar o conteúdo JSON.');
    console.log('2. Acessar o Painel Administrativo da Algoria (/admin/content).');
    console.log('3. Clicar em "Importar" e colar ou fazer o upload do arquivo para salvar na plataforma!');
    console.log('\n----------------------------------------\n');

  } catch (error) {
    console.error(`\n❌ FALHA NA COMPILAÇÃO: ${error.message}\n`);
  }
}

compilar();
