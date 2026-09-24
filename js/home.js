document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('featured-news');
  if (!grid) return;

  try {
    const news = await window.PoliEducaData.getAllNews();
    const featured = news.filter(item => item.destacada).slice(0, 3);
    const selected = featured.length ? featured : news.slice(0, 3);

    grid.innerHTML = selected.map(item => window.PoliEduca.newsCard(item)).join('');
    window.PoliEduca.bindFavoriteButtons(grid);
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="status-message error">No fue posible cargar las noticias destacadas.</p>';
  }
});
