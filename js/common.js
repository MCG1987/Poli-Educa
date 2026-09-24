(function () {
  'use strict';

  const STORAGE_KEYS = {
    favoritos: 'poliEducaFavoritos',
    personalizadas: 'poliEducaNoticiasPersonalizadas',
    eliminadas: 'poliEducaNoticiasEliminadas'
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function getFavorites() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.favoritos) || '[]');
      return Array.isArray(data) ? data.map(Number).filter(Number.isFinite) : [];
    } catch {
      return [];
    }
  }

  function saveFavorites(ids) {
    const unique = [...new Set(ids.map(Number).filter(Number.isFinite))];
    localStorage.setItem(STORAGE_KEYS.favoritos, JSON.stringify(unique));
    updateFavoriteCount();
    return unique;
  }

  function isFavorite(id) {
    return getFavorites().includes(Number(id));
  }

  function toggleFavorite(id) {
    const numericId = Number(id);
    const ids = getFavorites();
    const exists = ids.includes(numericId);
    const updated = exists ? ids.filter(item => item !== numericId) : [...ids, numericId];
    saveFavorites(updated);
    return !exists;
  }

  function removeFavorite(id) {
    return saveFavorites(getFavorites().filter(item => item !== Number(id)));
  }

  function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(`${isoDate}T12:00:00`);
    if (Number.isNaN(date.getTime())) return isoDate;
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
  }

  function renderHeader() {
    const target = document.getElementById('site-header');
    if (!target) return;

    const current = document.body.dataset.page || '';
    const items = [
      ['inicio', 'Inicio', 'index.html'],
      ['noticias', 'Noticias', 'noticias.html'],
      ['favoritos', 'Favoritos', 'favoritos.html'],
      ['nosotros', 'Nosotros', 'nosotros.html'],
      ['contacto', 'Contacto', 'contacto.html']
    ];

    const nav = items.map(([key, label, href]) => {
      const active = current === key ? ' class="nav-link active" aria-current="page"' : ' class="nav-link"';
      const badge = key === 'favoritos' ? '<span class="favorites-badge" data-favorites-count aria-label="cantidad de favoritos">0</span>' : '';
      return `<a${active} href="${href}">${label}${badge}</a>`;
    }).join('');

    target.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="Ir al inicio de Poli-Educa">
            <img src="img/logo.svg" alt="" class="brand-logo">
            <span class="brand-text"><strong>Poli-Educa</strong><small>Noticias que impulsan tu futuro</small></span>
          </a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Menú</button>
          <nav id="main-nav" class="main-nav" aria-label="Navegación principal">${nav}</nav>
        </div>
      </header>`;

    const toggle = target.querySelector('.menu-toggle');
    const mainNav = target.querySelector('.main-nav');
    toggle?.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    updateFavoriteCount();
  }

  function renderFooter() {
    const target = document.getElementById('site-footer');
    if (!target) return;
    target.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-inner">
          <div>
            <a class="footer-brand" href="index.html">Poli-Educa</a>
            <p>Información educativa organizada de forma sencilla.</p>
          </div>
          <div class="footer-contact">
            <strong>Contacto</strong>
            <a href="mailto:mcadavidg@poligran.edu.co">mcadavidg@poligran.edu.co</a>
            <a href="tel:+573000100120">+57 300 010 01 20</a>
          </div>
          <div class="footer-social" aria-label="Redes sociales de ejemplo">
            <span>f</span><span>X</span><span>ig</span><span>yt</span>
          </div>
        </div>
      </footer>`;
  }

  function updateFavoriteCount() {
    const count = getFavorites().length;
    document.querySelectorAll('[data-favorites-count]').forEach(el => {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
  }

  function showToast(message, type = 'info') {
    let host = document.getElementById('toast-container');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-container';
      host.className = 'toast-container';
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    host.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 20);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 250);
    }, 2600);
  }

  function newsCard(news, options = {}) {
    const favorite = isFavorite(news.id);
    const showFavorite = options.showFavorite !== false;
    return `
      <article class="news-card" data-news-id="${news.id}">
        <a href="detalle.html?id=${news.id}" class="news-card-image-link" aria-label="Ver detalle de ${escapeHtml(news.titulo)}">
          <img class="news-card-image" src="${escapeHtml(news.imagen)}" alt="Ilustración de ${escapeHtml(news.titulo)}">
        </a>
        <div class="news-card-body">
          <div class="news-card-topline">
            <span class="category-chip">${escapeHtml(news.categoria)}</span>
            <time datetime="${escapeHtml(news.fecha)}">${escapeHtml(formatDate(news.fecha))}</time>
          </div>
          <h3><a href="detalle.html?id=${news.id}">${escapeHtml(news.titulo)}</a></h3>
          <p>${escapeHtml(news.descripcion)}</p>
          <div class="news-card-actions">
            <a class="btn btn-outline" href="detalle.html?id=${news.id}">Ver más</a>
            ${showFavorite ? `<button type="button" class="favorite-mini ${favorite ? 'is-favorite' : ''}" data-toggle-favorite="${news.id}" aria-pressed="${favorite}">${favorite ? '★ Guardada' : '☆ Favorito'}</button>` : ''}
          </div>
        </div>
      </article>`;
  }

  function bindFavoriteButtons(root = document, onChange) {
    root.querySelectorAll('[data-toggle-favorite]').forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.toggleFavorite);
        const nowFavorite = toggleFavorite(id);
        button.classList.toggle('is-favorite', nowFavorite);
        button.setAttribute('aria-pressed', String(nowFavorite));
        button.textContent = nowFavorite ? '★ Guardada' : '☆ Favorito';
        showToast(nowFavorite ? 'Noticia agregada a favoritos.' : 'Noticia eliminada de favoritos.', nowFavorite ? 'success' : 'info');
        onChange?.(id, nowFavorite);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
  });

  window.PoliEduca = {
    STORAGE_KEYS,
    escapeHtml,
    getFavorites,
    saveFavorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    formatDate,
    updateFavoriteCount,
    showToast,
    newsCard,
    bindFavoriteButtons
  };
})();
