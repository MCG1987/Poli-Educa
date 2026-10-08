import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia';
import { FavoritosService } from '../../services/favoritos.service';

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

  get isFavorite(): boolean {
    return this.favoritos.isFavorite(this.news.id);
  }

  toggleFavorite(): void {
    this.favoritos.toggle(this.news.id);
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
