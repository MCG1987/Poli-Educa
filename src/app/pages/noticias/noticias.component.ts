import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [FormsModule, RouterLink, NewsCardComponent],
  templateUrl: './noticias.component.html'
})
export class NoticiasComponent implements OnInit {
  private readonly noticiasService = inject(NoticiasService);

  all: Noticia[] = [];
  query = '';
  category = 'Todas';
  page = 1;
  readonly pageSize = 3;
  error = '';

  async ngOnInit(): Promise<void> {
    await this.loadNews();
  }

  get filtered(): Noticia[] {
    const q = this.query.trim().toLowerCase();
    return this.all.filter((item) => {
      const matchesCategory = this.category === 'Todas' || item.categoria === this.category;
      const haystack = `${item.titulo} ${item.descripcion} ${item.categoria}`.toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get visible(): Noticia[] {
    if (this.page > this.totalPages) this.page = this.totalPages;
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  setCategory(category: string): void {
    this.category = category;
    this.page = 1;
  }

  resetPage(): void {
    this.page = 1;
  }

  previousPage(): void {
    if (this.page > 1) this.page -= 1;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page += 1;
  }

  private async loadNews(): Promise<void> {
    try {
      this.all = await this.noticiasService.getAllNews();
    } catch {
      this.error = 'No fue posible cargar el listado de noticias.';
    }
  }
}
