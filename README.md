# NNAK Calculadora de Licitações

Aplicação interna da NNAK para calcular o menor valor de lance possível em uma licitação preservando a margem mínima definida pela empresa.

## Regras

- Assessoria jurídica: **7% fixos sobre o valor total do lance**
- Lucro líquido mínimo: **editável**, iniciando em 20%
- Manutenção mensal: **editável**, iniciando em R$ 800
- Prazo do contrato: editável
- Custos operacionais, materiais, mão de obra, impostos e outros custos: editáveis
- Visão mensal de receita, despesas, assessoria e lucro

## Fórmula principal

Como a assessoria e a margem de lucro são percentuais do próprio lance:

```
lance mínimo = custos totais / (1 - 0,07 - margem_de_lucro)
```

Exemplo com margem de 20%:

```
lance mínimo = custos totais / 0,73
```

## Visão mensal

A projeção mensal distribui o valor total do contrato pelo número de meses informado:

```
receita mensal = lance mínimo / meses
despesas mensais = (custos totais + assessoria) / meses
lucro mensal = lucro líquido total / meses
```

## GitHub Pages

Publicação pela branch `gh-pages`.

Endereço:

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
