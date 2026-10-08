import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NewsCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private readonly noticiasService = inject(NoticiasService);

  featured: Noticia[] = [];
  error = '';

  async ngOnInit(): Promise<void> {
    try {
      const news = await this.noticiasService.getAllNews();
      const highlighted = news.filter((item) => item.destacada).slice(0, 3);
      this.featured = highlighted.length ? highlighted : news.slice(0, 3);
    } catch {
      this.error = 'No fue posible cargar las noticias destacadas.';
    }
  }
}
