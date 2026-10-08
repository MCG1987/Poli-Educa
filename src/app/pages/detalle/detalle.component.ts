import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

  item: Noticia | null = null;
  related: Noticia[] = [];
  error = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      void this.loadNews(id);
    });
  }

  get isFavorite(): boolean {
    return this.item ? this.favoritos.isFavorite(this.item.id) : false;
  }

  toggleFavorite(): void {
    if (this.item) this.favoritos.toggle(this.item.id);
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // El navegador puede bloquear el portapapeles si no se usa HTTPS.
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
    this.item = null;
    this.related = [];
    this.error = '';

    if (!id) {
      this.error = 'El enlace no contiene un identificador válido.';
      return;
    }

    try {
      this.item = await this.noticiasService.getNewsById(id);
      if (!this.item) {
        this.error = 'La noticia pudo haber sido eliminada o el enlace no es correcto.';
        return;
      }

      this.related = await this.noticiasService.getRelatedNews(
        this.item.id,
        this.item.categoria,
        3
      );

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      this.error = 'No fue posible cargar el detalle de la noticia.';
    }
  }
}
