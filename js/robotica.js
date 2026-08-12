document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".carousel-card");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const dotsContainer = document.getElementById("carousel-dots");
    
    let currentIndex = 0;
    let autoplayTimer = null;
  
    // Criar os Dots dinamicamente
    cards.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  
    const dots = document.querySelectorAll(".dot");
  
    function updateCarousel() {
      cards.forEach((card, index) => {
        card.classList.remove("active", "prev", "next", "hidden");
  
        if (index === currentIndex) {
          card.classList.add("active");
        } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
          card.classList.add("prev");
        } else if (index === (currentIndex + 1) % cards.length) {
          card.classList.add("next");
        } else {
          card.classList.add("hidden");
        }
      });
  
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }
  
    function nextSlide() {
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    }
  
    function prevSlide() {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    }
  
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
      resetAutoplay();
    }
  
    // Eventos dos Botões
    btnNext.addEventListener("click", () => {
      nextSlide();
      resetAutoplay();
    });
  
    btnPrev.addEventListener("click", () => {
      prevSlide();
      resetAutoplay();
    });
  
    // Clique direto nos cards laterais
    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (card.classList.contains("prev") || card.classList.contains("next")) {
          goToSlide(index);
        }
      });
    });
  
    // Autoplay Automático
    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 50000);
    }
  
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }
  
    // Pausar ao passar o rato por cima
    const wrapper = document.querySelector(".carousel-wrapper");
    wrapper.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
    wrapper.addEventListener("mouseleave", startAutoplay);
  
    // Navegação por Teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    });
  
    // Suporte a Touch / Swipe (Telemóvel)
    let startX = 0;
    wrapper.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
    wrapper.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      if (endX - startX > 50) prevSlide();
    });
  
    // Iniciar
    updateCarousel();
    startAutoplay();
  });