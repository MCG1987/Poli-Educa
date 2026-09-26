# Poli-Educa - Entrega 2 (Semana 5)

Prototipo funcional de una plataforma Web de noticias educativas desarrollado con **HTML, CSS y JavaScript**, con carga dinámica desde **JSON**, favoritos con **localStorage**, formularios con validación y gestión básica de noticias.

## Funcionalidades incluidas

- Home con bienvenida, llamados a la acción y noticias destacadas dinámicas.
- Listado de noticias cargado desde `data/noticias.json` mediante `fetch()`.
- Búsqueda por texto, filtros por categoría y paginación.
- Vista de detalle por identificador (`detalle.html?id=...`).
- Favoritos persistentes con `localStorage`.
- Página personalizada de favoritos con opción de quitar noticias.
- Formulario de contacto con campos obligatorios, validación de correo y mensaje de confirmación.
- Página Nosotros.
- Mini CRUD requerido: creación y eliminación de noticias desde `gestion.html`.
- Persistencia local para las noticias creadas/eliminadas sin modificar el JSON original.
- Diseño responsive para escritorio, tableta y móvil.
- Código separado por responsabilidades y comentado.
- Recursos gráficos locales en SVG, sin dependencias externas.

## Estructura

```text
poli-educa/
├── index.html
├── noticias.html
├── detalle.html
├── favoritos.html
├── nosotros.html
├── contacto.html
├── gestion.html
├── css/
│   └── styles.css
├── data/
│   └── noticias.json
├── img/
│   ├── logo.svg
│   └── noticia-1.svg ... noticia-9.svg
├── js/
│   ├── common.js
│   ├── data.js
│   ├── home.js
│   ├── noticias.js
│   ├── detalle.js
│   ├── favoritos.js
│   ├── contacto.js
│   └── gestion.js
├── iniciar.bat
├── VERIFICACION.md
└── README.md
```

## Cómo ejecutar

### Opción recomendada en Windows

Haz doble clic en `iniciar.bat`. El script abre un servidor local en:

`http://localhost:5500`

### Opción manual

Desde la carpeta del proyecto ejecuta:

```bash
python -m http.server 5500
```

Luego abre `http://localhost:5500`.

> El proyecto intenta cargar las noticias desde `data/noticias.json` con `fetch()`. También contiene una copia de respaldo en JavaScript para que el prototipo pueda visualizarse aun cuando el navegador bloquee `fetch()` al abrir los archivos directamente con `file://`.

## Cómo verificar los requisitos

1. Abre **Inicio**: deben aparecer tres noticias destacadas cargadas dinámicamente.
2. Abre **Noticias**: prueba búsqueda, categorías y flechas de paginación.
3. Pulsa **Ver más**: debe abrir el detalle de la noticia seleccionada.
4. Agrega una noticia a **Favoritos** y comprueba que permanece tras recargar la página.
5. Entra a **Favoritos** y prueba **Ver detalle** y **Quitar**.
6. Abre **Contacto**, deja campos vacíos o escribe un correo inválido y comprueba las validaciones. Luego completa correctamente el formulario y verifica el mensaje de confirmación.
7. Desde **Noticias**, entra a **Gestionar noticias**. Crea una noticia y luego elimínala. También puedes eliminar una noticia base y restaurar el listado original.
8. Cambia el ancho de la ventana para comprobar el diseño responsive.

## Manejo de datos

`data/noticias.json` contiene las noticias base. Como este proyecto es únicamente Front-End y no incluye backend, el navegador no puede modificar directamente ese archivo. Por esa razón:

- Las noticias nuevas se guardan en `localStorage`.
- Las noticias eliminadas se registran en `localStorage` y se ocultan de la fuente base.
- El botón **Restaurar base** elimina esos cambios locales.
- Los favoritos también se almacenan en `localStorage`.

## Repositorio GitHub

El proyecto está preparado para subirse directamente a GitHub. Una vez creado el repositorio, desde esta carpeta puede ejecutarse:

```bash
git init
git add .
git commit -m "Entrega 2: prototipo funcional Poli-Educa"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

No se requieren dependencias ni proceso de compilación, por lo que puede publicarse directamente con GitHub Pages desde la rama `main`.
