/* =========================================================
   NOBLE CUT — script.js
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     CONFIGURAÇÃO — edite aqui o número de WhatsApp da barbearia
     Formato: código do país + DDD + número, apenas dígitos.
     Este é um número FICTÍCIO, criado apenas para demonstração.
  --------------------------------------------------------- */
  const WHATSAPP_NUMBER = "5521999999999";

  /* ---------------------------------------------------------
     Menu mobile
  --------------------------------------------------------- */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", toggleMenu);

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* ---------------------------------------------------------
     Navegação suave (fallback para navegadores sem
     suporte a scroll-behavior: smooth via CSS)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---------------------------------------------------------
     Revelação suave das seções ao rolar a página
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    ".service-row, .team-card, .review, .gallery-item"
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------------------------------------------------------
     Agendamento — seleção de opções
  --------------------------------------------------------- */
  const bookingForm = document.getElementById("booking-form");
  const bookingPreview = document.getElementById("booking-preview");

  const selection = {
    servico: null,
    profissional: null,
    periodo: null,
  };

  function updatePreview() {
    const partes = [];
    if (selection.servico) partes.push("Serviço: " + selection.servico);
    if (selection.profissional) partes.push("Profissional: " + selection.profissional);
    if (selection.periodo) partes.push("Período: " + selection.periodo);

    if (partes.length === 0) {
      bookingPreview.textContent = "Selecione as opções acima para montar sua mensagem.";
      return;
    }

    bookingPreview.innerHTML =
      "<strong>Sua mensagem:</strong><br>" +
      "Olá! Gostaria de agendar um horário na Noble Cut. " +
      partes.join(". ") + ".";
  }

  if (bookingForm) {
    bookingForm.querySelectorAll(".option-group").forEach(function (group) {
      const groupName = group.getAttribute("data-group");

      group.querySelectorAll(".option").forEach(function (button) {
        button.addEventListener("click", function () {
          group.querySelectorAll(".option").forEach(function (btn) {
            btn.classList.remove("is-selected");
            btn.setAttribute("aria-pressed", "false");
          });

          button.classList.add("is-selected");
          button.setAttribute("aria-pressed", "true");

          selection[groupName] = button.getAttribute("data-value");
          updatePreview();
        });
      });
    });

    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendToWhatsApp(selection.servico, selection.profissional, selection.periodo);
    });
  }

  /* ---------------------------------------------------------
     Agendamento — botões "Agendar" nos serviços
  --------------------------------------------------------- */
  document.querySelectorAll(".service-book").forEach(function (button) {
    button.addEventListener("click", function () {
      const servico = button.getAttribute("data-service");
      sendToWhatsApp(servico, null, null);
    });
  });

  /* ---------------------------------------------------------
     Monta a mensagem e abre o WhatsApp
  --------------------------------------------------------- */
  function sendToWhatsApp(servico, profissional, periodo) {
    let mensagem = "Olá! Gostaria de agendar um horário na Noble Cut.";

    if (servico) mensagem += " Serviço: " + servico + ".";
    if (profissional) mensagem += " Profissional: " + profissional + ".";
    if (periodo) mensagem += " Período: " + periodo + ".";

    const url =
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensagem);

    window.open(url, "_blank", "noopener");
  }

  /* ---------------------------------------------------------
     Ano automático no copyright
  --------------------------------------------------------- */
  const anoAtual = document.getElementById("ano-atual");
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }
})();
