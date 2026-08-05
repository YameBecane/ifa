/* ============================================================
   visao.js - Página de Visão
   Dropdown, filtros CSS/SVG dinâmicos, card informativo,
   barras de progresso animadas.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Ícones SVG (strings inline, sem emoji) ---------- */
  var ICONES = {
    // Óculos: dois círculos unidos por uma linha
    oculos:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4">' +
      '<circle cx="14" cy="28" r="9"/><circle cx="34" cy="28" r="9"/>' +
      '<path d="M23 28h2M5 22l5-7M43 22l-5-7"/></svg>',
    // Cristalino opaco
    catarata:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4">' +
      '<path d="M4 24c6-9 12-13 20-13s14 4 20 13c-6 9-12 13-20 13S10 33 4 24Z"/>' +
      '<circle cx="24" cy="24" r="7" fill="rgba(200,200,200,0.85)"/></svg>',
    // Íris com listras (daltonismo)
    daltonismo:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4">' +
      '<circle cx="24" cy="24" r="14"/>' +
      '<path d="M14 18h20M14 24h20M14 30h20" stroke-dasharray="4 3"/></svg>',
    // Campo visual reduzido (glaucoma)
    glaucoma:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4">' +
      '<circle cx="24" cy="24" r="17" stroke-dasharray="5 4"/>' +
      '<circle cx="24" cy="24" r="5" fill="currentColor" stroke="none"/></svg>',
    // Mancha central (degeneração macular)
    macular:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4">' +
      '<path d="M4 24c6-9 12-13 20-13s14 4 20 13c-6 9-12 13-20 13S10 33 4 24Z"/>' +
      '<circle cx="24" cy="24" r="6" fill="#111" stroke="none"/></svg>',
    // Raios convergindo atrás da retina (hipermetropia)
    hipermetropia:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4">' +
      '<circle cx="20" cy="24" r="13"/>' +
      '<path d="M33 18l10 6-10 6" stroke-dasharray="3 3"/></svg>',
    // Olho normal
    normal:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4">' +
      '<path d="M4 24c6-9 12-13 20-13s14 4 20 13c-6 9-12 13-20 13S10 33 4 24Z"/>' +
      '<circle cx="24" cy="24" r="6"/></svg>',
  };

  /* ---------- Dados das condições visuais ---------- */
  var CONDICOES = {
    normal: {
      nome: "Visão Normal",
      severidadeTexto: "Referência",
      corBadge: "#dbeafe",
      corTexto: "#1e40af",
      icone: ICONES.normal,
      filtro: "none",
      overlay: null,
      clip: "none",
      descricao:
        "Visão sem alterações refrativas relevantes: a imagem se forma exatamente sobre a retina, " +
        "com nitidez, contraste e percepção de cores preservados. Serve como referência de comparação " +
        "para todas as simulações desta página.",
      sintomas: ["Nenhum sintoma visual relevante", "Boa acuidade para longe e para perto"],
      tratamento: ["Consultas oftalmológicas preventivas", "Proteção solar adequada"],
      severidade: 1,
      prevalencia: 40,
      impacto: 1,
    },
    "miopia-leve": {
      nome: "Miopia Leve (-1.50)",
      severidadeTexto: "Leve",
      corBadge: "#fef3c7",
      corTexto: "#92400e",
      icone: ICONES.oculos,
      filtro: "blur(2px)",
      overlay: null,
      clip: "none",
      descricao:
        "Dificuldade para enxergar objetos distantes. A imagem se forma antes da retina devido ao " +
        "alongamento do globo ocular. Afeta cerca de 30% da população mundial e tem forte componente genético.",
      sintomas: [
        "Dores de cabeça frequentes",
        "Apertar os olhos para ver objetos distantes",
        "Dificuldade para ler placas de trânsito",
        "Franzir a testa constantemente",
        "Sentar muito próximo à TV",
      ],
      tratamento: [
        "Óculos com lentes divergentes",
        "Lentes de contato",
        "Cirurgia refrativa (LASIK/PRK)",
        "Ortoceratologia",
      ],
      severidade: 6,
      prevalencia: 30,
      impacto: 7,
    },
    "miopia-moderada": {
      nome: "Miopia Moderada (-3.50)",
      severidadeTexto: "Moderada",
      corBadge: "#fed7aa",
      corTexto: "#9a3412",
      icone: ICONES.oculos,
      filtro: "blur(5px) brightness(0.9)",
      overlay: null,
      clip: "none",
      descricao:
        "Grau mais elevado de miopia, em que o desfoque para longe é constante e prejudica atividades " +
        "cotidianas como dirigir. A imagem se forma bem antes da retina devido ao alongamento do globo ocular.",
      sintomas: [
        "Dores de cabeça frequentes",
        "Apertar os olhos para ver objetos distantes",
        "Dificuldade para ler placas de trânsito",
        "Franzir a testa constantemente",
        "Sentar muito próximo à TV",
      ],
      tratamento: [
        "Óculos com lentes divergentes",
        "Lentes de contato",
        "Cirurgia refrativa (LASIK/PRK)",
        "Ortoceratologia",
      ],
      severidade: 6,
      prevalencia: 30,
      impacto: 7,
    },
    hipermetropia: {
      nome: "Hipermetropia (+2.00)",
      severidadeTexto: "Leve",
      corBadge: "#fef3c7",
      corTexto: "#92400e",
      icone: ICONES.hipermetropia,
      filtro: "blur(1.5px) contrast(1.1)",
      overlay: null,
      clip: "none",
      descricao:
        "Dificuldade para enxergar objetos próximos. A imagem se forma atrás da retina devido ao " +
        "encurtamento do globo ocular. Comum em crianças, podendo causar estrabismo se não corrigido.",
      sintomas: [
        "Dificuldade para ler de perto",
        "Fadiga ocular",
        "Dores de cabeça ao fazer trabalhos manuais",
        "Ardência nos olhos",
      ],
      tratamento: [
        "Óculos com lentes convergentes",
        "Lentes de contato",
        "Cirurgia refrativa em casos selecionados",
      ],
      severidade: 4,
      prevalencia: 25,
      impacto: 5,
    },
    "catarata-inicial": {
      nome: "Catarata Inicial",
      severidadeTexto: "Moderada",
      corBadge: "#fed7aa",
      corTexto: "#9a3412",
      icone: ICONES.catarata,
      filtro: "blur(1.5px) brightness(0.8) contrast(0.7) saturate(0.5)",
      overlay: null,
      clip: "none",
      descricao:
        "Opacificação progressiva do cristalino, a lente natural do olho. Principal causa de cegueira " +
        "reversível no mundo. Comum no envelhecimento, mas também pode ser congênita ou traumática.",
      sintomas: [
        "Visão embaçada e nublada",
        "Sensibilidade aumentada à luz (fotofobia)",
        "Cores desbotadas e amareladas",
        "Visão dupla em um olho",
        "Dificuldade para dirigir à noite",
      ],
      tratamento: [
        "Cirurgia de facoemulsificação",
        "Implante de lente intraocular",
        "Uso de óculos com proteção UV como prevenção",
      ],
      severidade: 8,
      prevalencia: 17,
      impacto: 9,
    },
    "catarata-avancada": {
      nome: "Catarata Avançada",
      severidadeTexto: "Grave",
      corBadge: "#fee2e2",
      corTexto: "#991b1b",
      icone: ICONES.catarata,
      filtro: "blur(4px) brightness(0.5) contrast(0.4) saturate(0.2) sepia(0.5)",
      overlay: null,
      clip: "none",
      descricao:
        "Estágio avançado da opacificação do cristalino, com perda importante de contraste, brilho e " +
        "cor. É a principal causa de cegueira reversível no mundo e o tratamento cirúrgico é altamente eficaz.",
      sintomas: [
        "Visão embaçada e nublada",
        "Sensibilidade aumentada à luz (fotofobia)",
        "Cores desbotadas e amareladas",
        "Visão dupla em um olho",
        "Dificuldade para dirigir à noite",
      ],
      tratamento: [
        "Cirurgia de facoemulsificação",
        "Implante de lente intraocular",
        "Uso de óculos com proteção UV como prevenção",
      ],
      severidade: 8,
      prevalencia: 17,
      impacto: 9,
    },
    "daltonismo-protanopia": {
      nome: "Daltonismo - Protanopia",
      severidadeTexto: "Leve",
      corBadge: "#fef3c7",
      corTexto: "#92400e",
      icone: ICONES.daltonismo,
      filtro: "url('#protanopia')",
      overlay: null,
      clip: "none",
      descricao:
        "Dificuldade ou incapacidade de distinguir certas cores, principalmente vermelho e verde. " +
        "Condição geralmente genética ligada ao cromossomo X, muito mais comum em homens (8%) do que em mulheres (0.5%).",
      sintomas: [
        "Confusão entre vermelho e verde",
        "Dificuldade com azul e amarelo (casos raros)",
        "Percepção de cores mais apagadas",
        "Dificuldade em identificar frutas maduras",
      ],
      tratamento: [
        "Não tem cura definitiva",
        "Lentes com filtros especiais (EnChroma)",
        "Aplicativos de identificação de cores",
        "Adaptações no ambiente de trabalho",
      ],
      severidade: 4,
      prevalencia: 8,
      impacto: 5,
    },
    "daltonismo-deuteranopia": {
      nome: "Daltonismo - Deuteranopia",
      severidadeTexto: "Leve",
      corBadge: "#fef3c7",
      corTexto: "#92400e",
      icone: ICONES.daltonismo,
      filtro: "url('#deuteranopia')",
      overlay: null,
      clip: "none",
      descricao:
        "Forma de daltonismo em que os cones sensíveis ao verde são ausentes ou disfuncionais. " +
        "É o tipo mais comum e provoca confusão entre tons de verde, vermelho e marrom.",
      sintomas: [
        "Confusão entre vermelho e verde",
        "Dificuldade com azul e amarelo (casos raros)",
        "Percepção de cores mais apagadas",
        "Dificuldade em identificar frutas maduras",
      ],
      tratamento: [
        "Não tem cura definitiva",
        "Lentes com filtros especiais (EnChroma)",
        "Aplicativos de identificação de cores",
        "Adaptações no ambiente de trabalho",
      ],
      severidade: 4,
      prevalencia: 8,
      impacto: 5,
    },
    glaucoma: {
      nome: "Glaucoma (Visão Tubular)",
      severidadeTexto: "Grave",
      corBadge: "#fee2e2",
      corTexto: "#991b1b",
      icone: ICONES.glaucoma,
      filtro: "none",
      overlay: "tunel",
      clip: "circle(40% at 50% 50%)",
      descricao:
        "Doença causada pelo aumento da pressão intraocular que danifica progressivamente o nervo óptico. " +
        "Segunda maior causa de cegueira no mundo. A perda visual é irreversível, começando pela visão " +
        "periférica (visão em túnel).",
      sintomas: [
        "Perda gradual da visão periférica",
        "Visão em túnel em estágios avançados",
        "Dor ocular em casos agudos",
        "Halos ao redor de luzes",
        "Vermelhidão ocular",
      ],
      tratamento: [
        "Colírios para reduzir pressão ocular",
        "Trabeculoplastia a laser",
        "Cirurgia de trabeculectomia",
        "Monitoramento vitalício da pressão ocular",
      ],
      severidade: 9,
      prevalencia: 3,
      impacto: 8,
    },
    "degeneracao-macular": {
      nome: "Degeneração Macular",
      severidadeTexto: "Grave",
      corBadge: "#fee2e2",
      corTexto: "#991b1b",
      icone: ICONES.macular,
      filtro: "blur(3px)",
      overlay: "mancha",
      clip: "none",
      descricao:
        "Deterioração da mácula, região central da retina responsável pela visão de detalhes. Principal " +
        "causa de cegueira em pessoas acima de 50 anos. A visão periférica é preservada, mas a central é perdida.",
      sintomas: [
        "Mancha escura ou vazio no centro da visão",
        "Linhas retas parecem onduladas (metamorfopsia)",
        "Dificuldade para ler e reconhecer rostos",
        "Cores menos vibrantes",
      ],
      tratamento: [
        "Injeções intravítreas de anti-VEGF",
        "Suplementação vitamínica (AREDS2)",
        "Terapia fotodinâmica",
        "Auxílios visuais de magnificação",
      ],
      severidade: 8,
      prevalencia: 8,
      impacto: 9,
    },
  };

  /* ---------- Elementos ---------- */
  var seletor = document.getElementById("seletor-condicao");
  var moldura = document.getElementById("moldura-simulada");
  var cenaOriginal = document.getElementById("cena-normal");
  var tituloSimulada = document.getElementById("titulo-simulada");
  var overlayTunel = document.getElementById("overlay-tunel");
  var overlayMancha = document.getElementById("overlay-mancha");
  var cenaSimulada = null;

  if (!seletor || !moldura || !cenaOriginal) return;

  /* ---------- Clona a cena para o painel simulado ---------- */
  function prepararCenaSimulada() {
    cenaSimulada = cenaOriginal.cloneNode(true);
    cenaSimulada.id = "cena-simulada";
    moldura.insertBefore(cenaSimulada, overlayTunel);
  }

  /* ---------- Aplica filtros na cena simulada ---------- */
  function aplicarSimulacao(chave) {
    var dado = CONDICOES[chave];
    if (!dado || !cenaSimulada) return;

    cenaSimulada.style.filter = dado.filtro;
    cenaSimulada.style.clipPath = dado.clip;
    overlayTunel.classList.toggle("ativo", dado.overlay === "tunel");
    overlayMancha.classList.toggle("ativo", dado.overlay === "mancha");
    tituloSimulada.textContent = dado.nome;
  }

  /* ---------- Preenche o card informativo ---------- */
  function preencherInfo(chave) {
    var dado = CONDICOES[chave];
    if (!dado) return;

    document.getElementById("info-icone").innerHTML = dado.icone;
    document.getElementById("info-nome").textContent = dado.nome;

    var badge = document.getElementById("info-badge");
    badge.textContent = dado.severidadeTexto;
    badge.style.backgroundColor = dado.corBadge;
    badge.style.color = dado.corTexto;

    document.getElementById("info-descricao").textContent = dado.descricao;

    preencherLista("lista-sintomas", dado.sintomas);
    preencherLista("lista-tratamentos", dado.tratamento);

    // Barras animadas (reinicia do zero para animar novamente)
    animarBarra("barra-severidade", "valor-severidade", dado.severidade * 10, dado.severidade + "/10");
    animarBarra("barra-prevalencia", "valor-prevalencia", dado.prevalencia, dado.prevalencia + "%");
    animarBarra("barra-impacto", "valor-impacto", dado.impacto * 10, dado.impacto + "/10");
  }

  function preencherLista(id, itens) {
    var ul = document.getElementById(id);
    ul.innerHTML = "";
    itens.forEach(function (texto) {
      var li = document.createElement("li");
      li.textContent = texto;
      ul.appendChild(li);
    });
  }

  function animarBarra(idBarra, idValor, percentual, rotulo) {
    var barra = document.getElementById(idBarra);
    document.getElementById(idValor).textContent = rotulo;
    barra.style.width = "0%";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        barra.style.width = Math.min(percentual, 100) + "%";
      });
    });
  }

  /* ---------- Inicialização ---------- */
  function atualizar() {
    var chave = seletor.value;
    aplicarSimulacao(chave);
    preencherInfo(chave);
  }

  prepararCenaSimulada();
  seletor.addEventListener("change", atualizar);
  atualizar();
})();
