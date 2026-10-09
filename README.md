# Poli-Educa - Entrega 3 (Semana 7)

Aplicación Web de noticias educativas desarrollada con **Angular**, a partir del prototipo funcional realizado en HTML, CSS y JavaScript para la Entrega 2.

La versión actual conserva las funcionalidades principales del prototipo y las implementa mediante componentes, servicios, Angular Router, data binding, formularios y almacenamiento local.

## Funcionalidades

- Inicio con noticias destacadas cargadas dinámicamente.
- Listado de noticias desde `public/data/noticias.json`.
- Búsqueda por texto.
- Filtros por categoría.
- Paginación.
- Vista de detalle mediante la ruta `/noticias/:id`.
- Noticias relacionadas.
- Favoritos persistentes con `localStorage`.
- Contador de favoritos en la navegación.
- Formulario de contacto con validaciones.
- Página Nosotros.
- Mini CRUD para crear y eliminar noticias.
- Restauración de las noticias base.
- Diseño responsive para escritorio, tableta y móvil.
- Navegación mediante Angular Router.
- Componentes reutilizables.
- Servicios para noticias y favoritos.
- Mensajes de confirmación para acciones principales.

## Tecnologías

- Angular 21.2.4
- TypeScript
- HTML
- CSS
- Angular Router
- Angular Forms
- HttpClient
- RxJS
- JSON local
- localStorage

## Estructura principal

```text
Poli-Educa/
├── public/
│   ├── data/
│   │   └── noticias.json
│   └── img/
│       ├── logo.svg
│       └── noticia-1.svg ... noticia-9.svg
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   ├── news-card/
│   │   │   └── toast/
│   │   ├── models/
│   │   │   └── noticia.ts
│   │   ├── pages/
│   │   │   ├── contacto/
│   │   │   ├── detalle/
│   │   │   ├── favoritos/
│   │   │   ├── gestion/
│   │   │   ├── home/
│   │   │   ├── nosotros/
│   │   │   └── noticias/
│   │   ├── services/
│   │   │   ├── favoritos.service.ts
│   │   │   └── noticias.service.ts
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── README.md
```

## Rutas

```text
/                 Inicio
/noticias         Listado de noticias
/noticias/:id     Detalle de noticia
/favoritos        Noticias favoritas
/nosotros         Información del proyecto
/contacto         Formulario de contacto
/gestion          Gestión de noticias
```

## Uso de Angular

El proyecto utiliza elementos básicos solicitados para la entrega final:

- **Componentes:** Header, Footer, News Card, Toast y páginas independientes.
- **Interpolación:** `{{ valor }}`.
- **Property binding:** por ejemplo `[src]`, `[class.active]` y `[routerLink]`.
- **Event binding:** por ejemplo `(click)` y `(ngSubmit)`.
- **Two-way binding:** `[(ngModel)]` en formularios, búsqueda y gestión.
- **Servicios:** separación de la lógica de noticias y favoritos.
- **Routing:** navegación entre vistas sin utilizar archivos HTML independientes.

## Manejo de datos

El archivo `public/data/noticias.json` contiene las noticias base.

Como el proyecto es Front-End y no utiliza backend:

- Las noticias creadas se guardan en `localStorage`.
- Las noticias base eliminadas se registran en `localStorage`.
- El botón **Restaurar base** elimina los cambios locales.
- Los favoritos se almacenan en `localStorage`.

## Ejecutar localmente

Se requiere Node.js y npm.

Instalar las dependencias:

```bash
npm install
```

Ejecutar el servidor de desarrollo:

```bash
npm start
```

Luego abrir la dirección indicada por Angular en la terminal, normalmente:

```text
http://localhost:4200
```

Para generar la versión de producción:

```bash
npm run build
```

## Repositorio

Repositorio académico:

```text
MCG1987/Poli-Educa
```

La rama `main` contiene la versión Angular correspondiente a la Entrega 3.

La rama `semana-5-final` conserva la versión HTML, CSS y JavaScript utilizada como cierre de la Entrega 2.

## Despliegue

La aplicación Angular está publicada con GitHub Pages.

```text
https://mcg1987.github.io/Poli-Educa/
```

La compilación de producción utiliza como ruta base `/Poli-Educa/` y genera también un `404.html` para permitir la navegación de las rutas de Angular en GitHub Pages.

## Estado de la Entrega 3

La migración funcional a Angular, la organización por componentes, el data binding, los ajustes responsive y el despliegue público están implementados.
