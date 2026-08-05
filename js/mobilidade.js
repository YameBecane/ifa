/* ============================================================
   mobilidade.js - Calculadora de física da mobilidade
   Deslocamento, velocidade, aceleração, força, trabalho,
   energia cinética, potência e quantidade de movimento.
   ============================================================ */

(function () {
  "use strict";

  var G = 9.81; // gravidade (m/s²)

  /* ---------- Cenários pré-definidos ---------- */
  var CENARIOS = [
    {
      id: "caminhada",
      nome: "Caminhada",
      distancia: 100,
      tempo: 71,
      massa: 70,
      vInicial: 0,
      icone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="13" cy="4" r="2"/><path d="M13 6v6l-4 6M13 12l4 4M9 12h6"/></svg>',
    },
    {
      id: "corrida",
      nome: "Corrida",
      distancia: 100,
      tempo: 20,
      massa: 70,
      vInicial: 0,
      icone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="14" cy="4" r="2"/><path d="M14 6l-3 5 4 3 1 6M11 11l-4 2M15 14l4-1"/></svg>',
    },
    {
      id: "cadeira",
      nome: "Cadeira de rodas",
      distancia: 100,
      tempo: 60,
      massa: 85,
      vInicial: 0,
      icone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10" cy="17" r="4.5"/><path d="M10 6v6h6l2.5 4M9 4h3"/></svg>',
    },
    {
      id: "bicicleta",
      nome: "Bicicleta",
      distancia: 1000,
      tempo: 150,
      massa: 82,
      vInicial: 0,
      icone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="6" cy="17" r="4"/><circle cx="18" cy="17" r="4"/><path d="M6 17l5-9h5l2 9"/></svg>',
    },
    {
      id: "escada",
      nome: "Subir escada",
      distancia: 12,
      tempo: 18,
      massa: 70,
      vInicial: 0,
      icone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 20h4v-4h4v-4h4V8h4"/></svg>',
    },
    {
      id: "onibus",
      nome: "Ônibus urbano",
      distancia: 5000,
      tempo: 900,
      massa: 12000,
      vInicial: 0,
      icone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M3 11h18M7 20h2M15 20h2"/></svg>',
    },
  ];

  /* ---------- Elementos ---------- */
  var form = document.getElementById("form-calc");
  var cenariosEl = document.getElementById("cenarios");
  var resultadosEl = document.getElementById("resultados");
  var graficoEl = document.getElementById("grafico-barras");
  var movel = document.getElementById("movel");
  var btnLimpar = document.getElementById("btn-limpar");

  if (!form) return;

  var campos = {
    distancia: document.getElementById("distancia"),
    tempo: document.getElementById("tempo"),
    massa: document.getElementById("massa"),
    vInicial: document.getElementById("v-inicial"),
  };

  var erros = {
    distancia: document.getElementById("erro-distancia"),
    tempo: document.getElementById("erro-tempo"),
    massa: document.getElementById("erro-massa"),
    vInicial: document.getElementById("erro-v-inicial"),
  };

  /* ---------- Formatação ---------- */
  function formatar(valor, decimais) {
    if (!isFinite(valor)) return "—";
    var abs = Math.abs(valor);
    var d = decimais;
    if (d === undefined) d = abs >= 1000 ? 0 : abs >= 10 ? 2 : 3;
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  /* ---------- Validação ---------- */
  function limparErros() {
    Object.keys(campos).forEach(function (chave) {
      campos[chave].classList.remove("invalido");
      erros[chave].textContent = "";
    });
  }

  function marcarErro(chave, msg) {
    campos[chave].classList.add("invalido");
    erros[chave].textContent = msg;
  }

  function validar() {
    limparErros();
    var ok = true;

    var d = parseFloat(campos.distancia.value);
    var t = parseFloat(campos.tempo.value);
    var m = parseFloat(campos.massa.value);
    var v0 = campos.vInicial.value === "" ? 0 : parseFloat(campos.vInicial.value);

    if (campos.distancia.value === "" || isNaN(d)) {
      marcarErro("distancia", "Informe a distância em metros.");
      ok = false;
    } else if (d < 0) {
      marcarErro("distancia", "A distância não pode ser negativa.");
      ok = false;
    } else if (d > 1e7) {
      marcarErro("distancia", "Use valores de até 10.000.000 m.");
      ok = false;
    }

    if (campos.tempo.value === "" || isNaN(t)) {
      marcarErro("tempo", "Informe o tempo em segundos.");
      ok = false;
    } else if (t <= 0) {
      marcarErro("tempo", "O tempo deve ser maior que zero.");
      ok = false;
    } else if (t > 1e6) {
      marcarErro("tempo", "Use valores de até 1.000.000 s.");
      ok = false;
    }

    if (campos.massa.value === "" || isNaN(m)) {
      marcarErro("massa", "Informe a massa em quilogramas.");
      ok = false;
    } else if (m <= 0) {
      marcarErro("massa", "A massa deve ser maior que zero.");
      ok = false;
    } else if (m > 1e6) {
      marcarErro("massa", "Use valores de até 1.000.000 kg.");
      ok = false;
    }

    if (isNaN(v0)) {
      marcarErro("vInicial", "Informe um número válido (use 0 se partir do repouso).");
      ok = false;
    }

    return ok ? { d: d, t: t, m: m, v0: v0 } : null;
  }

  /* ---------- Cálculos ---------- */
  function calcularFisica(e) {
    var vMedia = e.d / e.t; // velocidade média (m/s)
    var vFinal = 2 * vMedia - e.v0; // MRUV: v = 2·vm - v0
    var aceleracao = (vFinal - e.v0) / e.t; // m/s²
    var forca = e.m * aceleracao; // N
    var peso = e.m * G; // N
    var trabalho = forca * e.d; // J
    var cinetica = (e.m * vFinal * vFinal) / 2; // J
    var potencia = trabalho / e.t; // W
    var momento = e.m * vFinal; // kg·m/s
    var energiaTotal = Math.abs(trabalho) + cinetica;
    var calorias = energiaTotal / 4184; // kcal

    return {
      deslocamento: e.d,
      vMedia: vMedia,
      vMediaKmh: vMedia * 3.6,
      vFinal: vFinal,
      aceleracao: aceleracao,
      forca: forca,
      peso: peso,
      trabalho: trabalho,
      cinetica: cinetica,
      potencia: potencia,
      momento: momento,
      calorias: calorias,
    };
  }

  /* ---------- Ícones dos resultados ---------- */
  var SVG = {
    seta:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h16M15 7l5 5-5 5"/></svg>',
    velocimetro:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/></svg>',
    raio:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M13 3L6 13h5l-1 8 8-11h-5l1-7Z"/></svg>',
    peso:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 20h12l-2-9H8l-2 9Z"/><circle cx="12" cy="7" r="3"/></svg>',
    engrenagem:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/></svg>',
    bateria:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="8" width="16" height="9" rx="2"/><path d="M21 11v3M8 12h6"/></svg>',
    fogo:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3c4 5 6 7 6 11a6 6 0 0 1-12 0c0-3 2-5 6-11Z"/></svg>',
    onda:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12h3l3-6 4 12 3-8 2 2h3"/></svg>',
  };

  function mostrarResultados(r) {
    var itens = [
      { icone: SVG.seta, titulo: "Deslocamento", valor: formatar(r.deslocamento) + " m", formula: "d = distância percorrida" },
      { icone: SVG.velocimetro, titulo: "Velocidade média", valor: formatar(r.vMedia) + " m/s", formula: "v = d / t  •  " + formatar(r.vMediaKmh, 2) + " km/h" },
      { icone: SVG.onda, titulo: "Velocidade final", valor: formatar(r.vFinal) + " m/s", formula: "v = 2·vm − v0" },
      { icone: SVG.raio, titulo: "Aceleração média", valor: formatar(r.aceleracao) + " m/s²", formula: "a = (v − v0) / t" },
      { icone: SVG.engrenagem, titulo: "Força resultante", valor: formatar(r.forca) + " N", formula: "F = m · a" },
      { icone: SVG.peso, titulo: "Peso", valor: formatar(r.peso) + " N", formula: "P = m · g (9,81)" },
      { icone: SVG.bateria, titulo: "Trabalho", valor: formatar(r.trabalho) + " J", formula: "W = F · d" },
      { icone: SVG.bateria, titulo: "Energia cinética", valor: formatar(r.cinetica) + " J", formula: "Ec = m · v² / 2" },
      { icone: SVG.raio, titulo: "Potência", valor: formatar(r.potencia) + " W", formula: "P = W / t" },
      { icone: SVG.onda, titulo: "Quantidade de movimento", valor: formatar(r.momento) + " kg·m/s", formula: "Q = m · v" },
      { icone: SVG.fogo, titulo: "Energia em calorias", valor: formatar(r.calorias, 2) + " kcal", formula: "1 kcal = 4184 J" },
    ];

    resultadosEl.innerHTML = itens
      .map(function (item) {
        return (
          '<article class="card-resultado">' +
          item.icone +
          "<h3>" +
          item.titulo +
          "</h3>" +
          '<div class="valor">' +
          item.valor +
          "</div>" +
          '<div class="formula">' +
          item.formula +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    // Animação de entrada em cascata
    Array.prototype.forEach.call(resultadosEl.children, function (el, i) {
      window.setTimeout(function () {
        el.classList.add("visivel");
      }, i * 60);
    });
  }

  /* ---------- Gráfico comparativo ---------- */
  function mostrarGrafico(vAtual) {
    var linhas = CENARIOS.map(function (c) {
      return { nome: c.nome, v: c.distancia / c.tempo };
    });
    linhas.push({ nome: "Seu cálculo", v: vAtual, destaque: true });

    var maximo = Math.max.apply(
      null,
      linhas.map(function (l) {
        return l.v;
      })
    );

    graficoEl.innerHTML = linhas
      .map(function (l) {
        var pct = maximo > 0 ? (l.v / maximo) * 100 : 0;
        return (
          '<div class="g-linha"><span>' +
          l.nome +
          '</span><div class="g-trilha"><div class="g-fill" data-largura="' +
          pct.toFixed(1) +
          '" style="' +
          (l.destaque ? "background:linear-gradient(90deg,#e67e22,#e74c3c);" : "") +
          '">' +
          formatar(l.v, 2) +
          " m/s</div></div></div>"
        );
      })
      .join("");

    window.requestAnimationFrame(function () {
      graficoEl.querySelectorAll(".g-fill").forEach(function (f) {
        f.style.width = f.getAttribute("data-largura") + "%";
      });
    });
  }

  /* ---------- Animação do móvel ---------- */
  function animarMovel(tempo) {
    if (!movel) return;
    var duracao = Math.min(6, Math.max(1, tempo / 10));
    movel.style.transition = "none";
    movel.style.left = "0%";
    window.requestAnimationFrame(function () {
      movel.style.transition = "left " + duracao + "s linear";
      movel.style.left = "calc(100% - 46px)";
    });
  }

  /* ---------- Cenários ---------- */
  function montarCenarios() {
    cenariosEl.innerHTML = CENARIOS.map(function (c) {
      return (
        '<button class="btn-cenario" type="button" data-cenario="' +
        c.id +
        '">' +
        c.icone +
        c.nome +
        "</button>"
      );
    }).join("");

    cenariosEl.querySelectorAll(".btn-cenario").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cen = CENARIOS.filter(function (c) {
          return c.id === btn.getAttribute("data-cenario");
        })[0];
        if (!cen) return;
        cenariosEl.querySelectorAll(".btn-cenario").forEach(function (b) {
          b.classList.remove("ativo");
        });
        btn.classList.add("ativo");
        campos.distancia.value = cen.distancia;
        campos.tempo.value = cen.tempo;
        campos.massa.value = cen.massa;
        campos.vInicial.value = cen.vInicial;
        executar();
      });
    });
  }

  /* ---------- Execução ---------- */
  function executar() {
    var entrada = validar();
    if (!entrada) {
      resultadosEl.innerHTML = "";
      return;
    }
    var r = calcularFisica(entrada);
    mostrarResultados(r);
    mostrarGrafico(r.vMedia);
    animarMovel(entrada.t);
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    executar();
  });

  btnLimpar.addEventListener("click", function () {
    form.reset();
    campos.vInicial.value = "0";
    limparErros();
    resultadosEl.innerHTML = "";
    cenariosEl.querySelectorAll(".btn-cenario").forEach(function (b) {
      b.classList.remove("ativo");
    });
    mostrarGrafico(0);
  });

  // Validação em tempo real
  Object.keys(campos).forEach(function (chave) {
    campos[chave].addEventListener("input", function () {
      campos[chave].classList.remove("invalido");
      erros[chave].textContent = "";
    });
  });

  function iniciar() {
    montarCenarios();
    // Estado inicial: cenário de corrida
    var primeiro = cenariosEl.querySelector('[data-cenario="corrida"]');
    if (primeiro) primeiro.click();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
