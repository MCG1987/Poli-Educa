import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'info' | 'success';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  private timeoutId?: ReturnType<typeof setTimeout>;

  readonly toast$ = this.toastSubject.asObservable();

  show(text: string, type: ToastMessage['type'] = 'info'): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.toastSubject.next({ text, type });
    this.timeoutId = setTimeout(() => this.toastSubject.next(null), 2800);
  }
}
