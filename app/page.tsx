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
    const meses = Math.max(1, numero(mesesContrato));
    const lucroPercentual = Math.max(0, numero(lucroMinimo));

    const custosFixos =
      numero(custoOperacional) +
      numero(materiais) +
      numero(maoDeObra) +
      numero(impostos) +
      numero(outrosCustos);

    const manutencaoTotal = numero(manutencaoMensal) * meses;
    const custosExecucao = custosFixos + manutencaoTotal;

    // Regras de negócio: assessoria e lucro usam SEMPRE o valor estimado como base.
    const assessoriaTotal = estimado * (ASSESSORIA_PERCENTUAL / 100);
    const lucroDesejadoTotal = estimado * (lucroPercentual / 100);

    // O menor lance deve cobrir execução + assessoria + lucro desejado.
    const lanceMinimo =
      custosExecucao + assessoriaTotal + lucroDesejadoTotal;

    const descontoPossivel = estimado - lanceMinimo;
    const descontoPercentual =
      estimado > 0 ? (descontoPossivel / estimado) * 100 : 0;

    const margemEfetivaNoLance =
      lanceMinimo > 0 ? (lucroDesejadoTotal / lanceMinimo) * 100 : 0;

    return {
      estimado,
      meses,
      lucroPercentual,
      custosFixos,
      manutencaoTotal,
      custosExecucao,
      assessoriaTotal,
      lucroDesejadoTotal,
      lanceMinimo,
      descontoPossivel,
      descontoPercentual,
      margemEfetivaNoLance,
      viavel: estimado > 0 && lanceMinimo <= estimado,

      valorEstimadoMensal: estimado / meses,
      lanceMinimoMensal: lanceMinimo / meses,
      custosExecucaoMensais: custosExecucao / meses,
      assessoriaMensal: assessoriaTotal / meses,
      lucroMensal: lucroDesejadoTotal / meses,
      despesasMensais: (custosExecucao + assessoriaTotal) / meses,
    };
  }, [
    valorEstimado,
    lucroMinimo,
    custoOperacional,
    materiais,
    maoDeObra,
    impostos,
    outrosCustos,
    manutencaoMensal,
    mesesContrato,
  ]);

  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">NNAK · Licitações</span>
          <h1>Calculadora de Lance Mínimo</h1>
          <p>
            Todos os percentuais usam o valor estimado da licitação como base.
            O prazo do contrato é usado para distribuir receitas, despesas,
            assessoria e lucro por mês.
          </p>
        </div>

        <div className="rules">
          <div>
            <span>Assessoria sobre o estimado</span>
            <strong>{ASSESSORIA_PERCENTUAL}%</strong>
          </div>
          <div>
            <span>Lucro sobre o estimado</span>
            <strong>{resultado.lucroPercentual.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <span className="step">01</span>
              <h2>Dados da licitação</h2>
            </div>
          </div>

          <div className="formGrid">
            <Campo
              label="Valor estimado da licitação"
              value={valorEstimado}
              onChange={setValorEstimado}
              hint="Base usada para calcular os 7% da assessoria e o lucro desejado."
            />
            <Campo
              label="Duração do contrato"
              value={mesesContrato}
              onChange={setMesesContrato}
              suffix="meses"
              hint="Usado para ratear todos os valores totais na visão mensal."
            />
            <Campo
              label="Lucro mínimo desejado"
              value={lucroMinimo}
              onChange={setLucroMinimo}
              suffix="%"
              hint="Percentual calculado sobre o valor estimado da licitação."
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
              hint="Custo total previsto para todo o contrato."
            />
            <Campo
              label="Materiais / fornecedores total"
              value={materiais}
              onChange={setMateriais}
              hint="Custo total previsto para todo o contrato."
            />
            <Campo
              label="Mão de obra total"
              value={maoDeObra}
              onChange={setMaoDeObra}
              hint="Custo total previsto para todo o contrato."
            />
            <Campo
              label="Impostos total"
              value={impostos}
              onChange={setImpostos}
              hint="Valor total previsto para todo o contrato."
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
          <span className="eyebrow">Resultado</span>
          <p className="resultLabel">Lance mínimo recomendado</p>
          <strong className="bigValue">
            {moeda.format(resultado.lanceMinimo)}
          </strong>

          <p className="resultHelp">
            Este valor já inclui custos de execução, assessoria de 7% sobre o
            valor estimado e lucro de {resultado.lucroPercentual.toFixed(2)}%
            sobre o valor estimado.
          </p>

          <div className={resultado.viavel ? "status ok" : "status danger"}>
            {resultado.viavel
              ? "O lance mínimo cabe dentro do valor estimado."
              : "Com estes custos e lucro, o lance mínimo supera o valor estimado."}
          </div>

          <div className="monthlyTitle">
            <span className="eyebrow">Visão mensal</span>
            <small>{resultado.meses} mês(es) de contrato</small>
          </div>

          <div className="monthlyGrid">
            <div className="monthlyCard">
              <span>Valor estimado/mês</span>
              <strong>{moeda.format(resultado.valorEstimadoMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Lance mínimo/mês</span>
              <strong>{moeda.format(resultado.lanceMinimoMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Despesas médias/mês</span>
              <strong>{moeda.format(resultado.despesasMensais)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Lucro desejado/mês</span>
              <strong>{moeda.format(resultado.lucroMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Assessoria/mês</span>
              <strong>{moeda.format(resultado.assessoriaMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Execução/mês</span>
              <strong>{moeda.format(resultado.custosExecucaoMensais)}</strong>
            </div>
          </div>

          <div className="metrics">
            <div>
              <span>Valor estimado total</span>
              <strong>{moeda.format(resultado.estimado)}</strong>
            </div>
            <div>
              <span>Assessoria (7% do estimado)</span>
              <strong>{moeda.format(resultado.assessoriaTotal)}</strong>
            </div>
            <div>
              <span>
                Lucro desejado ({resultado.lucroPercentual.toFixed(2)}% do estimado)
              </span>
              <strong>{moeda.format(resultado.lucroDesejadoTotal)}</strong>
            </div>
            <div>
              <span>Custos totais da execução</span>
              <strong>{moeda.format(resultado.custosExecucao)}</strong>
            </div>
            <div>
              <span>Manutenção total do contrato</span>
              <strong>{moeda.format(resultado.manutencaoTotal)}</strong>
            </div>
            <div>
              <span>Margem efetiva sobre o lance mínimo</span>
              <strong>{resultado.margemEfetivaNoLance.toFixed(2)}%</strong>
            </div>
          </div>

          {resultado.estimado > 0 ? (
            <div className="limitBox">
              <span>
                {resultado.descontoPossivel >= 0
                  ? "Quanto ainda pode baixar do valor estimado"
                  : "Quanto falta para o projeto caber no valor estimado"}
              </span>
              <strong>
                {moeda.format(Math.abs(resultado.descontoPossivel))}
              </strong>
              <small>
                {resultado.descontoPossivel >= 0
                  ? `${Math.max(0, resultado.descontoPercentual).toFixed(2)}% de espaço para disputa.`
                  : "É necessário reduzir custos e/ou o lucro desejado."}
              </small>
            </div>
          ) : null}

          <div className="formula">
            <span>Fórmula usada</span>
            <code>
              lance mínimo = custos + (estimado × 7%) + (estimado ×{" "}
              {resultado.lucroPercentual.toFixed(2)}%)
            </code>
          </div>
        </aside>
      </section>
    </main>
  );
}
