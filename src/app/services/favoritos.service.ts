import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly storageKey = 'poliEducaFavoritos';
  private readonly favoritosSubject = new BehaviorSubject<number[]>(this.read());

  readonly favoritos$ = this.favoritosSubject.asObservable();

  get ids(): number[] {
    return this.favoritosSubject.value;
  }

  isFavorite(id: number): boolean {
    return this.ids.includes(Number(id));
  }

  toggle(id: number): boolean {
    const numericId = Number(id);
    const current = this.ids;
    const exists = current.includes(numericId);
    const updated = exists
      ? current.filter((item) => item !== numericId)
      : [...current, numericId];

    this.save(updated);
    return !exists;
  }

  remove(id: number): void {
    this.save(this.ids.filter((item) => item !== Number(id)));
  }

  replace(ids: number[]): void {
    this.save(ids);
  }

  private read(): number[] {
    try {
      const value = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return Array.isArray(value)
        ? value.map(Number).filter(Number.isFinite)
        : [];
    } catch {
      return [];
    }
  }

  private save(ids: number[]): void {
    const unique = [...new Set(ids.map(Number).filter(Number.isFinite))];
    localStorage.setItem(this.storageKey, JSON.stringify(unique));
    this.favoritosSubject.next(unique);
  }
}
