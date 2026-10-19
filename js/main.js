(function () {
  "use strict";

  /* ===== Menu data ===== */
  const MENU = [
    { cat: "coffee", emoji: "☕", name: "Эспрессо", desc: "Двойной шот, бленд Бразилия + Эфиопия", price: 150 },
    { cat: "coffee", emoji: "☕", name: "Американо", desc: "Эспрессо и горячая вода, 300 мл", price: 190 },
    { cat: "coffee", emoji: "🥛", name: "Капучино", desc: "Плотная молочная пена, 250 / 350 мл", price: 230, featured: true },
    { cat: "coffee", emoji: "🥛", name: "Флэт уайт", desc: "Двойной ристретто и бархатное молоко", price: 260, featured: true },
    { cat: "coffee", emoji: "🥛", name: "Латте", desc: "Нежный и молочный, 350 мл", price: 250 },
    { cat: "coffee", emoji: "🧊", name: "Колд брю", desc: "Холодное заваривание 18 часов", price: 280 },
    { cat: "signature", emoji: "✨", name: "Раф с халвой", desc: "Сливки, подсолнечная халва, щепотка соли", price: 340, tag: "Хит", featured: true },
    { cat: "signature", emoji: "🍊", name: "Бамбл", desc: "Эспрессо, апельсиновый сок и карамель", price: 320 },
    { cat: "signature", emoji: "🍯", name: "Латте лаванда‑мёд", desc: "Цветочный мёд и сироп лаванды", price: 330, tag: "Новинка", featured: true },
    { cat: "signature", emoji: "🌶️", name: "Пряный мокко", desc: "Тёмный шоколад, корица и чили", price: 330 },
    { cat: "tea", emoji: "🍵", name: "Матча латте", desc: "Японская матча на молоке на выбор", price: 310 },
    { cat: "tea", emoji: "🫖", name: "Чай листовой", desc: "Сенча, ассам, улун или травяной, 500 мл", price: 240 },
    { cat: "tea", emoji: "🍫", name: "Горячий шоколад", desc: "Бельгийский шоколад 54%", price: 290 },
    { cat: "tea", emoji: "☕", name: "Какао", desc: "На молоке, с маршмеллоу, 300 мл", price: 240 },
    { cat: "tea", emoji: "🍋", name: "Лимонад дня", desc: "Спросите у бариста, какой сегодня", price: 260 },
    { cat: "food", emoji: "🥐", name: "Круассан", desc: "Классический, на французском масле", price: 180, featured: true },
    { cat: "food", emoji: "🥐", name: "Миндальный круассан", desc: "С франжипаном и миндальными лепестками", price: 240 },
    { cat: "food", emoji: "🍰", name: "Чизкейк Сан‑Себастьян", desc: "Карамельная корочка, кремовый центр", price: 320, tag: "Хит", featured: true },
    { cat: "food", emoji: "🌀", name: "Синнабон", desc: "С корицей и сливочным крем‑чизом", price: 220 }
  ];

  const formatPrice = (n) => n.toLocaleString("ru-RU") + " ₽";

  /* ===== Custom events: Rambler Top-100 + MyTracker goals ===== */
  const MYTRACKER_ID = "3804408";

  function trackEvent(name, data) {
    try {
      if (window.top100Counter) window.top100Counter.trackEvent(name, data || {});
    } catch (e) {}
    try {
      (window._tmr = window._tmr || []).push({ id: MYTRACKER_ID, type: "reachGoal", goal: name });
    } catch (e) {}
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="tel:"]');
    if (link) trackEvent("phone_click", { page: location.pathname });
  });

  /* ===== Render menu ===== */
  const grid = document.getElementById("menuGrid");

  function renderMenu(filter) {
    const items =
      filter === "all" ? MENU : filter === "featured" ? MENU.filter((i) => i.featured) : MENU.filter((i) => i.cat === filter);
    grid.innerHTML = items
      .map(
        (item, idx) => `
        <li class="menu-item" style="animation-delay:${idx * 40}ms">
          <span class="menu-item__emoji" aria-hidden="true">${item.emoji}</span>
          <div class="menu-item__body">
            <div class="menu-item__top">
              <span class="menu-item__name">${item.name}${item.tag ? `<span class="menu-item__tag">${item.tag}</span>` : ""}</span>
              <span class="menu-item__dots" aria-hidden="true"></span>
              <span class="menu-item__price">${formatPrice(item.price)}</span>
            </div>
            <p class="menu-item__desc">${item.desc}</p>
          </div>
        </li>`
      )
      .join("");
  }

  const tabs = document.querySelectorAll(".tabs__btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      renderMenu(tab.dataset.filter);
      trackEvent("menu_category", { category: tab.dataset.filter });
    });
  });

  if (grid) renderMenu(grid.hasAttribute("data-featured") ? "featured" : "all");

  /* ===== Header: scroll state ===== */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ===== Mobile navigation ===== */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("no-scroll", open);
  }

  burger.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860 && nav.classList.contains("is-open")) setNav(false);
  });

  if ("IntersectionObserver" in window) {
    /* ===== Reveal on scroll ===== */
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* ===== Feedback form (contacts page) ===== */
  const form = document.getElementById("feedback");
  const phone = document.getElementById("phone");

  if (form && phone) {
    /* ===== Phone mask ===== */
    phone.addEventListener("input", () => {
      let digits = phone.value.replace(/\D/g, "");
      if (!digits) {
        phone.value = "";
        return;
      }
      if (digits[0] === "8") digits = "7" + digits.slice(1);
      if (digits[0] !== "7") digits = "7" + digits;
      digits = digits.slice(0, 11);

      let out = "+7";
      if (digits.length > 1) out += " (" + digits.slice(1, 4);
      if (digits.length >= 4) out += ")";
      if (digits.length > 4) out += " " + digits.slice(4, 7);
      if (digits.length > 7) out += "-" + digits.slice(7, 9);
      if (digits.length > 9) out += "-" + digits.slice(9, 11);
      phone.value = out;
    });

    /* ===== Feedback form ===== */
    const status = document.getElementById("formStatus");
    const submitBtn = form.querySelector('button[type="submit"]');
    const agree = document.getElementById("agree");
    const agreeError = form.querySelector(".form__error--check");

    const validators = {
      name: (v) => (v.trim().length < 2 ? "Введите имя (минимум 2 символа)" : ""),
      email: (v) =>
        !v.trim()
          ? "Укажите e‑mail"
          : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
          ? "Проверьте формат e‑mail"
          : "",
      phone: (v) => (v && v.replace(/\D/g, "").length !== 11 ? "Введите номер полностью" : ""),
      message: (v) => (v.trim().length < 10 ? "Сообщение слишком короткое (минимум 10 символов)" : "")
    };

    function validateField(field) {
      const check = validators[field.name];
      if (!check) return true;
      const msg = check(field.value);
      field.classList.toggle("is-invalid", Boolean(msg));
      field.setAttribute("aria-invalid", String(Boolean(msg)));
      const errorEl = field.parentElement.querySelector(".form__error");
      if (errorEl) errorEl.textContent = msg;
      return !msg;
    }

    function validateAgree() {
      agreeError.textContent = agree.checked ? "" : "Необходимо согласие";
      return agree.checked;
    }

    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.classList.contains("is-invalid")) validateField(field);
      });
    });
    agree.addEventListener("change", validateAgree);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = "";
      status.className = "form__status";

      const fieldsOk = Object.keys(validators)
        .map((name) => validateField(form.elements[name]))
        .every(Boolean);
      const agreeOk = validateAgree();

      if (!fieldsOk || !agreeOk) {
        status.textContent = "Пожалуйста, исправьте ошибки в форме.";
        status.classList.add("is-error");
        const firstInvalid = form.querySelector(".is-invalid") || (!agreeOk && agree);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправляем…";

      // Имитация запроса к серверу. Замените на fetch() к вашему API.
      setTimeout(() => {
        console.info("Feedback submitted:", data);
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить";
        status.textContent = `Спасибо, ${data.name.trim()}! Мы ответим на ${data.email.trim()} в течение дня.`;
        status.classList.add("is-success");
        trackEvent("feedback_form_sent", { topic: data.topic });
        form.reset();
      }, 900);
    });
  }

  /* ===== Footer year ===== */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
