(function () {
  "use strict";

  const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
  const HOME_SECTION_LINKS = {
    features: "../pages/home.html#features",
    pricing: "../pages/home.html#pricing",
    testimonials: "../pages/home.html#testimonials",
    about: "../pages/home.html#overview",
  };
  const NAV_LINKS = [
    { label: "Pricing", href: HOME_SECTION_LINKS.pricing },
    { label: "Testimonials", href: HOME_SECTION_LINKS.testimonials },
    { label: "About", href: HOME_SECTION_LINKS.about },
  ];
  const FEATURE_LINKS = [
    { label: "People & Care", href: "../pages/people-and-care.html" },
    { label: "Giving & Finance", href: "../pages/giving-and-finance.html" },
    { label: "Communication & Engagement", href: "../pages/communication-engagement.html" },
    { label: "Serving & Operations", href: "../pages/serving-operations.html" },
    { label: "Growth & Insight", href: "../pages/growth-insight.html" },
    { label: "Platform & Experience", href: "../pages/platform-experience.html" },
  ];
  const PAGE_ACTIVE_LABELS = {
    "features.html": "Features",
    "pricing.html": "Pricing",
    "testimonials.html": "Testimonials",
    "about.html": "About",
    "people-and-care.html": "Features",
    "giving-and-finance.html": "Features",
    "communication-engagement.html": "Features",
    "serving-operations.html": "Features",
    "growth-insight.html": "Features",
    "platform-experience.html": "Features",
  };

  function getCurrentPageName() {
    return window.location.pathname.split("/").pop() || "home.html";
  }

  function getUrlForHref(href) {
    return new URL(href, window.location.href);
  }

  function isHomePage() {
    return getCurrentPageName() === "home.html";
  }

  function scrollToSection(hash) {
    if (!hash || hash.charAt(0) !== "#") return;
    var target = document.querySelector(hash);
    if (!target) return;

    if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
      window.__lenis.scrollTo(target, { offset: -100 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    history.pushState(null, "", hash);
  }

  function navigateToSection(href) {
    var url = getUrlForHref(href);
    if (url.pathname.split("/").pop() === getCurrentPageName() && url.hash) {
      scrollToSection(url.hash);
      return;
    }
    window.location.href = url.href;
  }

  function setNavLinkActive(link, active) {
    if (!link) return;
    link.classList.toggle("text-primary", active);
    link.classList.toggle("font-semibold", active);
    link.classList.toggle("text-white/90", !active && link.classList.contains("text-white/90"));
    link.classList.toggle("text-white/80", !active && link.classList.contains("text-white/80"));
    link.setAttribute("aria-current", active ? "page" : "false");
  }

  function initReveal(root) {
    root = root || document;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = root.querySelectorAll("[data-reveal]");
    elements.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity 0.8s " + EASE + ", transform 0.8s " + EASE;
      var delay = Number(el.dataset.delay || 0);
      if (delay) el.style.transitionDelay = delay + "s";
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
          el.addEventListener(
            "transitionend",
            function () {
              el.style.opacity = "";
              el.style.transform = "";
              el.style.transition = "";
              el.style.transitionDelay = "";
            },
            { once: true }
          );
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initTextType(container) {
    if (!container) return;

    var texts = JSON.parse(container.dataset.texts || '[""]');
    var typingSpeed = Number(container.dataset.typingSpeed || 45);
    var pauseDuration = Number(container.dataset.pauseDuration || 1800);
    var deletingSpeed = Number(container.dataset.deletingSpeed || 25);
    var loop = container.dataset.loop !== "false";
    var startOnVisible = container.dataset.startOnVisible === "true";
    var color = container.dataset.color || "inherit";

    var contentEl = container.querySelector(".text-type__content");
    var cursorEl = container.querySelector(".text-type__cursor");

    var textIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var displayed = "";
    var started = !startOnVisible;
    var timer;

    if (cursorEl) {
      var visible = true;
      setInterval(function () {
        visible = !visible;
        cursorEl.style.opacity = visible ? "1" : "0";
      }, 500);
    }

    function tick() {
      var current = texts[textIndex];

      if (isDeleting) {
        if (displayed.length === 0) {
          isDeleting = false;
          textIndex = loop ? (textIndex + 1) % texts.length : Math.min(textIndex + 1, texts.length - 1);
          charIndex = 0;
          timer = setTimeout(tick, pauseDuration);
          return;
        }
        displayed = displayed.slice(0, -1);
        contentEl.textContent = displayed;
        timer = setTimeout(tick, deletingSpeed);
        return;
      }

      if (charIndex < current.length) {
        displayed += current[charIndex++];
        contentEl.textContent = displayed;
        contentEl.style.color = color;
        timer = setTimeout(tick, typingSpeed);
        return;
      }

      if (!loop && textIndex === texts.length - 1) return;
      timer = setTimeout(function () {
        isDeleting = true;
        tick();
      }, pauseDuration);
    }

    function start() {
      if (started) return;
      started = true;
      tick();
    }

    if (startOnVisible) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              start();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(container);
    } else {
      start();
    }
  }

  function initAllTextTypes() {
    document.querySelectorAll("[data-text-type]").forEach(initTextType);
  }

  function initNavbar() {
    var nav = document.getElementById("site-nav");
    var menuBtn = document.getElementById("mobile-menu-open");
    var closeBtn = document.getElementById("mobile-menu-close");
    var overlay = document.getElementById("mobile-menu-overlay");
    var panel = document.getElementById("mobile-menu-panel");
    var backdrop = document.getElementById("mobile-menu-backdrop");
    var desktopMenu = null;
    var mobileMenu = null;
    var desktopFeaturesWrap = null;
    var desktopFeaturesButton = null;
    var desktopFeaturesPanel = null;
    var mobileFeaturesButton = null;
    var mobileFeaturesPanel = null;

    if (!nav) return;

    function elevateNavLayer() {
      nav.style.position = "fixed";
      nav.style.top = "0";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.zIndex = "99999";
      document.body.appendChild(nav);

      if (overlay) {
        overlay.style.zIndex = "999998";
        document.body.appendChild(overlay);
      }
    }

    elevateNavLayer();

    var stalePrimaryBar = document.getElementById("nav-primary-bar");
    if (stalePrimaryBar) stalePrimaryBar.remove();
    nav.querySelectorAll(".nav-features-mega, .nav-features-submenu").forEach(function (el) {
      el.remove();
    });
    document.querySelectorAll("body > .nav-features-mega, body > .nav-features-submenu").forEach(function (el) {
      el.remove();
    });
    document.body.classList.remove("has-nav-primary-bar");

    var navBg = nav.getAttribute("data-nav-bg") || "#004c4c";
    nav.style.backgroundColor = navBg;
    if (panel) panel.style.backgroundColor = navBg;

    nav.style.zIndex = "99999";
    if (overlay) overlay.style.zIndex = "999998";

    desktopMenu = Array.from(nav.querySelectorAll("div")).find(function (el) {
      return el.classList.contains("hidden") && el.classList.contains("lg:flex") && el.classList.contains("items-center");
    }) || null;

    mobileMenu = overlay ? overlay.querySelector(".flex.flex-col.gap-2") : null;

    function createAnchor(label, href, className) {
      var link = document.createElement("a");
      link.href = href;
      link.setAttribute("data-nav-link", "true");
      link.className = className;
      link.textContent = label;
      return link;
    }

    function extractNavLinks(container) {
      if (!container) return [];
      return Array.from(container.querySelectorAll("a[data-nav-link]")).map(function (link) {
        return {
          label: link.textContent.trim(),
          href: link.getAttribute("href"),
        };
      });
    }

    function isFeaturePageHref(href) {
      if (!href) return false;
      var target = getUrlForHref(href).pathname.split("/").pop();
      return FEATURE_LINKS.some(function (item) {
        return getUrlForHref(item.href).pathname.split("/").pop() === target;
      });
    }

    function filterSecondaryLinks(links) {
      return links.filter(function (item) {
        if (!item.href) return false;
        if (isFeaturePageHref(item.href)) return false;
        if (/^features$/i.test(item.label)) return false;
        return true;
      });
    }

    var desktopLinkClass = "text-sm font-medium no-underline transition-colors text-white/90 hover:text-primary";
    var mobileLinkClass = "px-4 py-3 rounded-xl font-medium text-base no-underline text-white/90 hover:bg-white/5";
    var desktopLinkSnapshot = extractNavLinks(desktopMenu);
    var mobileLinkSnapshot = extractNavLinks(mobileMenu);
    var secondaryDesktopLinks = filterSecondaryLinks(desktopLinkSnapshot);
    var secondaryMobileLinks = filterSecondaryLinks(mobileLinkSnapshot);

    function appendSecondaryLinks(container, links, className) {
      links.forEach(function (item) {
        container.appendChild(createAnchor(item.label, item.href, className));
      });
    }

    function openDesktopFeatures() {
      if (!desktopFeaturesButton || !desktopFeaturesPanel || !desktopFeaturesWrap) return;
      desktopFeaturesWrap.classList.add("is-open");
      desktopFeaturesButton.setAttribute("aria-expanded", "true");
      desktopFeaturesPanel.classList.remove("opacity-0", "pointer-events-none", "translate-y-1");
      desktopFeaturesPanel.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
    }

    function closeDesktopFeatures() {
      if (!desktopFeaturesButton || !desktopFeaturesPanel || !desktopFeaturesWrap) return;
      desktopFeaturesWrap.classList.remove("is-open");
      desktopFeaturesButton.setAttribute("aria-expanded", "false");
      desktopFeaturesPanel.classList.add("opacity-0", "pointer-events-none", "translate-y-1");
      desktopFeaturesPanel.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
    }

    function scheduleCloseDesktopFeatures() {
      if (!desktopFeaturesWrap) return;
      clearTimeout(desktopFeaturesWrap._closeTimer);
      desktopFeaturesWrap._closeTimer = setTimeout(closeDesktopFeatures, 120);
    }

    function cancelCloseDesktopFeatures() {
      if (!desktopFeaturesWrap) return;
      clearTimeout(desktopFeaturesWrap._closeTimer);
    }

    function bindDesktopFeaturesHover() {
      if (!desktopFeaturesWrap || !desktopFeaturesPanel) return;

      [desktopFeaturesWrap, desktopFeaturesPanel].forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          cancelCloseDesktopFeatures();
          openDesktopFeatures();
        });
        el.addEventListener("mouseleave", scheduleCloseDesktopFeatures);
      });

      desktopFeaturesWrap.addEventListener("focusin", openDesktopFeatures);
      desktopFeaturesWrap.addEventListener("focusout", function (event) {
        if (!desktopFeaturesWrap.contains(event.relatedTarget) && !desktopFeaturesPanel.contains(event.relatedTarget)) {
          closeDesktopFeatures();
        }
      });
    }

    function closeMobileFeatures() {
      if (!mobileFeaturesButton || !mobileFeaturesPanel) return;
      mobileFeaturesButton.setAttribute("aria-expanded", "false");
      mobileFeaturesButton.classList.remove("is-open");
      mobileFeaturesPanel.classList.add("hidden");
    }

    function openMobileFeatures() {
      if (!mobileFeaturesButton || !mobileFeaturesPanel) return;
      mobileFeaturesButton.setAttribute("aria-expanded", "true");
      mobileFeaturesButton.classList.add("is-open");
      mobileFeaturesPanel.classList.remove("hidden");
    }

    function closeDropdowns() {
      closeDesktopFeatures();
      closeMobileFeatures();
    }

    if (desktopMenu) {
      desktopMenu.innerHTML = "";

      desktopFeaturesWrap = document.createElement("div");
      desktopFeaturesWrap.className = "nav-features-wrap relative";

      desktopFeaturesButton = document.createElement("button");
      desktopFeaturesButton.type = "button";
      desktopFeaturesButton.className = "nav-features-trigger text-sm font-medium no-underline transition-colors text-white/90 hover:text-primary flex items-center gap-1.5 py-2";
      desktopFeaturesButton.setAttribute("aria-expanded", "false");
      desktopFeaturesButton.setAttribute("aria-haspopup", "true");
      desktopFeaturesButton.innerHTML = '<span>Features</span><i data-lucide="chevron-down" class="nav-features-chevron w-4 h-4 transition-transform duration-200"></i>';

      desktopFeaturesPanel = document.createElement("div");
      desktopFeaturesPanel.className = "nav-features-submenu absolute left-0 top-full pt-2 opacity-0 pointer-events-none translate-y-1 transition-all duration-200";
      desktopFeaturesPanel.setAttribute("role", "menu");

      var submenuInner = document.createElement("div");
      submenuInner.className = "nav-features-submenu__inner min-w-[17rem] rounded-xl border border-white/10 p-2 shadow-2xl";

      FEATURE_LINKS.forEach(function (item) {
        submenuInner.appendChild(
          createAnchor(
            item.label,
            item.href,
            "nav-features-submenu__link block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors no-underline whitespace-nowrap"
          )
        );
      });

      // var submenuDivider = document.createElement("div");
      // submenuDivider.className = "my-1.5 border-t border-white/10";
      // submenuInner.appendChild(submenuDivider);

      // submenuInner.appendChild(
      //   createAnchor(
      //     "View all features",
      //     HOME_SECTION_LINKS.features,
      //     "nav-features-submenu__link nav-features-submenu__link--all block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors no-underline"
      //   )
      // );

      desktopFeaturesPanel.appendChild(submenuInner);

      desktopFeaturesWrap.appendChild(desktopFeaturesButton);
      desktopFeaturesWrap.appendChild(desktopFeaturesPanel);
      desktopMenu.appendChild(desktopFeaturesWrap);

      bindDesktopFeaturesHover();

      desktopFeaturesButton.addEventListener("click", function (event) {
        if (desktopFeaturesPanel && desktopFeaturesPanel.contains(event.target)) return;
        event.preventDefault();
        closeDropdowns();
        navigateToSection(isHomePage() ? "#features" : HOME_SECTION_LINKS.features);
      });

      if (secondaryDesktopLinks.length) {
        appendSecondaryLinks(desktopMenu, secondaryDesktopLinks, desktopLinkClass);
      } else {
        NAV_LINKS.forEach(function (item) {
          desktopMenu.appendChild(createAnchor(item.label, item.href, desktopLinkClass));
        });
      }
    }

    if (mobileMenu) {
      mobileMenu.innerHTML = "";

      var mobileFeaturesWrap = document.createElement("div");
      mobileFeaturesWrap.className = "flex flex-col gap-2";

      mobileFeaturesWrap.appendChild(
        createAnchor(
          "Features",
          isHomePage() ? "#features" : HOME_SECTION_LINKS.features,
          mobileLinkClass
        )
      );

      mobileFeaturesButton = document.createElement("button");
      mobileFeaturesButton.type = "button";
      mobileFeaturesButton.id = "mobile-features-toggle";
      mobileFeaturesButton.className = "px-4 py-3 rounded-xl font-medium text-base text-left no-underline text-white/90 hover:bg-white/5 flex items-center justify-between gap-3";
      mobileFeaturesButton.setAttribute("aria-expanded", "false");
      mobileFeaturesButton.innerHTML = '<span>Feature categories</span><i data-lucide="chevron-down" class="mobile-features-chevron w-4 h-4 transition-transform duration-200"></i>';

      mobileFeaturesPanel = document.createElement("div");
      mobileFeaturesPanel.id = "mobile-features-panel";
      mobileFeaturesPanel.className = "hidden ml-3 pl-3 border-l border-white/10 flex flex-col gap-1";

      FEATURE_LINKS.forEach(function (item) {
        mobileFeaturesPanel.appendChild(
          createAnchor(
            item.label,
            item.href,
            "px-4 py-2.5 rounded-xl font-medium text-sm no-underline text-white/80 hover:bg-white/5 hover:text-white"
          )
        );
      });

      // mobileFeaturesPanel.appendChild(
      //   createAnchor(
      //     "View all features",
      //     HOME_SECTION_LINKS.features,
      //     "px-4 py-2.5 rounded-xl font-medium text-sm no-underline text-primary hover:bg-white/5 hover:text-white"
      //   )
      // );

      mobileFeaturesButton.addEventListener("click", function (event) {
        event.preventDefault();
        var isOpen = mobileFeaturesButton.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closeMobileFeatures();
        } else {
          openMobileFeatures();
        }
        mobileFeaturesButton.classList.toggle("is-open", !isOpen);
      });

      mobileFeaturesWrap.appendChild(mobileFeaturesButton);
      mobileFeaturesWrap.appendChild(mobileFeaturesPanel);
      mobileMenu.appendChild(mobileFeaturesWrap);

      if (secondaryMobileLinks.length) {
        appendSecondaryLinks(mobileMenu, secondaryMobileLinks, mobileLinkClass);
      } else {
        NAV_LINKS.forEach(function (item) {
          mobileMenu.appendChild(createAnchor(item.label, item.href, mobileLinkClass));
        });
      }
    }

    function onScroll() {
      nav.classList.toggle("nav-scrolled", window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function openMenu() {
      if (overlay) overlay.classList.remove("opacity-0", "pointer-events-none");
      if (panel) panel.classList.remove("translate-x-full");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      if (overlay) overlay.classList.add("opacity-0", "pointer-events-none");
      if (panel) panel.classList.add("translate-x-full");
      document.body.style.overflow = "";
    }

    document.addEventListener("click", function (event) {
      var link = event.target.closest("a[data-nav-link]");

      if (desktopFeaturesWrap && !desktopFeaturesWrap.contains(event.target) && !(desktopFeaturesPanel && desktopFeaturesPanel.contains(event.target))) {
        closeDesktopFeatures();
      }

      if (mobileFeaturesPanel && mobileFeaturesButton && !mobileFeaturesButton.contains(event.target) && !mobileFeaturesPanel.contains(event.target)) {
        closeMobileFeatures();
      }

      if (!link) return;

      var href = link.getAttribute("href");
      if (!href || link.getAttribute("target") === "_blank") return;

      var url = getUrlForHref(href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      closeMenu();
      closeDropdowns();

      if (url.pathname.split("/").pop() === getCurrentPageName()) {
        if (url.hash) {
          scrollToSection(url.hash);
        } else {
          if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
            window.__lenis.scrollTo(0);
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
        return;
      }

      document.documentElement.classList.add("page-transitioning");
      setTimeout(function () {
        window.location.href = url.href;
      }, 180);
    });

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);
    if (panel) {
      panel.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
    }

    var current = getCurrentPageName();
    var currentPageLabel = PAGE_ACTIVE_LABELS[current] || null;
    document.querySelectorAll("[data-nav-link]").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;

      var url = getUrlForHref(href);
      var isCurrentPage = url.pathname.split("/").pop() === current;
      var isCurrentAnchor = isCurrentPage && url.hash && url.hash === window.location.hash;
      var isCurrentLabel = currentPageLabel && link.textContent.trim() === currentPageLabel;

      if (isCurrentAnchor || isCurrentLabel) {
        setNavLinkActive(link, true);
      }
    });

    var currentFeature = FEATURE_LINKS.some(function (item) {
      return getUrlForHref(item.href).pathname.split("/").pop() === current;
    });

    if (desktopFeaturesButton && (currentFeature || (current === "home.html" && window.location.hash === "#features"))) {
      setNavLinkActive(desktopFeaturesButton, true);
    }

    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }

  function initMigrationModal() {
    var modal = document.getElementById("migration-modal");
    if (!modal) return;

    var openBtns = document.querySelectorAll("[data-open-migration-modal]");
    var closeBtns = modal.querySelectorAll("[data-close-migration-modal]");
    var backdrop = modal.querySelector("[data-migration-backdrop]");
    var tabDemo = modal.querySelector('[data-migration-tab="demo"]');
    var tabTrial = modal.querySelector('[data-migration-tab="trial"]');
    var titleEl = modal.querySelector("[data-migration-title]");
    var subtitleEl = modal.querySelector("[data-migration-subtitle]");
    var form = modal.querySelector("#migration-form");
    var activeTab = "trial";

    function setTab(tab) {
      activeTab = tab;
      if (tabDemo) {
        tabDemo.classList.toggle("bg-[#00C4D4]", tab === "demo");
        tabDemo.classList.toggle("text-slate-950", tab === "demo");
        tabDemo.classList.toggle("font-bold", tab === "demo");
        tabDemo.classList.toggle("text-slate-400", tab !== "demo");
      }
      if (tabTrial) {
        tabTrial.classList.toggle("bg-[#FACC15]", tab === "trial");
        tabTrial.classList.toggle("text-slate-950", tab === "trial");
        tabTrial.classList.toggle("font-bold", tab === "trial");
        tabTrial.classList.toggle("text-slate-400", tab !== "trial");
      }
      if (titleEl) {
        titleEl.textContent =
          tab === "trial"
            ? "Activate Your 30-Day Free Workspace"
            : "Schedule Your Guided Platform Tour";
      }
      if (subtitleEl) {
        subtitleEl.textContent =
          tab === "trial"
            ? "Full access to all 16 capabilities. No credit card required. Instant activation."
            : "See how EkklésiaOne unifies your church software in a 25-minute tailored walkthrough.";
      }
    }

    function open() {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      setTab("trial");
    }

    function close() {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener("click", open);
    });
    closeBtns.forEach(function (btn) {
      btn.addEventListener("click", close);
    });
    if (backdrop) backdrop.addEventListener("click", close);
    if (tabDemo) tabDemo.addEventListener("click", function () { setTab("demo"); });
    if (tabTrial) tabTrial.addEventListener("click", function () { setTab("trial"); });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Submitted Migration Form:", { activeTab: activeTab });
        close();
      });
    }
  }

  function initFaqAccordion() {
    var items = document.querySelectorAll("[data-faq-item]");

    function setFaqOpen(targetItem, open) {
      var panel = targetItem.querySelector("[data-faq-panel]");
      var icon = targetItem.querySelector("[data-faq-icon]");
      var button = targetItem.querySelector("[data-faq-trigger]");

      targetItem.classList.toggle("border-primary/30", open);
      targetItem.classList.toggle("bg-cream", open);
      targetItem.classList.toggle("shadow-soft", open);
      targetItem.classList.toggle("border-slate-200", !open);
      targetItem.classList.toggle("bg-white", !open);

      if (panel) {
        panel.classList.toggle("grid-rows-[1fr]", open);
        panel.classList.toggle("opacity-100", open);
        panel.classList.toggle("grid-rows-[0fr]", !open);
        panel.classList.toggle("opacity-0", !open);
      }

      if (icon) {
        icon.classList.toggle("bg-primary", open);
        icon.classList.toggle("text-white", open);
        icon.classList.toggle("rotate-180", open);
        icon.classList.toggle("bg-slate-100", !open);
        icon.classList.toggle("text-slate-500", !open);
      }

      if (button) {
        button.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }

    items.forEach(function (item, index) {
      var button = item.querySelector("[data-faq-trigger]");
      var panel = item.querySelector("[data-faq-panel]");

      setFaqOpen(item, index === 0);

      if (button) {
        button.addEventListener("click", function () {
          var wasOpen = panel && panel.classList.contains("grid-rows-[1fr]");
          items.forEach(function (other) {
            setFaqOpen(other, other === item ? !wasOpen : false);
          });
        });
      }
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var success = document.getElementById("contact-success");
    if (!form || !success) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.reset();
      success.classList.remove("hidden");
      setTimeout(function () {
        success.classList.add("hidden");
      }, 4000);
    });
  }

function initBackToTop() {
  // Show after ~400px or past the first main section (whichever is larger)
  var SCROLL_THRESHOLD_PX = 400;
  var button = document.querySelector("[data-back-to-top]");

  // Avoid duplicates — create only if missing
  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-back-to-top", "");
    button.className = "scroll-to-top";
    button.setAttribute("aria-label", "Scroll to top");
    button.setAttribute("title", "Scroll to top");
    button.setAttribute("aria-hidden", "true");
    button.innerHTML =
      '<svg class="scroll-to-top__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg>';
    document.body.appendChild(button);
  } else {
    button.classList.add("scroll-to-top");
    button.removeAttribute("style");
  }

  function getThreshold() {
    var firstSection = document.querySelector("main section");
    if (firstSection && firstSection.offsetHeight > SCROLL_THRESHOLD_PX) {
      return firstSection.offsetHeight - 80;
    }
    return SCROLL_THRESHOLD_PX;
  }

  function updateVisibility() {
    var show = window.scrollY > getThreshold();
    button.classList.toggle("is-visible", show);
    button.setAttribute("aria-hidden", show ? "false" : "true");
  }

  function scrollToTop() {
    // Lenis smooth scroll (if active)
    if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
      window.__lenis.scrollTo(0, { offset: 0 });
      return;
    }

    // Native smooth scroll (html { scroll-behavior: smooth } in main.css)
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }

  button.addEventListener("click", scrollToTop);

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);

  if (window.__lenis && typeof window.__lenis.on === "function") {
    window.__lenis.on("scroll", updateVisibility);
  }
}

  function initSmoothScroll(onScroll) {
    if (!window.Lenis) return null;
    var lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
    window.__lenis = lenis;
    function raf(time) {
      lenis.raf(time);
      if (onScroll) onScroll();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (onScroll) lenis.on("scroll", onScroll);
    return lenis;
  }

  function initHashScroll() {
    if (!window.location.hash) return;
    var hash = window.location.hash;
    if (!document.querySelector(hash)) return;
    window.setTimeout(function () {
      scrollToSection(hash);
    }, 120);
  }

  function initFeaturePageSticky() {
    return null;
  }

  function initHeroAnimations() {
    document.querySelectorAll("[data-hero-animate]").forEach(function (el, i) {
      el.style.opacity = "0";
      el.style.transform = "translateY(36px)";
      el.style.transition =
        "opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)";
      el.style.transitionDelay = i * 0.12 + "s";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      });
    });

    var heroImage = document.querySelector("[data-hero-image]");
    if (heroImage) {
      heroImage.style.opacity = "0";
      heroImage.style.transform = "translateX(50px)";
      heroImage.style.transition =
        "opacity 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.35s, transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.35s";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          heroImage.style.opacity = "1";
          heroImage.style.transform = "translateX(0)";
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
    initReveal();
    initAllTextTypes();
    initMigrationModal();
    initHeroAnimations();
    initFaqAccordion();
    initContactForm();
    var stickyUpdate = initFeaturePageSticky();
    initSmoothScroll(stickyUpdate);
    initBackToTop();
    initHashScroll();

    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  });
})();
