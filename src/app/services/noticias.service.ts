import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Noticia, NuevaNoticia } from '../models/noticia';
import { FavoritosService } from './favoritos.service';

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly favoritos = inject(FavoritosService);

  private readonly baseUrl = 'data/noticias.json';
  private readonly customKey = 'poliEducaNoticiasPersonalizadas';
  private readonly deletedKey = 'poliEducaNoticiasEliminadas';

  private baseCache: Noticia[] | null = null;

  async getAllNews(): Promise<Noticia[]> {
    const base = await this.loadBaseNews();
    const custom = this.getCustomNews();
    const deleted = new Set(this.getDeletedIds());

    return [...base, ...custom]
      .filter((news) => !deleted.has(Number(news.id)))
      .sort((a, b) =>
        String(b.fecha).localeCompare(String(a.fecha)) || Number(b.id) - Number(a.id)
      );
  }

  async getNewsById(id: number): Promise<Noticia | null> {
    const all = await this.getAllNews();
    return all.find((item) => Number(item.id) === Number(id)) ?? null;
  }

  async getRelatedNews(currentId: number, category: string, limit = 3): Promise<Noticia[]> {
    const all = await this.getAllNews();
    const sameCategory = all.filter(
      (item) => item.id !== currentId && item.categoria === category
    );
    const others = all.filter(
      (item) => item.id !== currentId && item.categoria !== category
    );
    return [...sameCategory, ...others].slice(0, limit);
  }

  addCustomNews(data: NuevaNoticia): Noticia {
    const custom = this.getCustomNews();
    const item: Noticia = {
      id: Date.now(),
      titulo: data.titulo.trim(),
      categoria: data.categoria.trim() || 'Educación',
      fecha: data.fecha || new Date().toISOString().slice(0, 10),
      autor: 'Equipo Poli-Educa',
      descripcion: data.descripcion.trim(),
      contenido: data.contenido
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      imagen: this.imageForCategory(data.categoria),
      destacada: false,
      personalizada: true
    };

    localStorage.setItem(this.customKey, JSON.stringify([...custom, item]));
    return item;
  }

  async deleteNews(id: number): Promise<void> {
    const numericId = Number(id);
    const custom = this.getCustomNews();
    const filteredCustom = custom.filter((item) => Number(item.id) !== numericId);

    if (filteredCustom.length !== custom.length) {
      localStorage.setItem(this.customKey, JSON.stringify(filteredCustom));
    } else {
      const deleted = this.getDeletedIds();
      if (!deleted.includes(numericId)) {
        localStorage.setItem(this.deletedKey, JSON.stringify([...deleted, numericId]));
      }
    }

    this.favoritos.remove(numericId);
  }

  resetNewsChanges(): void {
    localStorage.removeItem(this.customKey);
    localStorage.removeItem(this.deletedKey);
  }

  private async loadBaseNews(): Promise<Noticia[]> {
    if (this.baseCache) return this.baseCache;

    const data = await firstValueFrom(this.http.get<Noticia[]>(this.baseUrl));
    if (!Array.isArray(data)) {
      throw new Error('El archivo JSON no contiene un arreglo de noticias.');
    }

    this.baseCache = data;
    return data;
  }

  private getCustomNews(): Noticia[] {
    return this.readArray(this.customKey) as Noticia[];
  }

  private getDeletedIds(): number[] {
    return this.readArray(this.deletedKey)
      .map(Number)
      .filter(Number.isFinite);
  }

  private readArray(key: string): unknown[] {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  private imageForCategory(category: string): string {
    const images: Record<string, string> = {
      Educación: 'img/noticia-7.svg',
      Tecnología: 'img/noticia-8.svg',
      Becas: 'img/noticia-6.svg'
    };

    return images[category] ?? 'img/noticia-4.svg';
  }
}
