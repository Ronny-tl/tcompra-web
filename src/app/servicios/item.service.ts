import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Observable} from 'rxjs/observable';
import {usuario} from '../models/usuario'; 
import { requerimientos } from '../models/requerimientos';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ItemService {
itemsCollection: AngularFirestoreCollection<requerimientos>;
markersRef: AngularFireList<any>;
req: Observable<requerimientos[]>;

appsRef: AngularFireList<any>;

productList: any;

  constructor(
    public afs: AngularFirestore,
    private db: AngularFireDatabase
    ) {
    //this.req = this.afs.collection('Requerimientos').valueChanges();
   }
  getOferta_Requerimiento() {
    this.markersRef = this.db.list('Oferta_Requerimiento');
    return this.editMarkers(this.markersRef);
  }
  getOferta_Liquidacion() {
    this.markersRef = this.db.list('Oferta_Liquidacion');
    return this.editMarkers(this.markersRef);
  }
  getOferta_Puesto_Trabajo() {
    this.markersRef = this.db.list('Oferta_Trabajo');
    return this.editMarkers(this.markersRef);
  }
  
  listarRequerimientos() {
    this.appsRef = this.db.list('Requerimientos');
    return this.appsRef;
  }
  listarLiquidacion() {
    this.appsRef = this.db.list('Liquidacion');
    return this.appsRef;
  }
  listarPuestoTrabajo() {
    this.appsRef = this.db.list('Puesto_Trabajo');
    return this.appsRef;
  }
  listarOfertasRequerimiento(){
    this.appsRef = this.db.list('Oferta_Requerimiento');
    return this.appsRef;
  }   
  getItems(){
    return this.req;
  }
  getRequerimientosPanel() {
    this.markersRef = this.db.list('Requerimientos');
    return this.editMarkers(this.markersRef);
  }
  getLiquidacionPanel() {
    this.markersRef = this.db.list('Liquidacion');
    return this.editMarkers(this.markersRef);
  }
  getTrabajoPanel() {
    this.markersRef = this.db.list('Puesto_Trabajo');
    return this.editMarkers(this.markersRef);
  }
  getOrdenCompra() {
    this.markersRef = this.db.list('OrdenCompra');
    return this.editMarkers(this.markersRef);
  }
  getDepartamento() {
    this.markersRef = this.db.list('Departamento');
    return this.editMarkers(this.markersRef);
  }
  getJornada() {
    this.markersRef = this.db.list('Jornada');
    return this.editMarkers(this.markersRef);
  }
  getAntiguedad() {
    this.markersRef = this.db.list('Antiguedad');
    return this.editMarkers(this.markersRef);
  }
  getTipoEmpresa() {
    this.markersRef = this.db.list('Tipo');
    return this.editMarkers(this.markersRef);
  }
  getMoneda() {
    this.markersRef = this.db.list('Moneda');
    return this.editMarkers(this.markersRef);
  }
  getEntrega() {
    this.markersRef = this.db.list('Entrega');
    return this.editMarkers(this.markersRef);
  }
  getFormaPago() {
    this.markersRef = this.db.list('Formapago');
    return this.editMarkers(this.markersRef);
  }
  getRubros() {
    this.markersRef = this.db.list('Rubros');
    return this.editMarkers(this.markersRef);
  }
  listarRequerimientos2(id) {
    return this.db.object('/Requerimientos/' + id).snapshotChanges();
  }
  listarLiquidacion2(id) {
    return this.db.object('/Liquidacion/' + id).snapshotChanges();
  }
  listarPuestoTrabajo2(id) {
    return this.db.object('/Puesto_Trabajo/' + id).snapshotChanges();
  }
  getRubro(id) {
    return this.db.object('/Rubros/' + id).snapshotChanges();
  }
  getFormaPagoID(id) {
    return this.db.object('/Formapago/' + id).snapshotChanges();
  }
  getMonedaID(id) {
    return this.db.object('/Moneda/' + id).snapshotChanges();
  }
  getEntregaID(id) {
    return this.db.object('/Entrega/' + id).snapshotChanges();
  }
  getDepartamento2(id) {
    return this.db.object('/Departamento/' + id).snapshotChanges();
  }
  getUsuarioEmpresa(id) {
    return this.db.object('/Empresa/' + id).snapshotChanges();
  }
  getUsuarioPersona(id) {
    return this.db.object('/Persona/' + id).snapshotChanges();
  }
  getTipo(id) {
    return this.db.object('/Tipo/' + id).snapshotChanges();
  }
  getAntiguedad2(id) {
    return this.db.object('/Antiguedad/' + id).snapshotChanges();
  }
  getUsuarioEmpresa2(id){
    this.markersRef = this.db.list('Empresa/'+id);
    return this.markersRef;
  }   
  getUsuarioPersona2(id){
    this.markersRef = this.db.list('Persona/'+id);
    return this.markersRef;
  }
  oferta_Requerimiento_once(id){ //// LISTA SOLO UNA VEZ
    this.markersRef = this.db.list('Oferta_Requerimiento/'+id);
    return this.markersRef;
  }
  Requerimiento_once(id){ //// LISTA SOLO UNA VEZ
    this.markersRef = this.db.list('Requerimientos/'+id);
    return this.markersRef;
  }
  oferta_Liquidacion_once(id){ //// LISTA SOLO UNA VEZ
    this.markersRef = this.db.list('Oferta_Liquidacion/'+id);
    return this.markersRef;
  }
  Liquidacion_once(id){ //// LISTA SOLO UNA VEZ
    this.markersRef = this.db.list('Liquidacion/'+id);
    return this.markersRef;
  }
  ordenCompra_once(id){ //// LISTA SOLO UNA VEZ
    this.markersRef = this.db.list('OrdenCompra/'+id);
    return this.markersRef;
  }
  oferta_Trabajo_once(id){ //// LISTA SOLO UNA VEZ
    this.markersRef = this.db.list('Oferta_Trabajo/'+id);
    return this.markersRef;
  }
  Trabajo_once(id){ //// LISTA SOLO UNA VEZ
    this.markersRef = this.db.list('Puesto_Trabajo/'+id);
    return this.markersRef;
  }
  citas_once(){ //// LISTA SOLO UNA VEZ
    this.markersRef = this.db.list('Citas/');
    return this.markersRef;
  }

  editMarkers(marker: AngularFireList<any>) {
    return marker.snapshotChanges().pipe(map(items => {
      return items.map(a => {
        const data = a.payload.val();
        const key = a.payload.key;
        return { key, data };
      });
    }));
  }


}

