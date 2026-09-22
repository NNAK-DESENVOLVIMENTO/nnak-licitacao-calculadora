"use client";

import { useMemo, useState } from "react";

const ASSESSORIA_PERCENTUAL = 7;

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function numero(valor: string) {
  const normalizado = valor.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalizado);
  return Number.isFinite(parsed) ? parsed : 0;
}

function Campo({
  label,
  value,
  onChange,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="inputWrap">
        <input
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0,00"
        />
        {suffix ? <strong>{suffix}</strong> : null}
      </div>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export default function Home() {
  const [valorEstimado, setValorEstimado] = useState("100000");
  const [valorMinimo, setValorMinimo] = useState("80000");
  const [lucroMinimo, setLucroMinimo] = useState("20");
  const [custoOperacional, setCustoOperacional] = useState("0");
  const [materiais, setMateriais] = useState("0");
  const [maoDeObra, setMaoDeObra] = useState("0");
  const [impostos, setImpostos] = useState("0");
  const [outrosCustos, setOutrosCustos] = useState("0");
  const [manutencaoMensal, setManutencaoMensal] = useState("800");
  const [mesesContrato, setMesesContrato] = useState("12");

  const resultado = useMemo(() => {
    const estimado = numero(valorEstimado);
    const lance = numero(valorMinimo);
    const meses = Math.max(1, numero(mesesContrato));
    const margemMinimaDesejada = Math.max(0, numero(lucroMinimo));

    const custosFixos =
      numero(custoOperacional) +
      numero(materiais) +
      numero(maoDeObra) +
      numero(impostos) +
      numero(outrosCustos);

    const manutencaoTotal = numero(manutencaoMensal) * meses;
    const custosExecucao = custosFixos + manutencaoTotal;

    // A partir daqui, todos os percentuais financeiros usam o lance final como base.
    const assessoriaTotal = lance * (ASSESSORIA_PERCENTUAL / 100);
    const lucroMinimoEmReais = lance * (margemMinimaDesejada / 100);

    const despesasTotais = custosExecucao + assessoriaTotal;
    const lucroLiquidoTotal = lance - despesasTotais;
    const margemLiquidaReal =
      lance > 0 ? (lucroLiquidoTotal / lance) * 100 : 0;

    const receitaMensal = lance / meses;
    const custosExecucaoMensais = custosExecucao / meses;
    const assessoriaMensal = assessoriaTotal / meses;
    const despesasMensais = despesasTotais / meses;
    const lucroLiquidoMensal = lucroLiquidoTotal / meses;

    const diferencaEstimado = estimado - lance;
    const descontoSobreEstimado =
      estimado > 0 ? (diferencaEstimado / estimado) * 100 : 0;

    const mesPositivo = lucroLiquidoMensal >= 0;
    const atendeMargem = margemLiquidaReal >= margemMinimaDesejada;
    const dentroDoEstimado = estimado <= 0 || lance <= estimado;

    return {
      estimado,
      lance,
      meses,
      margemMinimaDesejada,
      custosFixos,
      manutencaoTotal,
      custosExecucao,
      assessoriaTotal,
      lucroMinimoEmReais,
      despesasTotais,
      lucroLiquidoTotal,
      margemLiquidaReal,
      receitaMensal,
      custosExecucaoMensais,
      assessoriaMensal,
      despesasMensais,
      lucroLiquidoMensal,
      diferencaEstimado,
      descontoSobreEstimado,
      mesPositivo,
      atendeMargem,
      dentroDoEstimado,
    };
  }, [
    valorEstimado,
    valorMinimo,
    lucroMinimo,
    custoOperacional,
    materiais,
    maoDeObra,
    impostos,
    outrosCustos,
    manutencaoMensal,
    mesesContrato,
  ]);

  const statusTexto = !resultado.dentroDoEstimado
    ? "O lance informado está acima do valor estimado da licitação."
    : !resultado.mesPositivo
      ? "Este lance gera prejuízo depois de descontar assessoria e custos."
      : !resultado.atendeMargem
        ? "O resultado é positivo, mas está abaixo do lucro mínimo desejado."
        : "O lance está positivo e atende ao lucro mínimo desejado.";

  const statusOk =
    resultado.dentroDoEstimado &&
    resultado.mesPositivo &&
    resultado.atendeMargem;

  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">NNAK · Licitações</span>
          <h1>Simulador de Lance</h1>
          <p>
            O valor estimado é apenas a referência do edital. O valor mínimo é
            o lance final que você pretende ofertar e passa a ser a base para
            assessoria, receita, lucro e análise mensal.
          </p>
        </div>

        <div className="rules">
          <div>
            <span>Assessoria sobre o lance</span>
            <strong>{ASSESSORIA_PERCENTUAL}%</strong>
          </div>
          <div>
            <span>Lucro mínimo desejado</span>
            <strong>{resultado.margemMinimaDesejada.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <span className="step">01</span>
              <h2>Dados da licitação e do lance</h2>
            </div>
          </div>

          <div className="formGrid">
            <Campo
              label="Valor estimado da licitação"
              value={valorEstimado}
              onChange={setValorEstimado}
              hint="Referência/teto do edital. Serve para comparar o desconto do seu lance."
            />
            <Campo
              label="Valor mínimo / lance final"
              value={valorMinimo}
              onChange={setValorMinimo}
              hint="Base real dos cálculos. É o valor que você considera ofertar no final."
            />
            <Campo
              label="Duração do contrato"
              value={mesesContrato}
              onChange={setMesesContrato}
              suffix="meses"
              hint="Usado para distribuir receita, despesas e lucro por mês."
            />
            <Campo
              label="Lucro mínimo desejado"
              value={lucroMinimo}
              onChange={setLucroMinimo}
              suffix="%"
              hint="Meta de margem líquida sobre o valor do lance final."
            />
            <Campo
              label="Manutenção mensal"
              value={manutencaoMensal}
              onChange={setManutencaoMensal}
              hint="Custo mensal multiplicado pela duração do contrato."
            />
          </div>

          <div className="divider" />

          <div className="panelHeader compact">
            <div>
              <span className="step">02</span>
              <h2>Custos da execução</h2>
            </div>
          </div>

          <div className="formGrid">
            <Campo
              label="Custo operacional total"
              value={custoOperacional}
              onChange={setCustoOperacional}
              hint="Valor total previsto para o contrato."
            />
            <Campo
              label="Materiais / fornecedores total"
              value={materiais}
              onChange={setMateriais}
              hint="Valor total previsto para o contrato."
            />
            <Campo
              label="Mão de obra total"
              value={maoDeObra}
              onChange={setMaoDeObra}
              hint="Valor total previsto para o contrato."
            />
            <Campo
              label="Impostos total"
              value={impostos}
              onChange={setImpostos}
              hint="Valor total previsto para o contrato."
            />
            <Campo
              label="Outros custos total"
              value={outrosCustos}
              onChange={setOutrosCustos}
              hint="Outros custos totais do projeto."
            />
          </div>
        </div>

        <aside className="resultPanel">
          <span className="eyebrow">Análise do lance</span>
          <p className="resultLabel">Valor do lance analisado</p>
          <strong className="bigValue">{moeda.format(resultado.lance)}</strong>

          <p className="resultHelp">
            Todos os percentuais abaixo usam este valor como base.
          </p>

          <div className={statusOk ? "status ok" : "status danger"}>
            {statusTexto}
          </div>

          <div
            className={`monthlyResult ${resultado.mesPositivo ? "positive" : "negative"}`}
          >
            <div>
              <span className="monthlyResultLabel">Lucro/prejuízo por mês</span>
              <strong>{moeda.format(resultado.lucroLiquidoMensal)}</strong>
              <small>
                Receita mensal − custos mensais − assessoria mensal
              </small>
            </div>
            <span className="monthlyBadge">
              {resultado.mesPositivo ? "POSITIVO" : "NEGATIVO"}
            </span>
          </div>

          <div className="monthlyTitle">
            <span className="eyebrow">Visão mensal</span>
            <small>{resultado.meses} mês(es) de contrato</small>
          </div>

          <div className="monthlyGrid">
            <div className="monthlyCard">
              <span>Receita/mês</span>
              <strong>{moeda.format(resultado.receitaMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Despesas/mês</span>
              <strong>{moeda.format(resultado.despesasMensais)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Lucro líquido/mês</span>
              <strong>{moeda.format(resultado.lucroLiquidoMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Assessoria/mês</span>
              <strong>{moeda.format(resultado.assessoriaMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Execução/mês</span>
              <strong>{moeda.format(resultado.custosExecucaoMensais)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Margem líquida real</span>
              <strong>{resultado.margemLiquidaReal.toFixed(2)}%</strong>
            </div>
          </div>

          <div className="metrics">
            <div>
              <span>Valor estimado do edital</span>
              <strong>{moeda.format(resultado.estimado)}</strong>
            </div>
            <div>
              <span>Valor do lance final</span>
              <strong>{moeda.format(resultado.lance)}</strong>
            </div>
            <div>
              <span>Assessoria (7% do lance)</span>
              <strong>{moeda.format(resultado.assessoriaTotal)}</strong>
            </div>
            <div>
              <span>Custos totais da execução</span>
              <strong>{moeda.format(resultado.custosExecucao)}</strong>
            </div>
            <div>
              <span>Despesas totais</span>
              <strong>{moeda.format(resultado.despesasTotais)}</strong>
            </div>
            <div>
              <span>Lucro líquido total real</span>
              <strong>{moeda.format(resultado.lucroLiquidoTotal)}</strong>
            </div>
            <div>
              <span>
                Lucro mínimo desejado ({resultado.margemMinimaDesejada.toFixed(2)}%)
              </span>
              <strong>{moeda.format(resultado.lucroMinimoEmReais)}</strong>
            </div>
            <div>
              <span>Margem líquida real</span>
              <strong>{resultado.margemLiquidaReal.toFixed(2)}%</strong>
            </div>
            <div>
              <span>Manutenção total do contrato</span>
              <strong>{moeda.format(resultado.manutencaoTotal)}</strong>
            </div>
          </div>

          {resultado.estimado > 0 ? (
            <div className="limitBox">
              <span>
                {resultado.diferencaEstimado >= 0
                  ? "Desconto do lance sobre o valor estimado"
                  : "Lance acima do valor estimado"}
              </span>
              <strong>{moeda.format(Math.abs(resultado.diferencaEstimado))}</strong>
              <small>
                {Math.abs(resultado.descontoSobreEstimado).toFixed(2)}% de
                diferença em relação ao valor estimado.
              </small>
            </div>
          ) : null}

          <div className="formula">
            <span>Regras usadas</span>
            <code>
              assessoria = lance × 7% · lucro líquido = lance − assessoria − custos
            </code>
          </div>
        </aside>
      </section>
    </main>
  );
}
