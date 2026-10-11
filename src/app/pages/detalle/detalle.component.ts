import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastService } from '../../components/toast/toast.service';
import { Noticia } from '../../models/noticia';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly noticiasService = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);
  private readonly title = inject(Title);

  readonly item = signal<Noticia | null>(null);
  readonly related = signal<Noticia[]>([]);
  readonly error = signal('');
  readonly loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      void this.loadNews(id);
    });
  }

  get isFavorite(): boolean {
    const current = this.item();
    return current ? this.favoritos.isFavorite(current.id) : false;
  }

  toggleFavorite(): void {
    const current = this.item();
    if (!current) return;

    const nowFavorite = this.favoritos.toggle(current.id);
    this.toast.show(
      nowFavorite ? 'Noticia agregada a favoritos.' : 'Noticia eliminada de favoritos.',
      nowFavorite ? 'success' : 'info'
    );
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.toast.show('Enlace copiado.', 'success');
    } catch {
      this.toast.show('No fue posible copiar automáticamente el enlace.', 'info');
    }
  }

  mailto(item: Noticia): string {
    return `mailto:?subject=${encodeURIComponent(item.titulo)}&body=${encodeURIComponent(window.location.href)}`;
  }

  formatDate(isoDate: string): string {
    const date = new Date(`${isoDate}T12:00:00`);
    if (Number.isNaN(date.getTime())) return isoDate;

    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  private async loadNews(id: number): Promise<void> {
    this.loading.set(true);
    this.item.set(null);
    this.related.set([]);
    this.error.set('');

    if (!Number.isFinite(id) || id <= 0) {
      this.error.set('El enlace no contiene un identificador válido.');
      this.title.setTitle('Detalle de noticia | Poli-Educa');
      this.loading.set(false);
      return;
    }

    try {
      const news = await this.noticiasService.getNewsById(id);

      if (!news) {
        this.error.set('La noticia pudo haber sido eliminada o el enlace no es correcto.');
        this.title.setTitle('Detalle de noticia | Poli-Educa');
        return;
      }

      this.item.set(news);
      this.title.setTitle(`${news.titulo} | Poli-Educa`);

      const relatedNews = await this.noticiasService.getRelatedNews(
        news.id,
        news.categoria,
        3
      );
      this.related.set(relatedNews);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error cargando el detalle de la noticia:', error);
      this.error.set('No fue posible cargar el detalle de la noticia.');
      this.title.setTitle('Detalle de noticia | Poli-Educa');
    } finally {
      this.loading.set(false);
    }
  }
}
