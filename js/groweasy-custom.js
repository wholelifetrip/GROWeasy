(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  onReady(function () {
    var bioNavLink = document.querySelector(".bio-nav-link");
    var bioHeading = document.getElementById("Bio");
    var popupTrigger = document.querySelector(".bold-text-2");
    var bioBlockTriggers = document.querySelectorAll(".bio-popup-trigger");
    var popup = document.querySelector(".pop-up-bio");
    var popupClose = document.querySelector(".pop-up-bio .image-4");
    var mykoPopup = document.querySelector(".pop-up-myko");
    var mykoPopupTrigger = document.querySelector(".myko-popup-trigger");
    var mykoPopupClose = document.querySelector(".pop-up-myko .image-4");
    var productCardLinks = document.querySelectorAll(".product-card-link");
    var heroScrollArrow = document.querySelector(".hero-scroll-arrow");
    var introSection = document.getElementById("Intro");
    var schemaOpenButton = document.querySelector(".schema-open-button");
    var schemaPopup = document.querySelector(".schema-popup");
    var schemaPopupClose = document.querySelector(".schema-popup-close");
    var shopList = document.querySelector(".shop-list");
    var shopSearchForm = document.querySelector(".shop-search-form");
    var shopAddressInput = document.querySelector(".shop-address-input");
    var contactForm = document.querySelector(".contact-form");
    var contactFormStatus = document.querySelector(".contact-form-status");
    var siteBackButton = document.querySelector(".site-back-button");
    var returnPointKey = "groweasyReturnPoint";
    var pendingScrollKey = "groweasyPendingScroll";
    var returnTargetPages = {
      "kontakt.html": true,
      "groweasy.html": true,
      "bloomeasy.html": true,
      "impressum.html": true,
      "datenschutz.html": true,
      "cookies.html": true
    };

    function canUseSessionStorage() {
      try {
        var testKey = "groweasyStorageTest";
        window.sessionStorage.setItem(testKey, "1");
        window.sessionStorage.removeItem(testKey);
        return true;
      } catch (error) {
        return false;
      }
    }

    var hasSessionStorage = canUseSessionStorage();

    function getCurrentReturnUrl() {
      return window.location.pathname + window.location.search + window.location.hash;
    }

    function getPathPageName(pathname) {
      var cleanPath = pathname.replace(/\/+$/, "");
      var parts = cleanPath.split("/");
      return parts[parts.length - 1] || "index.html";
    }

    function isIndexPath(pathname) {
      var pageName = getPathPageName(pathname);
      return pageName === "index.html";
    }

    function getStoredJson(key) {
      if (!hasSessionStorage) {
        return null;
      }

      try {
        return JSON.parse(window.sessionStorage.getItem(key) || "null");
      } catch (error) {
        return null;
      }
    }

    function setStoredJson(key, value) {
      if (!hasSessionStorage) {
        return;
      }

      try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        return;
      }
    }

    function removeStoredItem(key) {
      if (!hasSessionStorage) {
        return;
      }

      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        return;
      }
    }

    function rememberReturnPoint() {
      setStoredJson(returnPointKey, {
        url: getCurrentReturnUrl(),
        path: window.location.pathname,
        scrollY: Math.max(0, Math.round(window.pageYOffset || document.documentElement.scrollTop || 0)),
        savedAt: Date.now()
      });
    }

    function shouldRememberLink(anchor) {
      var target;
      var pageName;

      if (!anchor || anchor.closest(".site-back-button") || anchor.hasAttribute("download")) {
        return false;
      }

      if (anchor.target && anchor.target.toLowerCase() === "_blank") {
        return false;
      }

      if (!anchor.href || anchor.href.indexOf("mailto:") === 0 || anchor.href.indexOf("tel:") === 0) {
        return false;
      }

      try {
        target = new URL(anchor.href, window.location.href);
      } catch (error) {
        return false;
      }

      if (target.origin !== window.location.origin) {
        return false;
      }

      pageName = getPathPageName(target.pathname);
      return Boolean(returnTargetPages[pageName]);
    }

    function restorePendingScrollPoint() {
      var pending = getStoredJson(pendingScrollKey);
      var currentPath = window.location.pathname;
      var targetPath;
      var scrollY;

      if (!pending || !pending.path) {
        return;
      }

      targetPath = pending.path;
      if (currentPath !== targetPath && !(isIndexPath(currentPath) && isIndexPath(targetPath))) {
        return;
      }

      scrollY = Math.max(0, Number(pending.scrollY) || 0);
      removeStoredItem(pendingScrollKey);

      function scrollBack() {
        window.scrollTo(0, scrollY);
      }

      window.requestAnimationFrame(scrollBack);
      window.setTimeout(scrollBack, 160);
      window.setTimeout(scrollBack, 520);
    }

    function navigateBackToStoredPoint(event) {
      var stored = getStoredJson(returnPointKey);

      if (!stored || !stored.url || !stored.path) {
        return;
      }

      event.preventDefault();
      setStoredJson(pendingScrollKey, {
        path: stored.path,
        scrollY: stored.scrollY || 0
      });
      removeStoredItem(returnPointKey);
      window.location.href = stored.url;
    }

    restorePendingScrollPoint();

    document.addEventListener("click", function (event) {
      var anchor = event.target.closest("a");

      if (shouldRememberLink(anchor)) {
        rememberReturnPoint();
      }
    }, true);

    if (siteBackButton) {
      siteBackButton.addEventListener("click", navigateBackToStoredPoint);
    }

    function showBioPaperAttention() {
      bioBlockTriggers.forEach(function (trigger) {
        trigger.classList.remove("bio-paper-attention");
        trigger.offsetWidth;
        trigger.classList.add("bio-paper-attention");
      });

      window.setTimeout(function () {
        bioBlockTriggers.forEach(function (trigger) {
          trigger.classList.remove("bio-paper-attention");
        });
      }, 900);
    }

    function showAttentionAfterScroll(targetTop) {
      var startedAt = performance.now();
      var previousScrollY = window.pageYOffset;

      function checkScroll() {
        var currentScrollY = window.pageYOffset;
        var isAtTarget = Math.abs(currentScrollY - targetTop) < 3;
        var hasStopped = Math.abs(currentScrollY - previousScrollY) < 0.5;
        var waitedLongEnough = performance.now() - startedAt > 700;
        var timedOut = performance.now() - startedAt > 4200;

        if (isAtTarget || timedOut || (waitedLongEnough && hasStopped)) {
          showBioPaperAttention();
          return;
        }

        previousScrollY = currentScrollY;
        window.requestAnimationFrame(checkScroll);
      }

      window.requestAnimationFrame(checkScroll);
    }

    function scrollToTarget(target, hash, extraOffset) {
      if (!target) {
        return;
      }

      var navbar = document.querySelector(".navbar");
      var navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      var scrollOffset = Number(extraOffset) || 0;
      var targetTop = Math.max(0, window.pageYOffset + target.getBoundingClientRect().top - navbarHeight + scrollOffset);

      if (hash) {
        window.history.replaceState(null, "", hash);
      }

      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    }

    if (bioNavLink && bioHeading) {
      bioNavLink.addEventListener("click", function (event) {
        var navbar = document.querySelector(".navbar");
        var navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
        var targetTop = Math.max(0, window.pageYOffset + bioHeading.getBoundingClientRect().top - navbarHeight);

        event.preventDefault();
        window.history.replaceState(null, "", "#Bio");
        window.scrollTo({
          top: targetTop,
          behavior: "smooth"
        });
        showAttentionAfterScroll(targetTop);
      });
    }

    if (heroScrollArrow && introSection) {
      heroScrollArrow.addEventListener("click", function (event) {
        var introImageOffset = Math.min(70, Math.max(42, window.innerWidth * 0.05));

        event.preventDefault();
        event.stopImmediatePropagation();
        scrollToTarget(introSection, "#Intro", introImageOffset);
      }, true);
    }

    if (popupTrigger && bioBlockTriggers.length) {
      bioBlockTriggers.forEach(function (trigger) {
        function openBioPopup(event) {
          if (event.target.closest(".bold-text-2")) {
            return;
          }

          event.preventDefault();
          popupTrigger.click();
        }

        trigger.addEventListener("click", openBioPopup);
        trigger.addEventListener("keydown", function (event) {
          if (event.key !== "Enter" && event.key !== " ") {
            return;
          }

          openBioPopup(event);
        });
      });
    }

    function isVisible(element) {
      return element && window.getComputedStyle(element).display !== "none";
    }

    function openMykoPopup(event) {
      if (!mykoPopup) {
        return;
      }

      event.preventDefault();
      mykoPopup.style.display = "flex";
      mykoPopup.setAttribute("aria-hidden", "false");
      if (mykoPopupClose) {
        mykoPopupClose.focus();
      }
    }

    function closeMykoPopup() {
      if (!mykoPopup) {
        return;
      }

      mykoPopup.style.display = "none";
      mykoPopup.setAttribute("aria-hidden", "true");
      if (mykoPopupTrigger) {
        mykoPopupTrigger.focus();
      }
    }

    function openSchemaPopup(event) {
      if (!schemaPopup) {
        return;
      }

      if (event) {
        event.preventDefault();
      }

      schemaPopup.classList.add("is-open");
      schemaPopup.style.removeProperty("display");
      schemaPopup.setAttribute("aria-hidden", "false");
      if (schemaPopupClose) {
        schemaPopupClose.focus();
      }
    }

    function closeSchemaPopup() {
      if (!schemaPopup) {
        return;
      }

      schemaPopup.classList.remove("is-open");
      schemaPopup.style.removeProperty("display");
      schemaPopup.setAttribute("aria-hidden", "true");
      if (schemaOpenButton) {
        schemaOpenButton.focus();
      }
    }

    function addKeyboardClick(element, callback) {
      if (!element) {
        return;
      }

      element.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        callback(event);
      });
    }

    if (mykoPopupTrigger) {
      mykoPopupTrigger.addEventListener("click", openMykoPopup);
      addKeyboardClick(mykoPopupTrigger, openMykoPopup);
    }

    if (mykoPopupClose) {
      mykoPopupClose.addEventListener("click", closeMykoPopup);
      addKeyboardClick(mykoPopupClose, closeMykoPopup);
    }

    if (schemaOpenButton) {
      addKeyboardClick(schemaOpenButton, openSchemaPopup);
    }

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest(".schema-open-button");

      if (!trigger) {
        return;
      }

      openSchemaPopup(event);
    });

    if (schemaPopupClose) {
      schemaPopupClose.addEventListener("click", closeSchemaPopup);
      addKeyboardClick(schemaPopupClose, closeSchemaPopup);
    }

    if (schemaPopup) {
      schemaPopup.addEventListener("click", function (event) {
        if (event.target === schemaPopup) {
          closeSchemaPopup();
        }
      });
    }

    productCardLinks.forEach(function (card) {
      function openProductDetail(event) {
        var targetUrl = card.getAttribute("data-product-url");

        if (!targetUrl) {
          return;
        }

        event.preventDefault();
        rememberReturnPoint();
        window.location.href = targetUrl;
      }

      card.addEventListener("click", openProductDetail);
      addKeyboardClick(card, openProductDetail);
    });

    if (shopList) {
      fetch("shops.json")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Shopdaten konnten nicht geladen werden.");
          }

          return response.json();
        })
        .then(function (data) {
          var shops = data.onlineShops || [];

          shopList.innerHTML = "";
          shops.forEach(function (shop) {
            var item = document.createElement(shop.url && shop.url !== "#" ? "a" : "div");
            item.className = "shop-item";

            if (shop.url && shop.url !== "#") {
              item.href = shop.url;
              item.target = "_blank";
              item.rel = "noopener";
            }

            item.innerHTML = "<strong></strong><span></span>";
            item.querySelector("strong").textContent = shop.name || "Shop folgt";
            item.querySelector("span").textContent = shop.note || "";
            shopList.appendChild(item);
          });
        })
        .catch(function () {
          shopList.innerHTML = '<div class="shop-item"><strong>Shopliste folgt</strong><span>Die Datenquelle wird vorbereitet.</span></div>';
        });
    }

    if (shopSearchForm && shopAddressInput) {
      shopSearchForm.addEventListener("submit", function (event) {
        var address = shopAddressInput.value.trim();
        var query = address ? "GROW easy Dünger near " + address : "GROW easy Dünger";

        event.preventDefault();
        window.open("https://www.google.com/maps/search/" + encodeURIComponent(query), "_blank", "noopener");
      });
    }

    if (contactForm && contactFormStatus) {
      contactForm.addEventListener("submit", function (event) {
        var formData = new FormData(contactForm);
        var submitButton = contactForm.querySelector(".contact-submit");
        var endpoint = contactForm.getAttribute("action") || "send-contact.php";

        event.preventDefault();

        contactFormStatus.classList.remove("is-success", "is-error");
        contactFormStatus.textContent = "Deine Nachricht wird gesendet...";

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Wird gesendet...";
        }

        fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        })
          .then(function (response) {
            return response.json()
              .catch(function () {
                return {
                  ok: false,
                  message: "Die Serverantwort konnte nicht gelesen werden."
                };
              })
              .then(function (data) {
                if (!response.ok || !data.ok) {
                  throw new Error(data.message || "Die Nachricht konnte nicht gesendet werden.");
                }

                return data;
              });
          })
          .then(function (data) {
            contactFormStatus.classList.add("is-success");
            contactFormStatus.textContent = data.message || "Danke, deine Nachricht wurde gesendet.";
            contactForm.reset();
          })
          .catch(function (error) {
            contactFormStatus.classList.add("is-error");
            contactFormStatus.textContent = error.message || "Die Nachricht konnte nicht gesendet werden.";
          })
          .finally(function () {
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = "Senden";
            }
          });
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }

      if (isVisible(schemaPopup)) {
        closeSchemaPopup();
        return;
      }

      if (isVisible(mykoPopup)) {
        closeMykoPopup();
        return;
      }

      if (isVisible(popup) && popupClose) {
        popupClose.click();
      }
    });

    if (popupClose) {
      addKeyboardClick(popupClose, function () {
        popupClose.click();
      });
    }
  });
}());
