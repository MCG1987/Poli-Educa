import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia';
import { FavoritosService } from '../../services/favoritos.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent {
  @Input({ required: true }) news!: Noticia;
  @Input() showFavorite = true;

  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  get isFavorite(): boolean {
    return this.favoritos.isFavorite(this.news.id);
  }

  toggleFavorite(): void {
    const nowFavorite = this.favoritos.toggle(this.news.id);
    this.toast.show(
      nowFavorite ? 'Noticia agregada a favoritos.' : 'Noticia eliminada de favoritos.',
      nowFavorite ? 'success' : 'info'
    );
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
}
