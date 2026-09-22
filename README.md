# NNAK Calculadora de Licitações

Aplicação interna da NNAK para calcular o menor valor de lance possível em uma licitação preservando a margem mínima definida pela empresa.

## Regras iniciais

- Assessoria jurídica: **7% fixos sobre o valor total do lance**
- Lucro líquido mínimo: **20% do valor total do lance**
- Manutenção mensal: **editável**, iniciando em R$ 800
- Prazo do contrato: editável
- Custos operacionais, materiais, mão de obra, impostos e outros custos: editáveis

## Fórmula principal

Como a assessoria e a margem de lucro são percentuais do próprio lance:

```
lance mínimo = custos totais / (1 - 0,07 - 0,20)
```

Ou:

```
lance mínimo = custos totais / 0,73
```

## GitHub Pages

Publicação configurada por GitHub Actions.

Endereço esperado:

`https://nnak-desenvolvimento.github.io/nnak-licitacao-calculadora/`

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Stack

- Next.js
- React
- TypeScript
