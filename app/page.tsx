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
    const meses = Math.max(1, numero(mesesContrato));
    const margemAlvo = numero(lucroMinimo);

    const custosFixos =
      numero(custoOperacional) +
      numero(materiais) +
      numero(maoDeObra) +
      numero(impostos) +
      numero(outrosCustos);

    const custoManutencao = numero(manutencaoMensal) * meses;
    const custoBase = custosFixos + custoManutencao;

    const fatorDisponivel =
      1 - ASSESSORIA_PERCENTUAL / 100 - margemAlvo / 100;
    const margemValida = fatorDisponivel > 0;
    const lanceMinimo =
      margemValida && custoBase > 0 ? custoBase / fatorDisponivel : 0;

    const assessoria = lanceMinimo * (ASSESSORIA_PERCENTUAL / 100);
    const lucro = lanceMinimo - assessoria - custoBase;
    const margem = lanceMinimo > 0 ? (lucro / lanceMinimo) * 100 : 0;

    const receitaMensal = lanceMinimo / meses;
    const custosMensaisBase = custoBase / meses;
    const assessoriaMensal = assessoria / meses;
    const despesasMensais = custosMensaisBase + assessoriaMensal;
    const lucroMensal = lucro / meses;

    const estimado = numero(valorEstimado);
    const descontoPossivel = estimado > 0 ? estimado - lanceMinimo : 0;
    const descontoPercentual =
      estimado > 0 ? (descontoPossivel / estimado) * 100 : 0;

    return {
      meses,
      margemAlvo,
      margemValida,
      custosFixos,
      custoManutencao,
      custoBase,
      lanceMinimo,
      assessoria,
      lucro,
      margem,
      receitaMensal,
      custosMensaisBase,
      assessoriaMensal,
      despesasMensais,
      lucroMensal,
      descontoPossivel,
      descontoPercentual,
      abaixoDoEstimado:
        margemValida && (estimado === 0 || lanceMinimo <= estimado),
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
            Descubra até onde a NNAK pode reduzir o valor de uma proposta sem
            comprometer a margem desejada e veja o resultado mensal do contrato.
          </p>
        </div>
        <div className="rules">
          <div>
            <span>Assessoria fixa</span>
            <strong>{ASSESSORIA_PERCENTUAL}%</strong>
          </div>
          <div>
            <span>Lucro configurado</span>
            <strong>{resultado.margemAlvo.toFixed(2)}%</strong>
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
              hint="Valor de referência ou teto informado no edital."
            />
            <Campo
              label="Duração do contrato"
              value={mesesContrato}
              onChange={setMesesContrato}
              suffix="meses"
              hint="Todos os valores mensais são calculados a partir deste prazo."
            />
            <Campo
              label="Lucro mínimo desejado"
              value={lucroMinimo}
              onChange={setLucroMinimo}
              suffix="%"
              hint="Editável. Deve ser menor que 93%, pois 7% ficam reservados à assessoria."
            />
            <Campo
              label="Manutenção mensal"
              value={manutencaoMensal}
              onChange={setManutencaoMensal}
              hint="Editável. O valor inicial considerado é R$ 800/mês."
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
              label="Custo operacional"
              value={custoOperacional}
              onChange={setCustoOperacional}
            />
            <Campo
              label="Materiais / fornecedores"
              value={materiais}
              onChange={setMateriais}
            />
            <Campo
              label="Mão de obra"
              value={maoDeObra}
              onChange={setMaoDeObra}
            />
            <Campo label="Impostos" value={impostos} onChange={setImpostos} />
            <Campo
              label="Outros custos"
              value={outrosCustos}
              onChange={setOutrosCustos}
            />
          </div>
        </div>

        <aside className="resultPanel">
          <span className="eyebrow">Resultado</span>
          <p className="resultLabel">Lance mínimo recomendado</p>
          <strong className="bigValue">
            {resultado.margemValida
              ? moeda.format(resultado.lanceMinimo)
              : "Margem inválida"}
          </strong>
          <p className="resultHelp">
            {resultado.margemValida
              ? `Abaixo deste valor, a margem líquida ficará inferior a ${resultado.margemAlvo.toFixed(2)}%.`
              : "A soma de assessoria e lucro precisa ser inferior a 100%."}
          </p>

          <div
            className={
              resultado.margemValida
                ? resultado.abaixoDoEstimado
                  ? "status ok"
                  : "status danger"
                : "status danger"
            }
          >
            {!resultado.margemValida
              ? "Reduza o lucro desejado para menos de 93%."
              : resultado.abaixoDoEstimado
                ? "O lance mínimo cabe no valor estimado."
                : "Os custos exigem um lance acima do valor estimado."}
          </div>

          <div className="monthlyTitle">
            <span className="eyebrow">Visão mensal</span>
            <small>{resultado.meses} mês(es) de contrato</small>
          </div>

          <div className="monthlyGrid">
            <div className="monthlyCard">
              <span>Receita média/mês</span>
              <strong>{moeda.format(resultado.receitaMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Despesas médias/mês</span>
              <strong>{moeda.format(resultado.despesasMensais)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Lucro médio/mês</span>
              <strong>{moeda.format(resultado.lucroMensal)}</strong>
            </div>
            <div className="monthlyCard">
              <span>Assessoria rateada/mês</span>
              <strong>{moeda.format(resultado.assessoriaMensal)}</strong>
            </div>
          </div>

          <div className="metrics">
            <div>
              <span>Custos totais da execução</span>
              <strong>{moeda.format(resultado.custoBase)}</strong>
            </div>
            <div>
              <span>Assessoria jurídica (7%)</span>
              <strong>{moeda.format(resultado.assessoria)}</strong>
            </div>
            <div>
              <span>Despesas totais + assessoria</span>
              <strong>
                {moeda.format(resultado.custoBase + resultado.assessoria)}
              </strong>
            </div>
            <div>
              <span>Lucro líquido total</span>
              <strong>{moeda.format(resultado.lucro)}</strong>
            </div>
            <div>
              <span>Margem líquida efetiva</span>
              <strong>{resultado.margem.toFixed(2)}%</strong>
            </div>
            <div>
              <span>Manutenção total do contrato</span>
              <strong>{moeda.format(resultado.custoManutencao)}</strong>
            </div>
          </div>

          {numero(valorEstimado) > 0 && resultado.margemValida ? (
            <div className="limitBox">
              <span>Possível redução sobre o valor estimado</span>
              <strong>
                {moeda.format(Math.max(0, resultado.descontoPossivel))}
              </strong>
              <small>
                {Math.max(0, resultado.descontoPercentual).toFixed(2)}% de
                margem para disputa até atingir o limite mínimo.
              </small>
            </div>
          ) : null}

          <div className="formula">
            <span>Fórmula usada</span>
            <code>
              custos ÷ (1 − 7% − {resultado.margemAlvo.toFixed(2)}%)
            </code>
          </div>
        </aside>
      </section>
    </main>
  );
}
