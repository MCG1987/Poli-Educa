Poli-Educa

Entrega semana 5

Este proyecto es un prototipo de una pagina de noticias educativas.

Se desarrollo usando HTML, CSS y JavaScript.

Las noticias principales se cargan desde un archivo JSON.

El proyecto tiene las siguientes paginas:

Inicio
Noticias
Detalle de noticia
Favoritos
Nosotros
Contacto
Gestion de noticias

En la pagina de inicio se muestran algunas noticias destacadas.

En noticias se puede buscar, filtrar por categoria y cambiar entre paginas.

Al seleccionar una noticia se puede ver el detalle completo.

Tambien se pueden guardar noticias como favoritas.

Los favoritos se guardan en localStorage para que no se pierdan al actualizar la pagina.

La pagina de contacto tiene validaciones para los campos obligatorios y para el correo electronico.

Tambien existe una opcion para gestionar noticias.

Desde gestion se pueden crear noticias nuevas y eliminar noticias.

Como el proyecto no tiene backend, los cambios realizados desde gestion se guardan en localStorage.

El archivo data/noticias.json contiene las noticias iniciales.

Las carpetas principales del proyecto son:

css
data
img
js

El archivo principal es index.html.

Para ejecutar el proyecto se puede usar el archivo iniciar.bat en Windows.

Tambien se puede abrir una terminal dentro de la carpeta del proyecto y ejecutar:

python -m http.server 5500

Luego se abre en el navegador:

http://localhost:5500

Se recomienda ejecutarlo con el servidor local para que la carga del JSON funcione correctamente.

El diseño se realizo tomando como referencia los mockups desarrollados anteriormente en Figma.

El proyecto tambien cuenta con diseño responsive para adaptarse a diferentes tamaños de pantalla.

Repositorio:

MCG1987/Poli-Educa

Entrega 2
Desarrollo Front-End
