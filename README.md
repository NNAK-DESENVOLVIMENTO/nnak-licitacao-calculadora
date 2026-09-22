# NNAK Calculadora de Licitações

Simulador para analisar um possível lance final de licitação e verificar se o contrato fica lucrativo.

## Regra de negócio

Existem dois valores diferentes:

- **Valor estimado da licitação**: referência/teto informado no edital.
- **Valor mínimo / lance final**: valor que a NNAK pretende efetivamente ofertar.

O **lance final é a base dos cálculos financeiros**.

```
assessoria = lance final × 7%
manutenção total = manutenção mensal × meses
custos de execução = custos informados + manutenção total
despesas totais = custos de execução + assessoria

lucro líquido total = lance final - despesas totais
margem líquida real = lucro líquido total / lance final

receita mensal = lance final / meses
despesas mensais = despesas totais / meses
lucro/prejuízo mensal = lucro líquido total / meses
```

O lucro mínimo desejado é uma meta de margem sobre o lance. O sistema compara a margem líquida real com essa meta e informa se ela foi atingida.

## GitHub Pages

Publicação pela branch `gh-pages`.

`https://nnak-desenvolvimento.github.io/nnak-licitacao-calculadora/`
