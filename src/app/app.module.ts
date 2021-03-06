import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './componentes/home-page/home-page.component';
///firebase
//import {AngularFireModule} from 'angularfire2';
import { AngularFireModule } from '@angular/fire';
//import {AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { AngularFireDatabase} from 'angularfire2/database';
import { AngularFireStorageModule} from '@angular/fire/storage'
//servicios
import { AuthService } from './servicios/auth.service';
import {ItemService} from './servicios/item.service';
import {ModalServiceService} from './servicios/modal-service.service';
/// bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './componentes/footer/footer.component';
import { PreguntasFrecuentesComponent } from './componentes/preguntas-frecuentes/preguntas-frecuentes.component';
import { TerminosCondicionesComponent } from './componentes/terminos-condiciones/terminos-condiciones.component';
import { VideosComponent } from './componentes/videos/videos.component';
import { PoliticasDePrivacidadComponent } from './componentes/politicas-de-privacidad/politicas-de-privacidad.component';
import { NosotrosComponent } from './componentes/nosotros/nosotros.component';
import { LiquidacionesComponent } from './componentes/liquidaciones/liquidaciones.component';
import { DetalleProdComponent } from './componentes/detalle-prod/detalle-prod.component';
import { ContactosComponent } from './componentes/contactos/contactos.component';
import { ComoVenderComponent } from './componentes/como-vender/como-vender.component';
import { ComoComprarComponent } from './componentes/como-comprar/como-comprar.component';
import { BlogComponent } from './componentes/blog/blog/blog.component';

import {RegistroUsuarioService} from './servicios/registro-usuario.service';
import { DatePipe } from '@angular/common';
import { ErrorComponent } from './componentes/error/error.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { LoginComponent } from './componentes/login/login.component';
import { PanelComponent } from './componentes/panel/panel.component';
import { AuthGuard} from './guards/auth.guard';
import {MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatDatepickerModule, MatFormFieldModule, MatInputModule,MatNativeDateModule,MatDialogModule} from '@angular/material';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {RatingModule} from 'ng-starrating';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { AsyncPipe } from '../../node_modules/@angular/common';
import {MessagingService} from '../../src/app/servicios/messaging.service';
import * as firebase from 'firebase';
import { AngularFireDatabaseModule } from '@angular/fire/database';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    FooterComponent,
    PreguntasFrecuentesComponent,
    TerminosCondicionesComponent,
    VideosComponent,
    PoliticasDePrivacidadComponent,
    NosotrosComponent,
    LiquidacionesComponent,
    DetalleProdComponent,
    ContactosComponent,
    ComoVenderComponent,
    ComoComprarComponent,
    BlogComponent,
    ErrorComponent,
    LoginComponent,
    PanelComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularFireStorageModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    NgbModule,
    RatingModule,
    SimpleNotificationsModule.forRoot({position : [ 'bottom' , 'right' ]}),
    AngularFireMessagingModule,
    AngularFireDatabaseModule


  ],
  providers: [AuthService, ItemService, AngularFireDatabase, ModalServiceService,FormBuilder,RegistroUsuarioService,DatePipe,AuthGuard,{provide: LocationStrategy, useClass: HashLocationStrategy},MessagingService, AsyncPipe],
  bootstrap: [AppComponent],
  exports: [BsDropdownModule, TooltipModule, ModalModule]
})
export class AppModule { }
