# 📦 Kit do Criador de Conteúdo — Algoria

Bem-vindo ao material de apoio para criação de conteúdo na plataforma Algoria.  
Este kit contém tudo que você precisa para criar e importar artigos pelo painel admin.

---

## 📁 Arquivos Deste Kit

| Arquivo | Para que serve |
| :--- | :--- |
| `README.md` | Este guia de início rápido |
| `exemplo-conteudo.md` | Referência completa de todos os recursos de formatação disponíveis |
| `compilar-json.js` | Script que transforma seu Markdown em um JSON pronto para importar |
| `conteudo.md` | *(você cria este arquivo)* Arquivo onde você escreve seu artigo |
| `importar.json` | *(gerado pelo script)* JSON final para importar no painel |

---

## 🚀 Como Criar e Publicar um Conteúdo (Passo a Passo)

### Passo 1 — Baixe este kit e abra a pasta

Copie a pasta `creator-support/` para qualquer lugar no seu computador.  
Você precisará do **Node.js** instalado (versão 18+).

### Passo 2 — Escreva seu conteúdo

Crie um arquivo chamado `conteudo.md` nesta mesma pasta e escreva seu artigo em Markdown.

Consulte o arquivo [`exemplo-conteudo.md`](./exemplo-conteudo.md) para ver todos os recursos disponíveis (tabelas, figuras, gráficos, diagramas Mermaid, alertas, etc.).

### Passo 3 — Configure os metadados

Abra o arquivo `compilar-json.js` e edite a seção `CONFIG`:

```js
const CONFIG = {
  title: 'Título do Meu Artigo',
  slug: 'titulo-do-meu-artigo',    // Só letras, números e hifens
  type: 'engineering-work',        // Veja os tipos abaixo
  publish: false,                  // true = publicado; false = rascunho
  meta: {
    access: 'free',                // 'free' ou 'pro'
    summary: 'Um resumo curto.',
    estimatedMinutes: 10,
    pillar: 'backend',             // (apenas para engineering-work)
    image: '/default-cover.png'
  }
};
```

**Tipos de conteúdo disponíveis:**

| `type` | Descrição |
| :--- | :--- |
| `engineering-work` | Guias técnicos de engenharia no trabalho |
| `interview-en` | Tópicos de inglês técnico para entrevistas |
| `concept` | Guias conceituais teóricos |
| `problem` | Desafios e problemas de lógica/código |
| `technical-test` | Simulados técnicos |

**Pilares para `engineering-work`:**

| `pillar` | Descrição |
| :--- | :--- |
| `frontend` | Frontend e produto |
| `backend` | Backend e APIs |
| `devops` | DevOps e sistema |
| `softskills` | Carreira e Soft Skills |
| `ia` | Inteligência Artificial |

### Passo 4 — Execute o script

No terminal, dentro desta pasta, execute:

```bash
node compilar-json.js
```

Será gerado o arquivo `importar.json` na mesma pasta.

### Passo 5 — Importe no painel

1. Acesse o painel admin e crie um conteúdo: `/admin/content/create`
2. Selecione o tipo **"Engenharia"** (ou o tipo correspondente ao seu artigo)
3. No editor que abre, clique no botão **"Importar"** (ícone de arquivo JSON no canto superior direito)
4. O painel de importação que abrir já contém este mesmo kit como referência
5. Cole o conteúdo do `importar.json` gerado na área de texto e clique em **"Confirmar Importação"**
6. Os campos do formulário serão preenchidos automaticamente — revise e salve

> **Atualização:** O sistema detecta automaticamente se você está atualizando um conteúdo existente pelo slug. Basta re-importar com o mesmo slug.


---

## ❓ Dúvidas Frequentes

**Posso usar imagens no meu artigo?**  
Sim! Imagens devem estar na pasta `public/engenharia/` do projeto. Use o componente `:::didactic-figure` para inseri-las com legenda.

**Meu conteúdo vai ficar visível imediatamente?**  
Depende. Se você marcar `publish: false` (padrão), o conteúdo entra como **Rascunho** e só você verá. Um admin pode revisar e publicar. Se `publish: true` e você for Admin, ele é publicado imediatamente.

**Posso editar um conteúdo já publicado?**  
Sim! Basta re-executar o script com o mesmo `slug` e re-importar. O sistema detecta o slug existente e faz um update preservando o status atual.
