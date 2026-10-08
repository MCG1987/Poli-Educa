import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../components/toast/toast.service';
import { Noticia, NuevaNoticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './gestion.component.html'
})
export class GestionComponent implements OnInit {
  private readonly noticiasService = inject(NoticiasService);
  private readonly toast = inject(ToastService);

  news: Noticia[] = [];
  error = '';
  model: NuevaNoticia = this.emptyModel();

  async ngOnInit(): Promise<void> {
    await this.loadNews();
  }

  async create(form: NgForm): Promise<void> {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.noticiasService.addCustomNews(this.model);
    this.model = this.emptyModel();
    form.resetForm(this.model);
    this.toast.show('Noticia creada correctamente.', 'success');
    await this.loadNews();
  }

  async remove(item: Noticia): Promise<void> {
    if (!window.confirm(`¿Eliminar la noticia “${item.titulo}”?`)) return;

    await this.noticiasService.deleteNews(item.id);
    this.toast.show('Noticia eliminada.', 'info');
    await this.loadNews();
  }

  async reset(): Promise<void> {
    if (!window.confirm('¿Restaurar el listado original? Se eliminarán las noticias creadas en este navegador y se recuperarán las noticias base.')) return;

    this.noticiasService.resetNewsChanges();
    this.toast.show('Listado restaurado.', 'success');
    await this.loadNews();
  }

  private async loadNews(): Promise<void> {
    try {
      this.news = await this.noticiasService.getAllNews();
      this.error = '';
    } catch {
      this.error = 'No fue posible cargar las noticias.';
    }
  }

  private emptyModel(): NuevaNoticia {
    return {
      titulo: '',
      categoria: 'Educación',
      fecha: new Date().toISOString().slice(0, 10),
      descripcion: '',
      contenido: ''
    };
  }
}
