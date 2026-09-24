document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('news-admin-form');
  const list = document.getElementById('admin-news-list');
  const resetButton = document.getElementById('reset-news');
  if (!form || !list) return;

  async function renderList() {
    const news = await window.PoliEducaData.getAllNews();
    if (!news.length) {
      list.innerHTML = '<p class="empty-state">No hay noticias disponibles.</p>';
      return;
    }
    list.innerHTML = news.map(item => `
      <article class="admin-item">
        <div>
          <span class="category-chip">${window.PoliEduca.escapeHtml(item.categoria)}</span>
          <h3>${window.PoliEduca.escapeHtml(item.titulo)}</h3>
          <p>${window.PoliEduca.escapeHtml(item.descripcion)}</p>
          <small>${item.personalizada ? 'Noticia creada desde el prototipo' : 'Noticia base cargada desde JSON'}</small>
        </div>
        <div class="admin-actions">
          <a class="btn btn-outline" href="detalle.html?id=${item.id}">Ver</a>
          <button class="btn btn-danger" type="button" data-delete-news="${item.id}" data-title="${window.PoliEduca.escapeHtml(item.titulo)}">Eliminar</button>
        </div>
      </article>`).join('');

    list.querySelectorAll('[data-delete-news]').forEach(button => {
      button.addEventListener('click', async () => {
        const title = button.dataset.title;
        if (!window.confirm(`¿Eliminar la noticia “${title}”?`)) return;
        await window.PoliEducaData.deleteNews(button.dataset.deleteNews);
        window.PoliEduca.showToast('Noticia eliminada.', 'info');
        await renderList();
      });
    });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    window.PoliEducaData.addCustomNews(data);
    form.reset();
    form.elements.namedItem('fecha').value = new Date().toISOString().slice(0, 10);
    window.PoliEduca.showToast('Noticia creada correctamente.', 'success');
    await renderList();
  });

  resetButton?.addEventListener('click', async () => {
    if (!window.confirm('¿Restaurar el listado original? Se eliminarán las noticias creadas en este navegador y se recuperarán las noticias base.')) return;
    window.PoliEducaData.resetNewsChanges();
    window.PoliEduca.showToast('Listado restaurado.', 'success');
    await renderList();
  });

  form.elements.namedItem('fecha').value = new Date().toISOString().slice(0, 10);

  try {
    await renderList();
  } catch (error) {
    console.error(error);
    list.innerHTML = '<p class="status-message error">No fue posible cargar las noticias.</p>';
  }
});
