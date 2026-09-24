document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  if (!form) return;

  const fields = {
    nombre: form.elements.namedItem('nombre'),
    email: form.elements.namedItem('email'),
    asunto: form.elements.namedItem('asunto'),
    mensaje: form.elements.namedItem('mensaje')
  };

  function setError(field, message) {
    const group = field.closest('.field-group');
    const error = group?.querySelector('.field-error');
    field.classList.toggle('invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message || '';
  }

  function validate() {
    let valid = true;
    const name = fields.nombre.value.trim();
    const email = fields.email.value.trim();
    const subject = fields.asunto.value.trim();
    const message = fields.mensaje.value.trim();

    if (name.length < 3) {
      setError(fields.nombre, 'Ingresa un nombre de al menos 3 caracteres.');
      valid = false;
    } else setError(fields.nombre, '');

    if (!email) {
      setError(fields.email, 'El correo electrónico es obligatorio.');
      valid = false;
    } else if (!fields.email.validity.valid) {
      setError(fields.email, 'Ingresa un correo electrónico válido.');
      valid = false;
    } else setError(fields.email, '');

    if (!subject) {
      setError(fields.asunto, 'Selecciona un asunto.');
      valid = false;
    } else setError(fields.asunto, '');

    if (message.length < 10) {
      setError(fields.mensaje, 'Escribe un mensaje de al menos 10 caracteres.');
      valid = false;
    } else setError(fields.mensaje, '');

    return valid;
  }

  Object.values(fields).forEach(field => {
    field.addEventListener('blur', validate);
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validate();
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    success.hidden = true;

    if (!validate()) {
      form.querySelector('.invalid')?.focus();
      return;
    }

    // Prototipo Front-End: se simula el envío porque la entrega no exige backend.
    success.hidden = false;
    success.textContent = 'Tu mensaje fue recibido correctamente. Gracias por comunicarte con Poli-Educa.';
    form.reset();
    Object.values(fields).forEach(field => setError(field, ''));
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
