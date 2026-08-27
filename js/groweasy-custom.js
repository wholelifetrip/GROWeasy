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

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
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
