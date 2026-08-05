/* ============================================================
   audicao.js - Simulador de condições auditivas (Web Audio API)
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Base de dados das condições ---------- */
  var CONDICOES = {
    normal: {
      nome: "Audição Normal",
      badge: "Referência",
      descricao:
        "A audição saudável percebe frequências de 20 Hz a 20.000 Hz e sons a partir de 0 a 25 dB, permitindo entender a fala com clareza mesmo em ambientes com ruído moderado.",
      sintomas: ["Nenhum sintoma", "Fala compreendida com clareza", "Localização precisa dos sons"],
      tratamentos: ["Prevenção com proteção auricular", "Audiometria periódica", "Volume moderado em fones"],
      severidade: 0,
      prevalencia: 80,
      impacto: 0,
      audiograma: { 250: 10, 500: 10, 1000: 10, 2000: 12, 4000: 12, 8000: 15 },
      filtro: { tipo: "lowpass", freq: 20000, ganho: 1, ruido: 0, zumbido: false },
    },
    leve: {
      nome: "Perda Auditiva Leve",
      badge: "26 a 40 dB",
      descricao:
        "Sons suaves e consoantes agudas (s, f, t) começam a se perder. A pessoa costuma pedir repetições e tem dificuldade em conversas com ruído de fundo.",
      sintomas: ["Pede repetição frequentemente", "Dificuldade em ambientes ruidosos", "Aumenta o volume da TV"],
      tratamentos: ["Aparelho auditivo leve", "Treino auditivo", "Redução de ruído ambiente"],
      severidade: 3,
      prevalencia: 15,
      impacto: 3,
      audiograma: { 250: 25, 500: 28, 1000: 32, 2000: 35, 4000: 38, 8000: 40 },
      filtro: { tipo: "lowpass", freq: 5500, ganho: 0.72, ruido: 0, zumbido: false },
    },
    moderada: {
      nome: "Perda Auditiva Moderada",
      badge: "41 a 60 dB",
      descricao:
        "A fala em volume normal fica difícil de compreender. Sem amplificação, o entendimento depende muito de leitura labial e contexto.",
      sintomas: ["Não entende fala em volume normal", "Isolamento social", "Fadiga auditiva ao fim do dia"],
      tratamentos: ["Aparelho auditivo digital", "Sistemas FM em sala de aula", "Fonoaudiologia"],
      severidade: 5,
      prevalencia: 9,
      impacto: 6,
      audiograma: { 250: 42, 500: 46, 1000: 50, 2000: 55, 4000: 58, 8000: 60 },
      filtro: { tipo: "lowpass", freq: 2600, ganho: 0.45, ruido: 0, zumbido: false },
    },
    severa: {
      nome: "Perda Auditiva Severa",
      badge: "61 a 80 dB",
      descricao:
        "Apenas sons muito altos são percebidos. A comunicação normalmente exige aparelhos potentes, Libras ou leitura labial.",
      sintomas: ["Percebe só sons muito altos", "Fala própria alterada", "Dependência de recursos visuais"],
      tratamentos: ["Aparelho de alta potência", "Implante coclear", "Libras e leitura labial"],
      severidade: 8,
      prevalencia: 4,
      impacto: 8,
      audiograma: { 250: 62, 500: 68, 1000: 72, 2000: 76, 4000: 78, 8000: 80 },
      filtro: { tipo: "lowpass", freq: 1200, ganho: 0.26, ruido: 0, zumbido: false },
    },
    profunda: {
      nome: "Perda Auditiva Profunda",
      badge: "81 dB ou mais",
      descricao:
        "Praticamente nenhum som da fala é percebido pela via aérea. Restam apenas vibrações graves de grande intensidade.",
      sintomas: ["Ausência de percepção da fala", "Percepção apenas de vibrações", "Comunicação visual essencial"],
      tratamentos: ["Implante coclear", "Libras como primeira língua", "Tecnologias assistivas visuais"],
      severidade: 10,
      prevalencia: 2,
      impacto: 10,
      audiograma: { 250: 85, 500: 90, 1000: 95, 2000: 100, 4000: 105, 8000: 110 },
      filtro: { tipo: "lowpass", freq: 500, ganho: 0.14, ruido: 0, zumbido: false },
    },
    presbiacusia: {
      nome: "Presbiacusia",
      badge: "Perda por idade",
      descricao:
        "Perda progressiva relacionada ao envelhecimento, que atinge primeiro as frequências agudas. Vozes femininas e infantis ficam mais difíceis de entender.",
      sintomas: ["Perda das frequências agudas", "Dificuldade com vozes agudas", "Zumbido ocasional"],
      tratamentos: ["Aparelho auditivo", "Reabilitação auditiva", "Adaptação do ambiente"],
      severidade: 5,
      prevalencia: 33,
      impacto: 6,
      audiograma: { 250: 15, 500: 20, 1000: 30, 2000: 48, 4000: 62, 8000: 75 },
      filtro: { tipo: "lowpass", freq: 1800, ganho: 0.5, ruido: 0, zumbido: false },
    },
    zumbido: {
      nome: "Zumbido (Tinnitus)",
      badge: "Sintoma contínuo",
      descricao:
        "Percepção de um som constante (apito, chiado ou zumbido) sem fonte externa. Pode acompanhar perda auditiva e prejudicar sono e concentração.",
      sintomas: ["Apito ou chiado constante", "Insônia e irritabilidade", "Dificuldade de concentração"],
      tratamentos: ["Terapia sonora (mascaramento)", "Terapia cognitivo-comportamental", "Tratar a causa base"],
      severidade: 6,
      prevalencia: 15,
      impacto: 7,
      audiograma: { 250: 20, 500: 22, 1000: 28, 2000: 40, 4000: 55, 8000: 50 },
      filtro: { tipo: "lowpass", freq: 6000, ganho: 0.7, ruido: 0.05, zumbido: true },
    },
    conducao: {
      nome: "Perda Condutiva",
      badge: "Som abafado",
      descricao:
        "Problemas no ouvido externo ou médio (cera, otite, perfuração) bloqueiam a passagem do som, que chega abafado como se houvesse algodão no ouvido.",
      sintomas: ["Sensação de ouvido tampado", "Som abafado e distante", "Dor ou pressão auricular"],
      tratamentos: ["Remoção de cerume", "Antibióticos para otite", "Cirurgia (timpanoplastia)"],
      severidade: 4,
      prevalencia: 7,
      impacto: 5,
      audiograma: { 250: 45, 500: 45, 1000: 42, 2000: 40, 4000: 38, 8000: 35 },
      filtro: { tipo: "lowpass", freq: 900, ganho: 0.4, ruido: 0, zumbido: false },
    },
  };

  var ESCALA_DB = [
    { nome: "Respiração", db: 10, classe: "seguro" },
    { nome: "Sussurro", db: 30, classe: "seguro" },
    { nome: "Conversa", db: 60, classe: "seguro" },
    { nome: "Trânsito", db: 80, classe: "atencao" },
    { nome: "Liquidificador", db: 88, classe: "atencao" },
    { nome: "Show / Boate", db: 110, classe: "perigo" },
    { nome: "Turbina de avião", db: 130, classe: "perigo" },
  ];

  var ICONE_ORELHA =
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">' +
    '<path d="M18 42c0-8-8-11-8-22a14 14 0 0 1 28 0c0 7-5 9-9 9s-5 4-5 7" />' +
    '<circle cx="24" cy="19" r="4" /></svg>';

  /* ---------- Elementos ---------- */
  var seletor = document.getElementById("seletor-condicao");
  var btnTocar = document.getElementById("btn-tocar");
  var btnParar = document.getElementById("btn-parar");
  var rotuloTocar = document.getElementById("rotulo-tocar");
  var volume = document.getElementById("volume");
  var valorVolume = document.getElementById("valor-volume");
  var canvas = document.getElementById("onda");
  var equalizador = document.getElementById("equalizador");
  var audiograma = document.getElementById("audiograma");
  var escalaDb = document.getElementById("escala-db");

  if (!seletor || !canvas) return;

  /* ---------- Web Audio ---------- */
  var ctx = null;
  var analisador = null;
  var mestre = null;
  var nos = [];
  var tocando = false;
  var animacao = null;

  function criarContexto() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    mestre = ctx.createGain();
    analisador = ctx.createAnalyser();
    analisador.fftSize = 2048;
    mestre.connect(analisador);
    analisador.connect(ctx.destination);
    return ctx;
  }

  function ganhoAtual() {
    return (parseInt(volume.value, 10) / 100) * 0.5;
  }

  // Toca uma melodia simples (sequência de notas) filtrada conforme a condição
  function tocar() {
    if (!criarContexto()) return;
    if (ctx.state === "suspended") ctx.resume();
    parar(true);

    var cond = CONDICOES[seletor.value] || CONDICOES.normal;
    var cfg = cond.filtro;

    mestre.gain.value = ganhoAtual() * cfg.ganho;

    var filtro = ctx.createBiquadFilter();
    filtro.type = cfg.tipo;
    filtro.frequency.value = cfg.freq;
    filtro.Q.value = 0.7;
    filtro.connect(mestre);
    nos.push(filtro);

    // Melodia de referência (frequências em Hz) com agudos e graves
    var notas = [261.6, 329.6, 392.0, 523.3, 659.3, 784.0, 1046.5, 1318.5, 2093.0, 2637.0];
    var agora = ctx.currentTime + 0.05;
    var passo = 0.42;

    notas.forEach(function (freq, i) {
      var osc = ctx.createOscillator();
      var env = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, agora + i * passo);
      env.gain.linearRampToValueAtTime(0.6, agora + i * passo + 0.05);
      env.gain.linearRampToValueAtTime(0, agora + i * passo + passo * 0.9);
      osc.connect(env);
      env.connect(filtro);
      osc.start(agora + i * passo);
      osc.stop(agora + i * passo + passo);
      nos.push(osc, env);
    });

    // Zumbido contínuo (tinnitus)
    if (cfg.zumbido) {
      var apito = ctx.createOscillator();
      var gApito = ctx.createGain();
      apito.type = "sine";
      apito.frequency.value = 6200;
      gApito.gain.value = 0.05;
      apito.connect(gApito);
      gApito.connect(mestre);
      apito.start(agora);
      nos.push(apito, gApito);
    }

    tocando = true;
    btnParar.disabled = false;
    rotuloTocar.textContent = "Tocando...";
    desenhar();

    var duracao = notas.length * passo + 0.3;
    window.setTimeout(function () {
      if (tocando) parar();
    }, duracao * 1000);
  }

  function parar(silencioso) {
    nos.forEach(function (no) {
      try {
        if (typeof no.stop === "function") no.stop();
        no.disconnect();
      } catch (e) {
        /* nó já finalizado */
      }
    });
    nos = [];
    tocando = false;
    if (!silencioso) {
      btnParar.disabled = true;
      rotuloTocar.textContent = "Tocar simulação";
      if (animacao) cancelAnimationFrame(animacao);
      animacao = null;
      limparCanvas();
      zerarEqualizador();
    }
  }

  /* ---------- Visualizações ---------- */
  var ctx2d = canvas.getContext("2d");

  function limparCanvas() {
    ctx2d.fillStyle = "#12121f";
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);
    ctx2d.strokeStyle = "rgba(155, 89, 182, 0.5)";
    ctx2d.lineWidth = 2;
    ctx2d.beginPath();
    ctx2d.moveTo(0, canvas.height / 2);
    ctx2d.lineTo(canvas.width, canvas.height / 2);
    ctx2d.stroke();
  }

  function desenhar() {
    if (!analisador) return;
    var tamanho = analisador.fftSize;
    var dados = new Uint8Array(tamanho);
    var freqs = new Uint8Array(analisador.frequencyBinCount);

    function quadro() {
      animacao = requestAnimationFrame(quadro);
      analisador.getByteTimeDomainData(dados);
      analisador.getByteFrequencyData(freqs);

      ctx2d.fillStyle = "#12121f";
      ctx2d.fillRect(0, 0, canvas.width, canvas.height);

      ctx2d.lineWidth = 2.5;
      ctx2d.strokeStyle = "#9b59b6";
      ctx2d.beginPath();
      var largura = canvas.width / tamanho;
      var x = 0;
      for (var i = 0; i < tamanho; i++) {
        var v = dados[i] / 128.0;
        var y = (v * canvas.height) / 2;
        if (i === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
        x += largura;
      }
      ctx2d.stroke();

      // Equalizador
      var barras = equalizador.children;
      var passo = Math.floor(freqs.length / barras.length);
      for (var b = 0; b < barras.length; b++) {
        var soma = 0;
        for (var k = 0; k < passo; k++) soma += freqs[b * passo + k];
        var media = soma / passo / 255;
        barras[b].style.height = Math.max(8, media * 100) + "%";
      }
    }

    quadro();
  }

  function montarEqualizador() {
    var html = "";
    for (var i = 0; i < 24; i++) html += '<div class="barra-eq"></div>';
    equalizador.innerHTML = html;
  }

  function zerarEqualizador() {
    Array.prototype.forEach.call(equalizador.children, function (b) {
      b.style.height = "8%";
    });
  }

  function montarAudiograma(cond) {
    var html = "";
    Object.keys(cond.audiograma).forEach(function (freq) {
      var perda = cond.audiograma[freq];
      var pct = Math.min(100, (perda / 110) * 100);
      html +=
        '<div class="freq-card">' +
        "<strong>" +
        (freq >= 1000 ? freq / 1000 + " kHz" : freq + " Hz") +
        "</strong>" +
        "<small>" +
        perda +
        " dB de perda</small>" +
        '<div class="freq-trilha"><div class="freq-preenchimento" style="width:' +
        pct +
        '%"></div></div>' +
        "</div>";
    });
    audiograma.innerHTML = html;
  }

  function montarEscalaDb() {
    if (!escalaDb) return;
    escalaDb.innerHTML = ESCALA_DB.map(function (item) {
      var pct = Math.min(100, (item.db / 130) * 100);
      return (
        '<div class="item-db reveal">' +
        "<strong>" +
        item.nome +
        "</strong>" +
        '<div class="trilha-db"><div class="fill-db ' +
        item.classe +
        '" data-largura="' +
        pct +
        '"></div></div>' +
        "<span>" +
        item.db +
        " dB</span>" +
        "</div>"
      );
    }).join("");

    // Anima as barras quando entram na tela
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(
        function (entradas) {
          entradas.forEach(function (e) {
            if (!e.isIntersecting) return;
            var fill = e.target.querySelector(".fill-db");
            if (fill) fill.style.width = fill.getAttribute("data-largura") + "%";
            e.target.classList.add("visivel");
            obs.unobserve(e.target);
          });
        },
        { threshold: 0.2 }
      );
      escalaDb.querySelectorAll(".item-db").forEach(function (el) {
        obs.observe(el);
      });
    } else {
      escalaDb.querySelectorAll(".fill-db").forEach(function (f) {
        f.style.width = f.getAttribute("data-largura") + "%";
      });
    }
  }

  /* ---------- Card informativo ---------- */
  function atualizarInfo(cond) {
    document.getElementById("info-icone").innerHTML = ICONE_ORELHA;
    document.getElementById("info-nome").textContent = cond.nome;
    document.getElementById("info-badge").textContent = cond.badge;
    document.getElementById("info-descricao").textContent = cond.descricao;

    document.getElementById("lista-sintomas").innerHTML = cond.sintomas
      .map(function (s) {
        return "<li>" + s + "</li>";
      })
      .join("");
    document.getElementById("lista-tratamentos").innerHTML = cond.tratamentos
      .map(function (t) {
        return "<li>" + t + "</li>";
      })
      .join("");

    document.getElementById("barra-severidade").style.width = cond.severidade * 10 + "%";
    document.getElementById("valor-severidade").textContent = cond.severidade + "/10";
    document.getElementById("barra-prevalencia").style.width = cond.prevalencia + "%";
    document.getElementById("valor-prevalencia").textContent = cond.prevalencia + "%";
    document.getElementById("barra-impacto").style.width = cond.impacto * 10 + "%";
    document.getElementById("valor-impacto").textContent = cond.impacto + "/10";
  }

  function aplicar() {
    var cond = CONDICOES[seletor.value] || CONDICOES.normal;
    atualizarInfo(cond);
    montarAudiograma(cond);
    if (tocando) tocar();
  }

  /* ---------- Eventos ---------- */
  seletor.addEventListener("change", aplicar);
  btnTocar.addEventListener("click", tocar);
  btnParar.addEventListener("click", function () {
    parar();
  });
  volume.addEventListener("input", function () {
    valorVolume.textContent = volume.value + "%";
    if (mestre) {
      var cond = CONDICOES[seletor.value] || CONDICOES.normal;
      mestre.gain.value = ganhoAtual() * cond.filtro.ganho;
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    montarEqualizador();
    montarEscalaDb();
    limparCanvas();
    aplicar();
  });

  // Caso o script rode após o DOMContentLoaded
  if (document.readyState !== "loading") {
    montarEqualizador();
    montarEscalaDb();
    limparCanvas();
    aplicar();
  }
})();
