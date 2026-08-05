/* ============================================================
   main.js - JavaScript global
   Header fixo, link ativo, menu mobile, scroll suave,
   botão voltar ao topo e Intersection Observer de reveal.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Menu mobile (hamburguer) ---------- */
  function iniciarMenuMobile() {
    var botao = document.querySelector(".btn-menu");
    var nav = document.querySelector(".nav-principal");
    if (!botao || !nav) return;

    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      botao.classList.toggle("aberto", aberto);
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });

    // Fecha o menu ao clicar em um link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("aberto");
        botao.classList.remove("aberto");
        botao.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Marca o link da página atual como ativo ---------- */
  function marcarLinkAtivo() {
    var atual = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-list a").forEach(function (link) {
      var alvo = link.getAttribute("href");
      if (alvo === atual) {
        link.classList.add("ativo");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Scroll suave para elementos com data-scroll ---------- */
  function iniciarScrollSuave() {
    document.querySelectorAll("[data-scroll]").forEach(function (gatilho) {
      gatilho.addEventListener("click", function (evento) {
        evento.preventDefault();
        var destino = document.querySelector(gatilho.getAttribute("data-scroll"));
        if (!destino) return;
        var topo = destino.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: topo, behavior: "smooth" });
      });
    });
  }

  /* ---------- Botão voltar ao topo ---------- */
  function iniciarBotaoTopo() {
    var botao = document.querySelector(".btn-topo");
    if (!botao) return;

    function verificar() {
      botao.classList.toggle("mostrar", window.pageYOffset > 500);
    }

    window.addEventListener("scroll", verificar, { passive: true });
    verificar();

    botao.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Intersection Observer: reveal + barras + números ---------- */
  function iniciarObservador() {
    var alvos = document.querySelectorAll(".reveal, [data-contador], [data-barra]");
    if (!alvos.length) return;

    if (!("IntersectionObserver" in window)) {
      alvos.forEach(function (el) {
        el.classList.add("visivel");
      });
      return;
    }

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          var el = entrada.target;
          el.classList.add("visivel");

          if (el.hasAttribute("data-contador")) {
            animarNumero(el);
          }
          if (el.hasAttribute("data-barra")) {
            el.style.width = el.getAttribute("data-barra") + "%";
          }
          observador.unobserve(el);
        });
      },
      { threshold: 0.18 }
    );

    alvos.forEach(function (el) {
      observador.observe(el);
    });
  }

  /* ---------- Animação de contagem de números ---------- */
  function animarNumero(el) {
    var alvo = parseFloat(el.getAttribute("data-contador"));
    var decimais = parseInt(el.getAttribute("data-decimais") || "0", 10);
    var sufixo = el.getAttribute("data-sufixo") || "";
    var duracao = 1600;
    var inicio = null;

    function passo(agora) {
      if (inicio === null) inicio = agora;
      var progresso = Math.min((agora - inicio) / duracao, 1);
      // Easing out cubic
      var eased = 1 - Math.pow(1 - progresso, 3);
      el.textContent = (alvo * eased).toFixed(decimais) + sufixo;
      if (progresso < 1) requestAnimationFrame(passo);
    }

    requestAnimationFrame(passo);
  }

  // Expõe utilitários usados pelas páginas
  window.SentidosHumanos = {
    animarNumero: animarNumero,
    observar: iniciarObservador,
  };

  document.addEventListener("DOMContentLoaded", function () {
    iniciarMenuMobile();
    marcarLinkAtivo();
    iniciarScrollSuave();
    iniciarBotaoTopo();
    iniciarObservador();
  });
})();
