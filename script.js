/* ===================================================================
   PISTOLA'S HOT DOG — script.js
   Organizado em módulos/funções reutilizáveis.
   Preparado para futura integração com backend (ver seção API no final).
   =================================================================== */

(function () {
  "use strict";

  /* =================================================================
     1. DADOS DOS PRODUTOS (fonte única de verdade)
     Adicionar dados aqui para que sejam refletidos em toda a aplicação (cards, carrinho, resumo do pedido, mensagem do WhatsApp).
     ================================================================= */
  const PRODUCTS = {
    tradicionais: [
      {
        id: "trad-simples",
        nome: "Simples",
        preco: 14.0,
        emoji: "🌭",
        descricao: "01 salsicha, tomate, milho, muçarela, molho e batata palha.",
      },
      {
        id: "trad-especial",
        nome: "Especial",
        preco: 15.0,
        emoji: "🌭",
        descricao: "02 salsichas, tomate, milho, muçarela, molho e batata palha.",
      },
      {
        id: "trad-frango",
        nome: "Frango",
        preco: 16.0,
        emoji: "🌭",
        descricao: "Frango desfiado, tomate, milho, muçarela, molho e batata palha.",
      },
    ],
    especiais: [
      {
        id: "esp-pistola",
        nome: "Pistola",
        preco: 16.0,
        emoji: "🔥",
        destaque: "+1 adicional grátis",
        descricao:
          "02 salsichas, frango desfiado, tomate, milho, muçarela, molho e batata palha. +1 adicional grátis (exceto salsicha).",
      },
      {
        id: "esp-defumado",
        nome: "Pistola Defumado",
        preco: 17.0,
        emoji: "💨",
        destaque: "Carro-chefe da casa",
        descricao:
          "02 salsichas, frango defumado artesanal, cream cheese, tomate, milho, muçarela, molho e batata palha.",
      },
      {
        id: "esp-cheddarbacon",
        nome: "Cheddar Bacon",
        preco: 18.0,
        emoji: "🧀",
        descricao:
          "02 salsichas, cheddar, tomate, bacon, milho, muçarela, molho e batata palha.",
      },
    ],
    prensados: [
      {
        id: "pren-barbecue",
        nome: "Prensado Barbecue",
        preco: 22.0,
        emoji: "🥖",
        descricao:
          "Pão de 20 cm, frango defumado, molho barbecue, cebola roxa, molho misto, presunto, muçarela, 02 salsichas e maionese.",
      },
      {
        id: "pren-4queijos",
        nome: "Prensado 4 Queijos",
        preco: 24.0,
        emoji: "🥖",
        descricao:
          "Pão de 20 cm, dobro de muçarela, provolone, parmesão, requeijão, orégano, molho misto, 02 salsichas e maionese.",
      },
      {
        id: "pren-frangobacon",
        nome: "Prensado Frango Bacon",
        preco: 26.0,
        emoji: "🥖",
        descricao:
          "Pão de 20 cm, frango desfiado, bacon, cebola roxa, molho misto, presunto, muçarela, 02 salsichas e maionese.",
      },
    ],
    bebidas: [
      { id: "beb-aguasem", nome: "Água sem gás", preco: 3.0, emoji: "💧", descricao: "Água mineral sem gás, gelada." },
      { id: "beb-aguacom", nome: "Água com gás", preco: 4.0, emoji: "💧", descricao: "Água mineral com gás, gelada." },
      { id: "beb-refrilata", nome: "Refrigerante lata", preco: 6.0, emoji: "🥤", descricao: "Lata 350ml gelada." },
      { id: "beb-refri1l", nome: "Refrigerante 1L", preco: 8.0, emoji: "🥤", descricao: "Garrafa 1 litro." },
      { id: "beb-refri15l", nome: "Refrigerante 1,5L", preco: 10.0, emoji: "🥤", descricao: "Garrafa 1,5 litro." },
    ],
    adicionais: [
      { id: "add-bacon", nome: "Bacon", preco: 5.0, emoji: "🥓", descricao: "Porção extra de bacon." },
      { id: "add-frangodesf", nome: "Frango desfiado", preco: 5.0, emoji: "🍗", descricao: "Porção extra de frango desfiado." },
      { id: "add-frangodefum", nome: "Frango defumado", preco: 5.0, emoji: "🍗", descricao: "Porção extra de frango defumado artesanal." },
      { id: "add-frios", nome: "Frios", preco: 5.0, emoji: "🧈", descricao: "Porção extra de frios (presunto)." },
      { id: "add-creamcheese", nome: "Cream Cheese", preco: 3.0, emoji: "🧀", descricao: "Porção extra de cream cheese." },
      { id: "add-cheddar", nome: "Cheddar", preco: 3.0, emoji: "🧀", descricao: "Porção extra de cheddar cremoso." },
      { id: "add-salsicha", nome: "Salsicha", preco: 3.0, emoji: "🌭", descricao: "Salsicha extra." },
    ],
  };

  const STORE_INFO = {
    nome: "Pistola's Hot Dog",
    whatsapp: "5566981360539", // formato internacional sem símbolos
    endereco: "Rua Presidente Vargas, 1203 - Centro, Barra do Garças - MT",
  };

  /* =================================================================
     2. ESTADO DO CARRINHO
     ================================================================= */
  let cart = []; // [{ id, nome, preco, emoji, quantidade }]

  /* =================================================================
     3. HELPERS
     ================================================================= */
  function formatPrice(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function findProductById(id) {
    for (const categoria in PRODUCTS) {
      const found = PRODUCTS[categoria].find((p) => p.id === id);
      if (found) return found;
    }
    return null;
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantidade, 0);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  /* =================================================================
     4. RENDERIZAÇÃO DOS PRODUTOS (cards estilo "comanda") para ficar visualmente mais interessante e facilitar futuras adições de campos (ex: ingredientes, tags, etc) sem quebrar layout.
     ================================================================= */
  function renderProductCard(product, isSpecial) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="product-thumb ${isSpecial ? "is-special" : ""}" aria-hidden="true">
        <span>${product.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-top">
          <h3 class="product-name">${product.nome}</h3>
          <span class="product-price">${formatPrice(product.preco)}</span>
        </div>
        ${product.destaque ? `<span class="product-tag">★ ${product.destaque}</span>` : ""}
        <p class="product-desc">${product.descricao}</p>
        <div class="product-bottom">
          <button class="add-btn" type="button" aria-label="Adicionar ${product.nome}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Clique no card abre modal de personalização (quantidade);
    // clique direto no botão "+" adiciona rápido (1 unidade) com feedback.
    const addBtn = card.querySelector(".add-btn");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product.id, 1);
      addBtn.classList.remove("is-pop");
      void addBtn.offsetWidth; // reflow para reiniciar animação
      addBtn.classList.add("is-pop");
      showToast(`${product.nome} adicionado!`);
    });

    card.addEventListener("click", () => openProductModal(product, isSpecial));

    return card;
  }

  function renderAllProducts() {
    const mapping = [
      { key: "tradicionais", gridId: "grid-tradicionais", special: false },
      { key: "especiais", gridId: "grid-especiais", special: true },
      { key: "prensados", gridId: "grid-prensados", special: false },
      { key: "bebidas", gridId: "grid-bebidas", special: false },
      { key: "adicionais", gridId: "grid-adicionais", special: false },
    ];

    mapping.forEach(({ key, gridId, special }) => {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      const fragment = document.createDocumentFragment();
      PRODUCTS[key].forEach((product, index) => {
        const card = renderProductCard(product, special);
        card.style.animationDelay = `${Math.min(index * 0.06, 0.3)}s`;
        fragment.appendChild(card);
      });
      grid.appendChild(fragment);
    });
  }

  /* =================================================================
     5. MODAL DE PERSONALIZAÇÃO DO PRODUTO (quantidade)
     ================================================================= */
  let activeProductModalQty = 1;
  let activeProductModalProduct = null;

  function openProductModal(product, isSpecial) {
    activeProductModalProduct = product;
    activeProductModalQty = 1;

    qs("#product-modal-title").textContent = product.nome;
    const body = qs("#product-modal-body");
    body.innerHTML = `
      <div class="product-modal-hero ${isSpecial ? "is-special" : ""}">${product.emoji}</div>
      <div class="product-modal-content">
        <p class="product-desc">${product.descricao}</p>
        <div class="product-modal-price">${formatPrice(product.preco)}</div>
        <div class="qty-selector">
          <button class="qty-btn" id="pm-qty-minus" type="button" aria-label="Diminuir quantidade">−</button>
          <span class="qty-value" id="pm-qty-value">1</span>
          <button class="qty-btn" id="pm-qty-plus" type="button" aria-label="Aumentar quantidade">+</button>
        </div>
        <button class="btn btn-primary btn-block" id="pm-add-btn" type="button">
          Adicionar · ${formatPrice(product.preco)}
        </button>
      </div>
    `;

    qs("#pm-qty-minus").addEventListener("click", () => updateModalQty(-1));
    qs("#pm-qty-plus").addEventListener("click", () => updateModalQty(1));
    qs("#pm-add-btn").addEventListener("click", () => {
      addToCart(product.id, activeProductModalQty);
      showToast(`${product.nome} adicionado!`);
      closeProductModal();
    });

    toggleOverlay("#product-modal-overlay", true);
  }

  function updateModalQty(delta) {
    activeProductModalQty = Math.max(1, activeProductModalQty + delta);
    qs("#pm-qty-value").textContent = activeProductModalQty;
    const total = activeProductModalProduct.preco * activeProductModalQty;
    qs("#pm-add-btn").textContent = `Adicionar · ${formatPrice(total)}`;
  }

  function closeProductModal() {
    toggleOverlay("#product-modal-overlay", false);
  }

  /* =================================================================
     6. CARRINHO — lógica
     ================================================================= */
  function addToCart(productId, quantidade) {
    const product = findProductById(productId);
    if (!product) return;

    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantidade += quantidade;
    } else {
      cart.push({
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        emoji: product.emoji,
        quantidade: quantidade,
      });
    }
    renderCart();
  }

  function updateCartItemQty(productId, delta) {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      removeFromCart(productId);
      return;
    }
    renderCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter((i) => i.id !== productId);
    renderCart();
  }

  function renderCart() {
    const body = qs("#cart-drawer-body");
    const emptyState = qs("#cart-empty");
    const footer = qs("#cart-drawer-footer");
    const count = getCartCount();
    const total = getCartTotal();

    // limpa itens renderizados (mantém o empty state como template)
    body.querySelectorAll(".cart-item").forEach((el) => el.remove());

    if (cart.length === 0) {
      emptyState.style.display = "block";
      footer.style.display = "none";
    } else {
      emptyState.style.display = "none";
      footer.style.display = "block";

      const fragment = document.createDocumentFragment();
      cart.forEach((item) => {
        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
          <div class="cart-item-thumb" aria-hidden="true">${item.emoji}</div>
          <div class="cart-item-info">
            <p class="cart-item-name">${item.nome}</p>
            <p class="cart-item-unit">${formatPrice(item.preco)} / un.</p>
            <div class="cart-item-controls">
              <button class="qty-btn" data-action="minus" data-id="${item.id}" aria-label="Diminuir">−</button>
              <span class="qty-value">${item.quantidade}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}" aria-label="Aumentar">+</button>
              <button class="cart-item-remove" data-action="remove" data-id="${item.id}">remover</button>
            </div>
          </div>
          <div class="cart-item-right">
            <span class="cart-item-total">${formatPrice(item.preco * item.quantidade)}</span>
          </div>
        `;
        fragment.appendChild(el);
      });
      body.appendChild(fragment);
    }

    // listeners dos controles de quantidade (delegação simplificada pós-render)
    body.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if (action === "plus") updateCartItemQty(id, 1);
        if (action === "minus") updateCartItemQty(id, -1);
        if (action === "remove") removeFromCart(id);
      });
    });

    // totais
    qs("#cart-subtotal").textContent = formatPrice(total);
    qs("#cart-total").textContent = formatPrice(total);
    qs("#cart-badge-nav").textContent = count;
    qs("#cart-bar-count").textContent = count;
    qs("#cart-bar-total").textContent = formatPrice(total);

    // mostra/esconde barra flutuante
    const cartBar = qs("#cart-bar");
    if (count > 0) {
      cartBar.classList.add("is-visible");
    } else {
      cartBar.classList.remove("is-visible");
      // se carrinho esvaziar com drawer aberto, mantemos aberto mostrando estado vazio para evitar sensação de "quebra" (drawer fecha → abre vazio), mas se for fechado manualmente, aí sim fecha de vez.
    }
  }

  /* =================================================================
     7. DRAWER DO CARRINHO (abrir/fechar) fica mais fluida e elegante com overlay que bloqueia interação com o fundo e impede scroll, além de dar foco ao carrinho. A função toggleOverlay é genérica para ser reutilizada em outros modais/overlays.
     ================================================================= */
  function toggleOverlay(overlaySelector, show) {
    const overlay = qs(overlaySelector);
    if (!overlay) return;
    if (show) {
      overlay.classList.add("is-visible");
      document.body.style.overflow = "hidden";
    } else {
      overlay.classList.remove("is-visible");
      if (!anyOverlayOpen()) document.body.style.overflow = "";
    }
  }

  function anyOverlayOpen() {
    return (
      qs("#cart-overlay").classList.contains("is-visible") ||
      qs("#modal-overlay").classList.contains("is-visible") ||
      qs("#product-modal-overlay").classList.contains("is-visible")
    );
  }

  function openCart() {
    qs("#cart-drawer").classList.add("is-open");
    toggleOverlay("#cart-overlay", true);
  }

  function closeCart() {
    qs("#cart-drawer").classList.remove("is-open");
    toggleOverlay("#cart-overlay", false);
  }

  /* =================================================================
     8. TOAST
     ================================================================= */
  let toastTimeout = null;
  function showToast(message) {
    const toast = qs("#toast");
    qs("#toast-message").textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  /* =================================================================
     9. MODAL DE CHECKOUT
     ================================================================= */
  function openCheckoutModal() {
    if (cart.length === 0) {
      showToast("Seu carrinho está vazio!");
      return;
    }
    renderOrderSummary();
    toggleOverlay("#modal-overlay", true);
    closeCart();
  }

  function closeCheckoutModal() {
    toggleOverlay("#modal-overlay", false);
  }

  function renderOrderSummary() {
    const container = qs("#modal-order-summary");
    const total = getCartTotal();
    let html = "";
    cart.forEach((item) => {
      html += `
        <div class="modal-order-summary-row">
          <span>${item.quantidade}x ${item.nome}</span>
          <span>${formatPrice(item.preco * item.quantidade)}</span>
        </div>`;
    });
    html += `
      <div class="modal-order-summary-total">
        <span>Total</span>
        <span>${formatPrice(total)}</span>
      </div>`;
    container.innerHTML = html;
  }

  /* =================================================================
     10. GERAÇÃO DA MENSAGEM E ENVIO PARA O WHATSAPP
     ================================================================= */
  function buildWhatsAppMessage(formData) {
    const lines = [];
    lines.push(`🍔 *NOVO PEDIDO - ${STORE_INFO.nome.toUpperCase()}*`);
    lines.push("");
    lines.push(`👤 Cliente: ${formData.nome}`);
    lines.push("");
    lines.push("📍 Endereço:");
    lines.push(`${formData.endereco}, nº ${formData.numero}`);
    lines.push(`Bairro ${formData.bairro}`);
    if (formData.referencia) {
      lines.push(`Referência: ${formData.referencia}`);
    }
    lines.push("");
    lines.push("📞 Telefone:");
    lines.push(formData.telefone);
    lines.push("");
    lines.push("🛒 Pedido:");
    lines.push("");
    cart.forEach((item) => {
      lines.push(`${item.quantidade}x ${item.nome} - ${formatPrice(item.preco * item.quantidade)}`);
    });
    lines.push("");
    lines.push(`💰 Total: ${formatPrice(getCartTotal())}`);
    lines.push("");
    let pagamentoLine = `Pagamento: ${formData.pagamento}`;
    if (formData.pagamento === "Dinheiro" && formData.troco) {
      pagamentoLine += ` (Troco para ${formData.troco})`;
    }
    lines.push(pagamentoLine);

    if (formData.observacoes) {
      lines.push("");
      lines.push("Observações:");
      lines.push(formData.observacoes);
    }

    lines.push("");
    lines.push("Obrigado pela preferência!");

    return lines.join("\n");
  }

  function sendOrderToWhatsApp(formData) {
    const message = buildWhatsAppMessage(formData);
    const url = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  }

  function handleCheckoutSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {
      nome: form.nome.value.trim(),
      telefone: form.telefone.value.trim(),
      endereco: form.endereco.value.trim(),
      numero: form.numero.value.trim(),
      bairro: form.bairro.value.trim(),
      referencia: form.referencia.value.trim(),
      pagamento: form.pagamento.value,
      troco: form.troco.value.trim(),
      observacoes: form.observacoes.value.trim(),
    };

    sendOrderToWhatsApp(formData);

    // limpa carrinho e fecha modal após envio
    cart = [];
    renderCart();
    closeCheckoutModal();
    form.reset();
    qs("#troco-group").hidden = true;
    showToast("Pedido enviado! 🎉");
  }

  /* =================================================================
     11. NAVBAR — scroll state + hot-dog menu
     ================================================================= */
  function initNavbarScroll() {
    const navbar = qs("#navbar");
    window.addEventListener(
      "scroll",
      () => {
        navbar.classList.toggle("is-scrolled", window.scrollY > 12);
      },
      { passive: true }
    );
  }

  function initHamburgerMenu() {
    const btn = qs("#hamburger-btn");
    const overlay = qs("#mobile-menu-overlay");

    btn.addEventListener("click", () => {
      const isOpen = overlay.classList.toggle("is-open");
      btn.classList.toggle("is-active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    overlay.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        overlay.classList.remove("is-open");
        btn.classList.remove("is-active");
        document.body.style.overflow = "";
      });
    });
  }

  /* =================================================================
     12. FORMA DE PAGAMENTO — exibir campo de troco condicionalmente
     ================================================================= */
  function initPaymentToggle() {
    const radios = document.querySelectorAll('input[name="pagamento"]');
    const trocoGroup = qs("#troco-group");
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        trocoGroup.hidden = radio.value !== "Dinheiro";
      });
    });
  }

  /* =================================================================
     13. LOADING SCREEN
     ================================================================= */
  function initLoadingScreen() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        qs("#loading-screen").classList.add("is-hidden");
      }, 700);
    });
    // fallback caso 'load' demore (assets externos lentos)
    setTimeout(() => {
      qs("#loading-screen").classList.add("is-hidden");
    }, 2500);
  }

  /* =================================================================
     14. BIND DE EVENTOS GERAIS
     ================================================================= */
  function bindEvents() {
    qs("#open-cart-btn").addEventListener("click", openCart);
    qs("#cart-bar-btn").addEventListener("click", openCart);
    qs("#close-cart-btn").addEventListener("click", closeCart);
    qs("#cart-overlay").addEventListener("click", closeCart);

    qs("#checkout-btn").addEventListener("click", openCheckoutModal);
    qs("#close-modal-btn").addEventListener("click", closeCheckoutModal);
    qs("#modal-overlay").addEventListener("click", (e) => {
      if (e.target.id === "modal-overlay") closeCheckoutModal();
    });
    qs("#checkout-form").addEventListener("submit", handleCheckoutSubmit);

    qs("#close-product-modal-btn").addEventListener("click", closeProductModal);
    qs("#product-modal-overlay").addEventListener("click", (e) => {
      if (e.target.id === "product-modal-overlay") closeProductModal();
    });

    // fechar modais com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      closeCheckoutModal();
      closeProductModal();
      closeCart();
    });

    qs("#year").textContent = new Date().getFullYear();
  }

  /* =================================================================
     15. INIT
     ================================================================= */
  function init() {
    initLoadingScreen();
    renderAllProducts();
    renderCart();
    bindEvents();
    initNavbarScroll();
    initHamburgerMenu();
    initPaymentToggle();
  }

  document.addEventListener("DOMContentLoaded", init);

  /* =================================================================
     16. PREPARAÇÃO PARA BACKEND FUTURO
     ---------------------------------------------------------------
     Quando houver uma API, vamos fazer as seguintes alterações:
     1) Substituir o objeto PRODUCTS por uma chamada assíncrona:
          async function loadProducts() {
            const res = await fetch('/api/produtos');
            return await res.json();
          }
     2) Persistir o carrinho via endpoint (ex: POST /api/pedidos)
        dentro de handleCheckoutSubmit, antes ou no lugar do envio
        direto ao WhatsApp.
     3) Os nomes de função (addToCart, renderCart, buildWhatsAppMessage,
        etc.) já estão isolados e podem ser reaproveitados sem
        alterar a estrutura do HTML/CSS.
        Apostar em uma arquitetura modular e funções reutilizáveis desde o início facilita muito a integração futura com backend, pois a lógica de negócios (carrinho, produtos, mensagem) está desacoplada da camada de apresentação (renderização, modais, etc).
     4) Para o envio do pedido, podemos criar uma função sendOrderToBackend(formData) que faz a requisição para a API, e dentro dela, após receber a confirmação do backend, chamar sendOrderToWhatsApp(formData) para manter o fluxo atual de mensagem ao cliente.
     Incluir a possibilidade de uma integração no pós-venda (ex: acompanhamento do pedido via WhatsApp) também pode ser um diferencial interessante para o cliente, e a estrutura atual já facilita essa extensão futura.
     ================================================================= */
})();