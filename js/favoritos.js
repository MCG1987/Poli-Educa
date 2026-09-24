document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('favorites-grid');
  const count = document.getElementById('favorites-page-count');
  if (!grid) return;

  async function render() {
    const ids = window.PoliEduca.getFavorites();
    const all = await window.PoliEducaData.getAllNews();
    const favorites = ids.map(id => all.find(item => Number(item.id) === Number(id))).filter(Boolean);

    // Limpia favoritos que correspondan a noticias eliminadas.
    if (favorites.length !== ids.length) {
      window.PoliEduca.saveFavorites(favorites.map(item => item.id));
    }

    count.textContent = `${favorites.length} noticia${favorites.length === 1 ? '' : 's'} guardada${favorites.length === 1 ? '' : 's'}`;

    if (!favorites.length) {
      grid.innerHTML = `
        <div class="empty-state wide">
          <h2>Aún no tienes favoritos</h2>
          <p>Guarda las noticias que quieras consultar más adelante.</p>
          <a class="btn btn-primary" href="noticias.html">Explorar noticias</a>
        </div>`;
      return;
    }

    grid.innerHTML = favorites.map(item => `
      <article class="news-card" data-news-id="${item.id}">
        <a href="detalle.html?id=${item.id}" class="news-card-image-link">
          <img class="news-card-image" src="${window.PoliEduca.escapeHtml(item.imagen)}" alt="Ilustración de ${window.PoliEduca.escapeHtml(item.titulo)}">
        </a>
        <div class="news-card-body">
          <span class="category-chip">${window.PoliEduca.escapeHtml(item.categoria)}</span>
          <h3><a href="detalle.html?id=${item.id}">${window.PoliEduca.escapeHtml(item.titulo)}</a></h3>
          <p>${window.PoliEduca.escapeHtml(item.descripcion)}</p>
          <div class="news-card-actions">
            <a class="btn btn-outline" href="detalle.html?id=${item.id}">Ver detalle</a>
            <button class="btn-link danger" type="button" data-remove-favorite="${item.id}">Quitar</button>
          </div>
        </div>
      </article>`).join('');

    grid.querySelectorAll('[data-remove-favorite]').forEach(button => {
      button.addEventListener('click', () => {
        window.PoliEduca.removeFavorite(button.dataset.removeFavorite);
        window.PoliEduca.showToast('Noticia eliminada de favoritos.', 'info');
        render();
      });
    });
  }

  try {
    await render();
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="status-message error">No fue posible cargar tus favoritos.</p>';
  }
});
