import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import firebase from '@firebase/app';

@Injectable({
  providedIn: 'root'
})
export class RegistroRequerimientosService {

  constructor(
    public af: AngularFireDatabase
  ) { }
  addBien(data){
    var x = this.af.list('/Requerimientos').query.ref.push(data);
    return x.key;
  }
  addLiquidacion(data){
    var x = this.af.list('/Liquidacion').query.ref.push(data);
    return x.key;
  }
  addTrabajo(data){
    var x = this.af.list('/Puesto_Trabajo').query.ref.push(data);
    return x.key;
  }
  updateImagen(url,tipo,idReq){
    if(tipo===1){
      this.af.list('/Requerimientos/'+idReq+'/imagenes/').query.ref.push({nombre: url});
      var imgprincipal = this.af.database.ref('/Requerimientos/'+idReq);
      imgprincipal.once('value').then(x => {
        if(x.child('imagenprincipal').val()==='default'){
          imgprincipal.update({imagenprincipal: url});
        }
      })
    }
    if(tipo===3){
      this.af.list('/Liquidacion/'+idReq+'/imagenes/').query.ref.push({nombre: url});
      var imgprincipal = this.af.database.ref('/Liquidacion/'+idReq);
      imgprincipal.once('value').then(x => {
        if(x.child('imagenprincipal').val()==='default'){
          imgprincipal.update({imagenprincipal: url});
        }
      })
    }
    if(tipo===4){
      this.af.list('/Puesto_Trabajo/'+idReq+'/imagenes/').query.ref.push({nombre: url});
      var imgprincipal = this.af.database.ref('/Puesto_Trabajo/'+idReq);
      imgprincipal.once('value').then(x => {
        if(x.child('imagenprincipal').val()==='default'){
          imgprincipal.update({imagenprincipal: url});
        }
      })
    }
  }

  updateFile(url,tipo,idReq){
    if(tipo===1){
      this.af.list('/Requerimientos/'+idReq).query.ref.update({documento: url});
    }
    if(tipo===3){
      this.af.list('/Liquidacion/'+idReq).query.ref.update({documento: url});
    }
    if(tipo===4){
      this.af.list('/Puesto_Trabajo/'+idReq).query.ref.update({documento: url});
    }
  }

  deleteReq(key,tipo){
    if(tipo===1 || tipo ===2){
      this.af.list('/Requerimientos/'+key).query.ref.update({estado:7});
    }
    if(tipo===3){
      this.af.list('/Liquidacion/'+key).query.ref.update({estado:7});
    }
    if(tipo===4){
      this.af.list('/Puesto_Trabajo/'+key).query.ref.update({estado:7});
    }
  }
  deleteOferta(key,tipo,item){
    if(tipo===1 || tipo ===2){
      this.af.object('/Oferta_Requerimiento/'+key).remove();
      this.updateDeleteCantidadOferta(item,tipo);
    }
    if(tipo===3){
      this.af.object('/Oferta_Liquidacion/'+key).remove();
      this.updateDeleteCantidadOferta(item,tipo);
    }
    if(tipo===4){
      this.af.object('/Oferta_Trabajo/'+key).remove();
      this.updateDeleteCantidadOferta(item,tipo);
    }
  }
  updateDeleteCantidadOferta(id,tipoProducto){
    if(tipoProducto===1 || tipoProducto===2){
      const ref = this.af.database.ref('/Requerimientos/'+id.id_requerimiento);
      ref.once('value').then(x =>{
        var cant_ofertas = x.child('cant_ofertas').val();
        ref.update({
          cant_ofertas: cant_ofertas-1
        })
      });
    }
    if(tipoProducto===3){
      const ref = this.af.database.ref('/Liquidacion/'+id.id_requerimiento);
      ref.once('value').then(x =>{
        var cant_ofertas = x.child('cant_ofertas').val();
        ref.update({
          cant_ofertas: cant_ofertas-1
        })
      });
    }
    if(tipoProducto===4){
      const ref = this.af.database.ref('/Puesto_Trabajo/'+id.id_requerimiento);
      ref.once('value').then(x =>{
        var cant_personal = x.child('cant_personal').val();
        ref.update({
          cant_personal: cant_personal-1
        })
      });
    }
  }
}
