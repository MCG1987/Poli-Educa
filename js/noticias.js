document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('news-grid');
  const search = document.getElementById('news-search');
  const filters = document.getElementById('category-filters');
  const prev = document.getElementById('page-prev');
  const next = document.getElementById('page-next');
  const pageText = document.getElementById('page-status');
  const resultText = document.getElementById('result-count');
  if (!grid) return;

  const state = { all: [], query: '', category: 'Todas', page: 1, pageSize: 3 };

  function filteredNews() {
    const q = state.query.trim().toLowerCase();
    return state.all.filter(item => {
      const matchesCategory = state.category === 'Todas' || item.categoria === state.category;
      const haystack = `${item.titulo} ${item.descripcion} ${item.categoria}`.toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }

  function render() {
    const filtered = filteredNews();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * state.pageSize;
    const visible = filtered.slice(start, start + state.pageSize);

    resultText.textContent = `${filtered.length} noticia${filtered.length === 1 ? '' : 's'} encontrada${filtered.length === 1 ? '' : 's'}`;
    pageText.textContent = `Página ${state.page} de ${totalPages}`;
    prev.disabled = state.page <= 1;
    next.disabled = state.page >= totalPages;

    if (!visible.length) {
      grid.innerHTML = `
        <div class="empty-state wide">
          <h2>No encontramos noticias</h2>
          <p>Prueba con otra palabra o selecciona una categoría diferente.</p>
        </div>`;
      return;
    }

    grid.innerHTML = visible.map(item => window.PoliEduca.newsCard(item)).join('');
    window.PoliEduca.bindFavoriteButtons(grid);
  }

  try {
    state.all = await window.PoliEducaData.getAllNews();
    render();
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="status-message error">No fue posible cargar el listado de noticias.</p>';
  }

  search?.addEventListener('input', event => {
    state.query = event.target.value;
    state.page = 1;
    render();
  });

  filters?.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    state.page = 1;
    filters.querySelectorAll('[data-category]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    render();
  });

  prev?.addEventListener('click', () => {
    if (state.page > 1) {
      state.page -= 1;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  next?.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredNews().length / state.pageSize);
    if (state.page < totalPages) {
      state.page += 1;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
