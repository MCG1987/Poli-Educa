import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Noticia } from '../../models/noticia';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favoritos.component.html'
})
export class FavoritosComponent implements OnInit, OnDestroy {
  private readonly favoritosService = inject(FavoritosService);
  private readonly noticiasService = inject(NoticiasService);
  private subscription?: Subscription;

  favorites: Noticia[] = [];
  error = '';

  ngOnInit(): void {
    this.subscription = this.favoritosService.favoritos$.subscribe(() => {
      void this.loadFavorites();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  remove(id: number): void {
    this.favoritosService.remove(id);
  }

  private async loadFavorites(): Promise<void> {
    try {
      const ids = this.favoritosService.ids;
      const all = await this.noticiasService.getAllNews();
      this.favorites = ids
        .map((id) => all.find((item) => Number(item.id) === Number(id)))
        .filter((item): item is Noticia => Boolean(item));

      if (this.favorites.length !== ids.length) {
        this.favoritosService.replace(this.favorites.map((item) => item.id));
      }
    } catch {
      this.error = 'No fue posible cargar tus favoritos.';
    }
  }
}
