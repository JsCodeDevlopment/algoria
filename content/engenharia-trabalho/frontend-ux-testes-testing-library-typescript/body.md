## Objetivos de aprendizagem

1. Explicar porque **bons testes de UI** são parte de **boa UX** (regressões são também experiência).
2. Escrever testes que imitam um humano: **roles**, **textos**, **labels** — não `className` frágil.
3. Separar **lógica pura** (reducers) de **efeitos** (hooks com rede) para testar sem drama.
4. Usar **tipos** como checklist de estado consistente — sem fanatismo de cobertura por percentagem.

---

## Porque este trio aparece junto

Experiência não é só cor bonita. É **comportamento previsível**:

- carregar sem travar o utilizador num vácuo,
- erros compreensíveis,
- caminhos que continuam a funcionar depois do próximo refactor.

Testes automatizados não substituem pesquisa com utilizadores — mas **seguram** o que já aprendeste em laboratório ou em produção. Se cada refactor parte botões silenciosamente, a UX retrocede mesmo com design novo.

---

## Três pilares (traduzidos do que equipas saudáveis fazem)

### 1. Código legível e responsabilidades curtas

Componentes pequenos, dados entrando por **props** ou hooks claros, sem misturar busca de rede com markup gigante no mesmo ficheiro só porque “funciona”.

Frase de revisão útil: **“Consigo explicar este componente numa frase?”**

### 2. Testes no comportamento — não no “como está implementado”

Se o teste quebra quando mudas de `div` para `section` sem mudar o que o utilizador vê, provavelmente estás colado a **detalhe interno**.

Preferência: perguntas que uma pessoa faria ao ecrã:

- Existe o botão “Abrir menu”?
- Aparece a mensagem de erro quando a rede falha?
- O estado de carregamento mostra um placeholder honesto?

Bibliotecas como **React Testing Library** encorajam isto por desenho — não são substituto de e2e pesado, são rede de segurança rápida no dia-a-dia.

### 3. Estado consistente — tipos ajudam

TypeScript (ou outro sistema de tipos) não evita bugs mágicos sozinho, mas **força contratos**: um fetch tem `loading`, `error` e `data` mutuamente coerentes? enums ou uniões discriminadas para ações de reducer reduzem estados “impossíveis” esquecidos no código.

---

## Mentalidade Testing Library em três regras

1. **Consulta como utilizador** — `getByRole('button', { name: /gravar/i })` liga-se a **acessibilidade real**: botões nomeados servem leitores de ecrã **e** testes estáveis.
2. **`userEvent` antes de `fireEvent` quando possível** — simula cadência mais próxima de uso humano (foco, teclas).
3. **Evitar SELECTORES CSS ou IDs só para teste** — salvo excepções raras, são cordas que se rompem quando design muda.

---

## Dividir para conquistar: reducer puro + hook com efeitos

Padrão didático que aparece em projetos bem estruturados:

- **Reducer** (ou máquina de estados pequena): função pura `estado + ação → novo estado`. Testas com mesa de exemplos — rápido, determinístico.
- **Hook** `useAlgo`: junta reducer + `useEffect` + chamadas HTTP. Testas com **mock de rede** (timeout, 500, 200) e verificas **resultado observável** ou estado devolvido via `renderHook` (conforme stack).

Benefício pedagógico: quando um teste de hook falha, sabes se problema é **política de estado** ou **integração externa**.

---

## Menu, rotas e dados por props

Um menu que recebe `menuItems: { label, linkTo, key }[]` não “sabe” nomes fixos de páginas — só renderiza lista. Isto é:

- mais fácil de testar (passas dois itens falsos),
- mais fácil de mudar produto sem editar componente genérico.

O mesmo espírito vale para listagens e filtros: **dados desacoplados** da árvore visual.

---

## Cobertura ≠ tranquilidade

Percentagem alta com asserts fracos só mente ao dashboard.

Melhor pergunta em planeamento:

> “Se amanhã um junior mudar o texto do botão de erro, o teste falha à cabeça?”

Se não falha, talvez não estejas a proteger o comportamento que importa à equipa de suporte ou ao utilizador.

---

## Erros comuns

| Hábito | Problema |
| --- | --- |
| Testar ordem de chamadas internas | refactor legítimo parte CI |
| Snapshot gigante de árvore inteira | ruído; falhas ilegíveis |
| Ignorar estados de loading/erro na UI | UX quebra mas teste verde com dados mock fixos |
| Zero attributes acessíveis | utilizadores e testes ficam à cega |

---

## Checklist antes de merge de feature visível

- [ ] Existe teste que cobre **feliz + erro + loading** (mesmo que mínimo)?
- [ ] Queries usam **role / texto visível / label**?
- [ ] Lógica de estado complexa tem **função pura** testada aparte?
- [ ] Tipos impedem combinações absurdas (`loading` e `data` cheio ao mesmo tempo sem intenção)?

---

## Leituras de profundidade

O artigo original constrói um PoC completo (menu, pesquisa, `useReducer`, mocks HTTP, hooks) — útil se quiseres ver **código** linha-a-linha:

- [UX Studies with React, TypeScript, and Testing Library](https://www.iamtk.co/ux-studies-with-react-typescript-and-testing-library) — TK.

Para performance e interação depois de teres confiança nos testes de comportamento, cruza com o guia **INP em apps React** na mesma área da Algoria.

---

## Reflexão

Teste bom conta uma **história de utilizador curta**. Se precisas de três parágrafos de comentário no teste para o novato entender, talvez o componente precise da mesma clarificação — UX e DX caminham juntos.
