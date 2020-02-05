export class ofertaLiquidacion{
    cancelado?: number;
    correo: string;
    entrega: string;
    estado:number;
    fecha_atencion:string;
    fecha_entrega:string;
    fecha_oferta:string;
    fecha_realentrega:string;
    id_requerimiento:string;
    moneda:string;
    nombre:string;
    nombreusuario:string;
    presupuesto:number;
    revision:number;
    tipo:number;
    tipoUsuario:number;
    ubicacion?:number;
    usuario:string;

    constructor(correo,entrega,fecha_oferta,id_requerimiento,moneda,nombre,nombreusuario,presupuesto,tipo,tipoUsuario,ubicacion,usuario) {
      this.cancelado = 0;
      this.correo = correo;
      this.entrega = entrega;
      this.estado = 0;
      this.fecha_atencion ="default";
      this.fecha_entrega = "default";
      this.fecha_oferta = fecha_oferta;
      this.fecha_realentrega ="default";
      this.id_requerimiento = id_requerimiento;
      this.moneda = moneda;
      this.nombre = nombre;
      this.nombreusuario = nombreusuario;
      this.presupuesto = presupuesto;
      this.revision = 0;
      this.tipo = tipo;
      this.tipoUsuario = tipoUsuario;
      this.ubicacion = ubicacion;
      this.usuario = usuario;

     }
  }
  
