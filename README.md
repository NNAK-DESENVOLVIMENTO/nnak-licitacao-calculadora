# NNAK Calculadora de Licitações

Aplicação interna da NNAK para calcular o menor lance possível preservando os custos, a assessoria jurídica e o lucro desejado.

## Regra correta de cálculo

O **valor estimado da licitação é sempre a base dos percentuais**.

- Assessoria jurídica: **7% do valor estimado da licitação**
- Lucro desejado: percentual editável calculado **sobre o valor estimado da licitação**
- Manutenção: valor mensal × quantidade de meses do contrato
- Demais custos: valores totais do contrato

### Lance mínimo

```
assessoria = valor estimado × 7%
lucro desejado = valor estimado × percentual de lucro
custos de execução = custos totais + (manutenção mensal × meses)

lance mínimo = custos de execução + assessoria + lucro desejado
```

### Visão mensal

Depois de calcular os valores totais, o sistema distribui tudo pela duração do contrato:

```
valor estimado mensal = valor estimado / meses
lance mínimo mensal = lance mínimo / meses
assessoria mensal = assessoria / meses
lucro mensal = lucro desejado / meses
despesas mensais = (custos de execução + assessoria) / meses
```

## GitHub Pages

Publicação pela branch `gh-pages`.

`https://nnak-desenvolvimento.github.io/nnak-licitacao-calculadora/`
