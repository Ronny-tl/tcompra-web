export class ofertaRequerimiento{
    cancelado?: number;
    correo: string;
    documento:string
    entrega: string;
    envio:number;
    estado:number;
    fecha_atencion:string;
    fecha_entrega:string;
    fecha_oferta:string;
    fecha_realentrega:string;
    garantia:number;
    id_requerimiento:string;
    igv:number;
    imagenprincipal:string
    moneda:string;
    negociacion:number;
    nombre:string;
    nombreusuario:string;
    presupuesto:number;
    revision:number;
    soporte:number;
    tipo:number;
    tipoUsuario:number;
    ubicacion:number;
    usuario:string;
    rubro: string;
    fecha_final:string;
    constructor(correo,entrega,envio,fecha_oferta,garantia,id_requerimiento,igv,moneda,negociacion,nombre,nombreusuario,presupuesto,soporte,tipo,tipoUsuario,ubicacion,usuario) {
      this.cancelado = 0;
      this.correo = correo;
      this.documento = "default";
      this.entrega = entrega;
      this.envio = envio;
      this.estado = 0;
      this.fecha_atencion ="default";
      this.fecha_entrega = "default";
      this.fecha_oferta = fecha_oferta;
      this.fecha_realentrega ="default";
      this.garantia = garantia;
      this.id_requerimiento = id_requerimiento;
      this.igv = igv;
      this.imagenprincipal = "default";
      this.moneda = moneda;
      this.negociacion = negociacion;
      this.nombre = nombre;
      this.nombreusuario = nombreusuario;
      this.presupuesto = presupuesto;
      this.revision = 0;
      this.soporte = soporte;
      this.tipo = tipo;
      this.tipoUsuario = tipoUsuario;
      this.ubicacion = ubicacion;
      this.usuario = usuario;

     }
  }
  
