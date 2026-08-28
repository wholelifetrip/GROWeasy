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

    function scrollToTarget(target, hash) {
      if (!target) {
        return;
      }

      var navbar = document.querySelector(".navbar");
      var navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      var targetTop = Math.max(0, window.pageYOffset + target.getBoundingClientRect().top - navbarHeight);

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
        event.preventDefault();
        scrollToTarget(introSection, "#Intro");
      });
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

      event.preventDefault();
      schemaPopup.style.display = "flex";
      schemaPopup.setAttribute("aria-hidden", "false");
      if (schemaPopupClose) {
        schemaPopupClose.focus();
      }
    }

    function closeSchemaPopup() {
      if (!schemaPopup) {
        return;
      }

      schemaPopup.style.display = "none";
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
      schemaOpenButton.addEventListener("click", openSchemaPopup);
      addKeyboardClick(schemaOpenButton, openSchemaPopup);
    }

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
        event.preventDefault();
        contactFormStatus.textContent = "Danke! Das Formular ist vorbereitet. Der Mailversand wird im nächsten Schritt eingerichtet.";
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
