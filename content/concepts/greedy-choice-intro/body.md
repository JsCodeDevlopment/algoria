## Greedy — decisões locais rápidas, validade global comprovada

Algoritmo guloso escolhe "o melhor agora" e não revisita decisão.

Quando funciona, é brilhante:

- implementação simples;
- performance excelente;
- baixa memória.

Quando não funciona, produz resposta plausível e errada.  
Por isso greedy exige prova, não só intuição.

---

### Onde greedy costuma aparecer

- seleção de intervalos;
- agendamento com deadlines;
- escolha de atividades por critério;
- problemas de cobertura/particionamento com heurísticas;
- codificação ótima (Huffman).

Sinal comum: você consegue ordenar candidatos e tomar decisões monotônicas.

---

### Erro mais comum: "parece certo"

Exemplo típico de armadilha:

- "sempre pega o maior valor agora";
- funciona em vários testes;
- falha em caso pequeno com combinação melhor no futuro.

Greedy só está correto quando existe propriedade estrutural do problema que sustenta essa escolha local.

---

### Como se prova greedy na prática

Sem formalismo pesado, você geralmente usa um destes argumentos:

1. **Greedy-choice property**  
   Existe solução ótima que começa com a escolha gulosa.

2. **Exchange argument**  
   Se solução ótima não começa como greedy, dá para trocar elementos sem piorar custo.

3. **Optimal substructure**  
   Após escolha gulosa, sobra subproblema do mesmo tipo.

Sem uma dessas ideias, há alto risco de "acertar por sorte".

---

### Greedy x DP: comparação de decisão

- **Greedy**
  - escolhe local e avança;
  - rápido e limpo;
  - exige propriedade específica.

- **DP**
  - avalia múltiplas alternativas por estado;
  - mais geral;
  - mais custosa em código/memória.

Fluxo profissional:

1. tenta formular greedy;
2. tenta quebrar com contraexemplo;
3. se quebrar, migra para DP.

---

### Exemplo canônico: interval scheduling

Objetivo:

- maximizar quantidade de intervalos sem sobreposição.

Estratégia correta:

- ordenar por término crescente;
- escolher sempre o intervalo viável que termina mais cedo.

Intuição:

- terminar cedo libera mais espaço para próximos intervalos.

Esse caso tem prova clássica de corretude (exchange argument).

---

### "Quase greedy" que costuma falhar

- escolher intervalo com menor início;
- escolher intervalo com menor duração;
- escolher intervalo com maior lucro (quando objetivo é quantidade).

Esses critérios podem parecer naturais e ainda assim quebrar.

---

### Armadilhas recorrentes

- ignorar empate (tie-break) e perder determinismo;
- usar greedy em versão ponderada sem nova prova;
- confundir objetivo ("max quantidade" vs "max valor");
- não ordenar corretamente antes de aplicar regra local.

---

### Checklist de robustez

- [ ] Regra local está escrita com precisão?
- [ ] Tenho argumento de corretude (mesmo resumido)?
- [ ] Testei contraexemplos pequenos intencionais?
- [ ] Comparei com brute force em casos pequenos?
- [ ] Sei dizer quando DP seria alternativa mais segura?

---

### Reflexão

Greedy não é "atalho". É matemática aplicada ao design de algoritmo: escolher cedo só é válido quando você consegue explicar por que isso não compromete o ótimo global.
