import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './componentes/home-page/home-page.component';
import { PreguntasFrecuentesComponent } from './componentes/preguntas-frecuentes/preguntas-frecuentes.component';
import { TerminosCondicionesComponent } from './componentes/terminos-condiciones/terminos-condiciones.component';
import {VideosComponent} from './componentes/videos/videos.component';
import {PoliticasDePrivacidadComponent} from './componentes/politicas-de-privacidad/politicas-de-privacidad.component';
import {NosotrosComponent} from './componentes/nosotros/nosotros.component';
import {LiquidacionesComponent} from './componentes/liquidaciones/liquidaciones.component';
import {DetalleProdComponent} from './componentes/detalle-prod/detalle-prod.component';
import {ContactosComponent} from './componentes/contactos/contactos.component';
import {ComoVenderComponent} from './componentes/como-vender/como-vender.component';
import {ComoComprarComponent} from './componentes/como-comprar/como-comprar.component';
import {BlogComponent} from './componentes/blog/blog/blog.component';
import {ErrorComponent} from './componentes/error/error.component';

const routes: Routes = [
  {path:'', component: HomePageComponent},
  {path:'preguntas-frecuentes', component:PreguntasFrecuentesComponent},
  {path:'videos', component: VideosComponent},
  {path:'terminos-condiciones', component: TerminosCondicionesComponent},
  {path:'politicas-de-privacidad', component: PoliticasDePrivacidadComponent},
  {path:'nosotros', component: NosotrosComponent},
  {path:'liquidaciones', component: LiquidacionesComponent},
  {path:'detalle-prod/:tipo/:id', component: DetalleProdComponent},
  {path:'contactos', component: ContactosComponent},
  {path:'como-vender', component: ComoVenderComponent},
  {path:'como-comprar', component: ComoComprarComponent},
  {path:'blog', component: BlogComponent},
  {path:'**',component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
