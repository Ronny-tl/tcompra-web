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

  culminarReqCliente(item,select,c1,c2,c3){
    const ref = this.af.list('Encuestas').query.ref.push({
      calificado: item.comprador,
      calificador: item.keyUsuario,
      idOferta: item.oferta,
      idRequerimiento: item.key,
      pregunta1: Number(c1.value),
      pregunta2: Number(c2.value),
      pregunta3: Number(c3.value),
      tipo: item.tipo,
      tipoCalificacion: Number(select.value)
    })
    if(item.tipo===1 || item.tipo ===2){
      this.af.list('Requerimientos/'+item.key).query.ref.update({
        encuestaCliente: ref.key
      })
      alert('Requerimiento '+item.nombre+' culminado satisfactoriamente');
    }
    if(item.tipo===3){
      this.af.list('Liquidacion/'+item.key).query.ref.update({
        encuestaCliente: ref.key
      })
      alert('Liquidacion '+item.nombre+' culminado satisfactoriamente');
    }

    this.af.database.ref('OrdenCompra/'+item.ordencompra).ref.once('value').then(data => {
      if(data.child('tipoProveedor').val()===0){////EMPRESA
        if(Number(select.value)===0){

          this.af.list('Empresa/'+item.comprador+'/CalificacionProveedorMal/').query.ref.push({
            calificacion: (c1.value+c2.value+c3.value)/3,
            idEncuesta: ref.key
          })
          this.af.database.ref('Empresa/'+item.comprador+'/CalificacionProveedorMal/').ref.once('value').then(data => {
            let total = 0;
            data.forEach(x => {
              total = total + x.child('calificacion').val()
            })
            this.af.list('Empresa/'+item.comprador).query.ref.update({
              calificacionProveedorMal: total/data.numChildren()
            })
            c1.value = 0;
            c2.value = 0;
            c3.value = 0;
            select.value = "NA";
          })
        }
        if(Number(select.value)===1){
          this.af.list('Empresa/'+item.comprador+'/CalificacionProveedorBien/').query.ref.push({
            calificacion: (c1.value+c2.value+c3.value)/3,
            idEncuesta: ref.key
          })
          this.af.database.ref('Empresa/'+item.comprador+'/CalificacionProveedorBien/').ref.once('value').then(data => {
            let total = 0;
            data.forEach(x => {
              total = total + x.child('calificacion').val()
            })
            this.af.list('Empresa/'+item.comprador).query.ref.update({
              calificacionProveedorBien: total/data.numChildren()
            })
            c1.value = 0;
            c2.value = 0;
            c3.value = 0;
            select.value = "NA";
          })
        }
      }else{ /// PERSONA
        if(Number(select.value)===0){
          this.af.list('Persona/'+item.comprador+'/CalificacionProveedorMal/').query.ref.push({
            calificacion: (c1.value+c2.value+c3.value)/3,
            idEncuesta: ref.key
          })
          this.af.database.ref('Persona/'+item.comprador+'/CalificacionProveedorMal/').ref.once('value').then(data => {
            let total = 0;
            data.forEach(x => {
              total = total + x.child('calificacion').val()
            })
            this.af.list('Persona/'+item.comprador).query.ref.update({
              calificacionProveedorMal: total/data.numChildren()
            })
            c1.value = 0;
            c2.value = 0;
            c3.value = 0;
            select.value = "NA";

          })
        }
        if(Number(select.value)===1){
          this.af.list('Persona/'+item.comprador+'/CalificacionProveedorBien/').query.ref.push({
            calificacion: (c1.value+c2.value+c3.value)/3,
            idEncuesta: ref.key
          })
          this.af.database.ref('Persona/'+item.comprador+'/CalificacionProveedorBien/').ref.once('value').then(data => {
            let total = 0;
            data.forEach(x => {
              total = total + x.child('calificacion').val()
            })
            this.af.list('Persona/'+item.comprador).query.ref.update({
              calificacionProveedorBien: total/data.numChildren()
            })
            c1.value = 0;
            c2.value = 0;
            c3.value = 0;
            select.value = "NA";

          })

        }
      }
    })
  }

  culminarOfertaProveedor(item,select,c1,c2,c3){
    //console.log(item);
    const ref = this.af.list('Encuestas').query.ref.push({
      calificado: item.idCliente,
      calificador: item.idProveedor,
      idOferta: item.idOferta,
      idRequerimiento: item.idRequerimiento,
      pregunta1: Number(c1.value),
      pregunta2: Number(c2.value),
      pregunta3: Number(c3.value),
      tipo: item.tipo,
      tipoCalificacion: Number(select.value)
    })
    if(item.tipo===1 || item.tipo ===2){
      this.af.list('Requerimientos/'+item.idRequerimiento).query.ref.update({
        encuestaProveedor: ref.key
      })
      alert('Oferta culminado satisfactoriamente');
    }
    if(item.tipo===3){
      this.af.list('Liquidacion/'+item.idRequerimiento).query.ref.update({
        encuestaProveedor: ref.key
      })
      alert('Oferta culminado satisfactoriamente');
    }

  
      if(item.tipoCliente===0){////EMPRESA
        if(Number(select.value)===0){
          this.af.list('Empresa/'+item.idCliente+'/CalificacionClienteMal/').query.ref.push({
            calificacion: (c1.value+c2.value+c3.value)/3,
            idEncuesta: ref.key
          })
          this.af.database.ref('Empresa/'+item.idCliente+'/CalificacionClienteMal/').ref.once('value').then(data => {
            let total = 0;
            data.forEach(x => {
              total = total + x.child('calificacion').val()
            })
            this.af.list('Empresa/'+item.idCliente).query.ref.update({
              calificacionClienteMal: total/data.numChildren()
            })
            c1.value = 0;
            c2.value = 0;
            c3.value = 0;
            select.value = "NA";
          })
        }
        if(Number(select.value)===1){
          this.af.list('Empresa/'+item.idCliente+'/CalificacionClienteBien/').query.ref.push({
            calificacion: (c1.value+c2.value+c3.value)/3,
            idEncuesta: ref.key
          })
          this.af.database.ref('Empresa/'+item.idCliente+'/CalificacionClienteBien/').ref.once('value').then(data => {
            let total = 0;
            data.forEach(x => {
              total = total + x.child('calificacion').val()
            })
            this.af.list('Empresa/'+item.idCliente).query.ref.update({
              calificacionClienteBien: total/data.numChildren()
            })
            c1.value = 0;
            c2.value = 0;
            c3.value = 0;
            select.value = "NA";
          })
        }
      }if(item.tipoCliente===1){ /// PERSONA
        if(Number(select.value)===0){
          this.af.list('Persona/'+item.idCliente+'/CalificacionClienteMal/').query.ref.push({
            calificacion: (c1.value+c2.value+c3.value)/3,
            idEncuesta: ref.key
          })
          this.af.database.ref('Persona/'+item.idCliente+'/CalificacionClienteMal/').ref.once('value').then(data => {
            let total = 0;
            data.forEach(x => {
              total = total + x.child('calificacion').val()
            })
            this.af.list('Persona/'+item.idCliente).query.ref.update({
              calificacionClienteMal: total/data.numChildren()
            })
            c1.value = 0;
            c2.value = 0;
            c3.value = 0;
            select.value = "NA";

          })
        }
        if(Number(select.value)===1){
          this.af.list('Persona/'+item.idCliente+'/CalificacionClienteBien/').query.ref.push({
            calificacion: (c1.value+c2.value+c3.value)/3,
            idEncuesta: ref.key
          })
          this.af.database.ref('Persona/'+item.idCliente+'/CalificacionClienteBien/').ref.once('value').then(data => {
            let total = 0;
            data.forEach(x => {
              total = total + x.child('calificacion').val()
            })
            this.af.list('Persona/'+item.idCliente).query.ref.update({
              calificacionClienteBien: total/data.numChildren()
            })
            c1.value = 0;
            c2.value = 0;
            c3.value = 0;
            select.value = "NA";

          })

        }
      }
    
  }
  
}
