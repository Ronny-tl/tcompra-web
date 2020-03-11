import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import firebase from '@firebase/app';
@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {

  constructor(
    public af: AngularFireDatabase
  ) { }

  generarOrdenCompraRequerimiento(itemProveedor,itemCliente,fecha_compra){
    var t_fecha_e = fecha_compra.split('-');
    var x = this.af.list('/OrdenCompra/').query.ref.push({
      antiguedad:0,
      calificacionBien:0,
      calificacionMal:0,
      cancelado:0,
      confirmacionCliente:0,
      confirmacionProveedor:0,
      documento:"default",
      estado:0,
      fechaCancelar:"",
      fechaCompra: t_fecha_e[2]+"-"+t_fecha_e[1]+"-"+t_fecha_e[0],
      idCliente: itemCliente.usuario,
      idOferta: itemProveedor.keyOferta,
      idProveedor: itemProveedor.keyUsuario,
      idRequerimiento: itemProveedor.id_requerimiento,
      tipo: itemCliente.tipo,
      tipoCliente: itemCliente.tipoUsuario,
      tipoProveedor: itemProveedor.tipoUsuario
    });
    this.af.list('/Oferta_Requerimiento/'+itemProveedor.keyOferta).query.ref.update({
      fecha_atencion: t_fecha_e[2]+"-"+t_fecha_e[1]+"-"+t_fecha_e[0],
      fecha_entrega: this.calcularFechaEntrega(itemProveedor.tiempoEntrega,fecha_compra)
    })
    this.af.list('/Requerimientos/'+itemProveedor.id_requerimiento).query.ref.update({
      comprador: itemProveedor.keyUsuario,
      estado:2,
      fecha_atencion:t_fecha_e[2]+"-"+t_fecha_e[1]+"-"+t_fecha_e[0],
      oferta: itemProveedor.keyOferta,
      ordencompra: x.key
    })
    alert("Orden de compra generada");
    return x.key;

  }
  generarOrdenCompraLiquidacion(itemProveedor,itemCliente,fecha_compra){
    var t_fecha_e = fecha_compra.split('-');
    var x = this.af.list('/OrdenCompra/').query.ref.push({
      antiguedad:0,
      calificacionBien:0,
      calificacionMal:0,
      cancelado:0,
      confirmacionCliente:0,
      confirmacionProveedor:0,
      documento:"default",
      estado:0,
      fechaCancelar:"",
      fechaCompra: t_fecha_e[2]+"-"+t_fecha_e[1]+"-"+t_fecha_e[0],
      idCliente: itemCliente.usuario,
      idOferta: itemProveedor.keyOferta,
      idProveedor: itemProveedor.keyUsuario,
      idRequerimiento: itemProveedor.id_requerimiento,
      tipo: itemCliente.tipo,
      tipoCliente: itemCliente.tipoUsuario,
      tipoProveedor: itemProveedor.tipoUsuario
    });
    this.af.list('/Oferta_Liquidacion/'+itemProveedor.keyOferta).query.ref.update({
      fecha_atencion: t_fecha_e[2]+"-"+t_fecha_e[1]+"-"+t_fecha_e[0],
      fecha_entrega: this.calcularFechaEntrega(itemProveedor.tiempoEntrega,fecha_compra)
    })
    this.af.list('/Liquidacion/'+itemProveedor.id_requerimiento).query.ref.update({
      comprador: itemProveedor.keyUsuario,
      estado:2,
      fecha_atencion:t_fecha_e[2]+"-"+t_fecha_e[1]+"-"+t_fecha_e[0],
      oferta: itemProveedor.keyOferta,
      ordencompra: x.key
    })
    
    alert("Orden de compra generada");
    return x.key;
  }
generarCitaTrabajo(item,itemReq,fecha_cita,hora_cita,mensaje_cita,fecha_actual){
  var t_fecha_e = fecha_actual.split('-');
    var x = this.af.list('/Citas/').query.ref.push({
      cancelado: 0,
      fechaCita: fecha_cita,
      horaCita: hora_cita,
      idOferta: item.keyOferta,
      idPostulante: item.keyUsuario,
      idRecurso: item.id_requerimiento,
      mensaje: mensaje_cita
    });
    this.af.list('/Oferta_Trabajo/'+item.keyOferta).query.ref.update({
      fecha_atencion: t_fecha_e[2]+"-"+t_fecha_e[1]+"-"+t_fecha_e[0],
      fecha_entrega: this.calcularFechaEntrega(item.tiempoEntrega,fecha_actual)
    })
    this.af.list('/Puesto_Trabajo/'+item.id_requerimiento).query.ref.update({
      cant_citas: itemReq.cant_citas+1
    })
    alert("Cita generada satisfactoriamente");
    return x.key;
}

  calcularFechaEntrega(entrega,fecha_compra){
    //console.log(entrega);
    if(entrega==="Inmediato"){
      var t2 = fecha_compra.split("-");
      console.log('entro 1');
      return t2[2]+"-"+t2[1+"-"]+t2[0];
    }
    if(entrega==="más de 15 días"){
      var temp_f_a = fecha_compra.split('-');
      var fecha_nueva = new Date(Number(temp_f_a[0]),Number(temp_f_a[1]),Number(temp_f_a[2]));
      fecha_nueva.setDate(fecha_nueva.getDate()+16)
      //console.log('entro 2');
      return fecha_nueva.getDate()+"-"+fecha_nueva.getMonth()+"-"+fecha_nueva.getFullYear();
    }
      //console.log('entro 3');
      var temp_entrega = entrega.split(' ');
      var temp_f_a = fecha_compra.split('-');
      var fecha_nueva = new Date(Number(temp_f_a[0]),Number(temp_f_a[1]),Number(temp_f_a[2]));
      fecha_nueva.setDate(fecha_nueva.getDate()+Number(temp_entrega[0]))
      return fecha_nueva.getDate()+"-"+fecha_nueva.getMonth()+"-"+fecha_nueva.getFullYear();
    
  }

}
