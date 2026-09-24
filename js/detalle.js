document.addEventListener('DOMContentLoaded', async () => {
  const host = document.getElementById('article-detail');
  const relatedHost = document.getElementById('related-news');
  if (!host) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));

  if (!id) {
    host.innerHTML = `
      <div class="empty-state">
        <h1>Noticia no encontrada</h1>
        <p>El enlace no contiene un identificador válido.</p>
        <a class="btn btn-primary" href="noticias.html">Volver a noticias</a>
      </div>`;
    return;
  }

  try {
    const item = await window.PoliEducaData.getNewsById(id);
    if (!item) {
      host.innerHTML = `
        <div class="empty-state">
          <h1>Noticia no disponible</h1>
          <p>La noticia pudo haber sido eliminada o el enlace no es correcto.</p>
          <a class="btn btn-primary" href="noticias.html">Volver a noticias</a>
        </div>`;
      return;
    }

    document.title = `${item.titulo} | Poli-Educa`;
    const favorite = window.PoliEduca.isFavorite(item.id);
    const paragraphs = Array.isArray(item.contenido) ? item.contenido : [String(item.contenido || '')];

    host.innerHTML = `
      <a class="back-link" href="noticias.html">← Volver a noticias</a>
      <div class="article-layout">
        <article class="article-main">
          <span class="category-chip">${window.PoliEduca.escapeHtml(item.categoria)}</span>
          <h1>${window.PoliEduca.escapeHtml(item.titulo)}</h1>
          <p class="article-meta">Publicado el ${window.PoliEduca.escapeHtml(window.PoliEduca.formatDate(item.fecha))} · ${window.PoliEduca.escapeHtml(item.autor)}</p>
          <img class="article-image" src="${window.PoliEduca.escapeHtml(item.imagen)}" alt="Ilustración de ${window.PoliEduca.escapeHtml(item.titulo)}">
          <div class="article-copy">
            ${paragraphs.map(paragraph => `<p>${window.PoliEduca.escapeHtml(paragraph)}</p>`).join('')}
          </div>
        </article>
        <aside class="article-sidebar" aria-label="Acciones de la noticia">
          <button id="detail-favorite" type="button" class="btn btn-primary btn-block ${favorite ? 'is-favorite' : ''}" aria-pressed="${favorite}">${favorite ? '★ Guardada en favoritos' : '☆ Agregar a favoritos'}</button>
          <div class="sidebar-section">
            <h2>Compartir</h2>
            <button id="copy-link" type="button" class="btn btn-outline btn-block">Copiar enlace</button>
            <a class="btn btn-outline btn-block" href="mailto:?subject=${encodeURIComponent(item.titulo)}&body=${encodeURIComponent(window.location.href)}">Compartir por correo</a>
          </div>
          <div class="sidebar-section">
            <h2>Información</h2>
            <p><strong>Categoría:</strong> ${window.PoliEduca.escapeHtml(item.categoria)}</p>
            <p><strong>Fecha:</strong> ${window.PoliEduca.escapeHtml(window.PoliEduca.formatDate(item.fecha))}</p>
          </div>
        </aside>
      </div>`;

    const favoriteButton = document.getElementById('detail-favorite');
    favoriteButton.addEventListener('click', () => {
      const nowFavorite = window.PoliEduca.toggleFavorite(item.id);
      favoriteButton.classList.toggle('is-favorite', nowFavorite);
      favoriteButton.setAttribute('aria-pressed', String(nowFavorite));
      favoriteButton.textContent = nowFavorite ? '★ Guardada en favoritos' : '☆ Agregar a favoritos';
      window.PoliEduca.showToast(nowFavorite ? 'Noticia agregada a favoritos.' : 'Noticia eliminada de favoritos.', nowFavorite ? 'success' : 'info');
    });

    document.getElementById('copy-link')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        window.PoliEduca.showToast('Enlace copiado.', 'success');
      } catch {
        window.PoliEduca.showToast('No fue posible copiar automáticamente el enlace.', 'info');
      }
    });

    const related = await window.PoliEducaData.getRelatedNews(item.id, item.categoria, 3);
    if (relatedHost) {
      relatedHost.innerHTML = related.map(news => `
        <a class="related-item" href="detalle.html?id=${news.id}">
          <img src="${window.PoliEduca.escapeHtml(news.imagen)}" alt="">
          <span><strong>${window.PoliEduca.escapeHtml(news.titulo)}</strong><small>${window.PoliEduca.escapeHtml(news.categoria)}</small></span>
        </a>`).join('');
    }
  } catch (error) {
    console.error(error);
    host.innerHTML = '<p class="status-message error">No fue posible cargar el detalle de la noticia.</p>';
  }
});
