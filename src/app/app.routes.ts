import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { GestionComponent } from './pages/gestion/gestion.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Poli-Educa' },
  { path: 'noticias', component: NoticiasComponent, title: 'Noticias | Poli-Educa' },
  { path: 'noticias/:id', component: DetalleComponent, title: 'Detalle | Poli-Educa' },
  { path: 'favoritos', component: FavoritosComponent, title: 'Favoritos | Poli-Educa' },
  { path: 'nosotros', component: NosotrosComponent, title: 'Nosotros | Poli-Educa' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto | Poli-Educa' },
  { path: 'gestion', component: GestionComponent, title: 'Gestión | Poli-Educa' },
  { path: '**', redirectTo: '' }
];
