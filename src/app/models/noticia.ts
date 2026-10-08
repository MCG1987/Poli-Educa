export interface Noticia {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  autor: string;
  descripcion: string;
  contenido: string[];
  imagen: string;
  destacada: boolean;
  personalizada?: boolean;
}

export interface NuevaNoticia {
  titulo: string;
  categoria: string;
  fecha: string;
  descripcion: string;
  contenido: string;
}
