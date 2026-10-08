import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contacto.component.html'
})
export class ContactoComponent {
  model = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  };

  success = false;

  submit(form: NgForm): void {
    this.success = false;
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.success = true;
    form.resetForm({
      nombre: '',
      email: '',
      asunto: '',
      mensaje: ''
    });
  }
}
