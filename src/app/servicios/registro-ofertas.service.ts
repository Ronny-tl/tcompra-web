import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import firebase from '@firebase/app';

@Injectable({
  providedIn: 'root'
})
export class RegistroOfertasService {
  constructor(
    public af: AngularFireDatabase
    
    ) { }

  addOferta(data,tipoProducto,id){
    if(tipoProducto==="1" || tipoProducto==="2"){
      //console.log(data);
      const ref = this.af.list('/Oferta_Requerimiento/').query.ref.push(data);
      var key = ref.key;
      //ref.set(data);
      this.updateCantidadOferta(id,tipoProducto)
      return(key);
    }
    if(tipoProducto==="3"){
      const ref = this.af.list('/Oferta_Liquidacion/').query.ref.push(data);
      var key = ref.key;
      //ref.set(data);
      this.updateCantidadOferta(id,tipoProducto)
      return(key);
    }
    if(tipoProducto==="4"){
      const ref = this.af.list('/Oferta_Trabajo/').query.ref.push(data);
      var key = ref.key;
      //ref.set(data);
      this.updateCantidadOferta(id,tipoProducto)
      return(key);
    }
  }

  updateCantidadOferta(id,tipoProducto){
    if(tipoProducto==="1" || tipoProducto==="2"){
      const ref = this.af.database.ref('/Requerimientos/'+id);
      ref.once('value').then(x =>{
        var cant_ofertas = x.child('cant_ofertas').val();
        ref.update({
          cant_ofertas: cant_ofertas+1
        })
      });
    }
    if(tipoProducto==="3"){
      const ref = this.af.database.ref('/Liquidacion/'+id);
      ref.once('value').then(x =>{
        var cant_ofertas = x.child('cant_ofertas').val();
        ref.update({
          cant_ofertas: cant_ofertas+1
        })
      });
    }
    if(tipoProducto==="4"){
      const ref = this.af.database.ref('/Puesto_Trabajo/'+id);
      ref.once('value').then(x =>{
        var cant_personal = x.child('cant_personal').val();
        ref.update({
          cant_personal: cant_personal+1
        })
      });
    }
  }
  updateImagen(url,tipo,idOferta){
    if(tipo===1){
      this.af.list('/Oferta_Requerimiento/'+idOferta+'/imagenes/').query.ref.push({nombre: url});
    }
    if(tipo===3){
      this.af.list('/Oferta_Liquidacion/'+idOferta+'/imagenes/').query.ref.push({nombre: url});
    }
    if(tipo===4){
      this.af.list('/Oferta_Trabajo/'+idOferta+'/imagenes/').query.ref.push({nombre: url});
    }
  }
  updateFile(url,tipo,idOferta){
    if(tipo===1){
      this.af.list('/Oferta_Requerimiento/'+idOferta).query.ref.update({documento: url});
    }
    if(tipo===3){
      this.af.list('/Oferta_Liquidacion/'+idOferta).query.ref.update({documento: url});
    }
    if(tipo===4){
      this.af.list('/Oferta_Trabajo/'+idOferta).query.ref.update({documento: url});
    }
  }
  eliminarOferta(idOferta,tipoProducto,id_req){
    if(tipoProducto==="1" || tipoProducto==="2"){
      this.af.object('/Oferta_Requerimiento/'+idOferta).remove();
      //this.af.list('/Oferta_Requerimiento/'+idOferta).query.ref.remove();
      this.updateDeleteCantidadOferta(id_req,tipoProducto);
    }
    if(tipoProducto==="3"){
      this.af.object('/Oferta_Liquidacion/'+idOferta).remove();
      //this.af.list('/Oferta_Liquidacion/'+idOferta).query.ref.remove();
      this.updateDeleteCantidadOferta(id_req,tipoProducto);
    }
    if(tipoProducto==="4"){
      this.af.object('/Oferta_Trabajo/'+idOferta).remove();
      //this.af.list('/Oferta_Trabajo/'+idOferta).query.ref.remove();
      this.updateDeleteCantidadOferta(id_req,tipoProducto);
    }
  }

  updateDeleteCantidadOferta(id,tipoProducto){
    if(tipoProducto==="1" || tipoProducto==="2"){
      const ref = this.af.database.ref('/Requerimientos/'+id);
      ref.once('value').then(x =>{
        var cant_ofertas = x.child('cant_ofertas').val();
        ref.update({
          cant_ofertas: cant_ofertas-1
        })
      });
    }
    if(tipoProducto==="3"){
      const ref = this.af.database.ref('/Liquidacion/'+id);
      ref.once('value').then(x =>{
        var cant_ofertas = x.child('cant_ofertas').val();
        ref.update({
          cant_ofertas: cant_ofertas-1
        })
      });
    }
    if(tipoProducto==="4"){
      const ref = this.af.database.ref('/Puesto_Trabajo/'+id);
      ref.once('value').then(x =>{
        var cant_personal = x.child('cant_personal').val();
        ref.update({
          cant_personal: cant_personal-1
        })
      });
    }
  }


}
