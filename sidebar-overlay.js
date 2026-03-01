(function () {
  var overlay = document.getElementById('sidebar-overlay');
  var openTriggers = document.querySelectorAll('.js-open-sidebar');
  var closeTriggers = document.querySelectorAll('.js-close-sidebar');
  var bodyMenu = overlay && overlay.querySelector('.sidebar-overlay__body--menu');
  var bodySidebar = overlay && overlay.querySelector('.sidebar-overlay__body--sidebar');

  function openOverlay(panel) {
    if (!overlay) return;
    var isMenu = panel === 'menu';
    overlay.setAttribute('data-panel', panel);
    if (bodyMenu) bodyMenu.hidden = !isMenu;
    if (bodySidebar) bodySidebar.hidden = isMenu;
    document.body.classList.add('is-sidebar-open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeOverlay() {
    document.body.classList.remove('is-sidebar-open');
    if (overlay) {
      overlay.setAttribute('aria-hidden', 'true');
      overlay.removeAttribute('data-panel');
      if (bodyMenu) bodyMenu.hidden = true;
      if (bodySidebar) bodySidebar.hidden = true;
    }
  }

  openTriggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var panel = el.getAttribute('data-overlay') || 'menu';
      openOverlay(panel);
    });
  });

  closeTriggers.forEach(function (el) {
    el.addEventListener('click', function () {
      closeOverlay();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('is-sidebar-open')) {
      closeOverlay();
    }
  });

  // 検索オーバーレイ
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput = document.getElementById('search-overlay-input');
  var toggleSearchBtns = document.querySelectorAll('.js-toggle-search');
  var closeSearchTriggers = document.querySelectorAll('.js-close-search');

  function openSearch() {
    document.body.classList.add('is-search-open');
    if (searchOverlay) searchOverlay.setAttribute('aria-hidden', 'false');
    if (searchInput) {
      setTimeout(function () { searchInput.focus(); }, 100);
    }
  }

  function closeSearch() {
    document.body.classList.remove('is-search-open');
    if (searchOverlay) searchOverlay.setAttribute('aria-hidden', 'true');
  }

  if (toggleSearchBtns.length) {
    toggleSearchBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch();
      });
    });
  }

  if (closeSearchTriggers.length) {
    closeSearchTriggers.forEach(function (el) {
      el.addEventListener('click', function () {
        closeSearch();
      });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('is-search-open')) {
      closeSearch();
    }
  });
})();
