export class ofertaTrabajo{
    cancelado: number;
    correo: string;
    disponibilidad: string;//
    documento:string;//
    estado:number;
    fecha_atencion:string;
    fecha_entrega:string;
    fecha_oferta:string;
    fecha_realentrega:string;
    id_requerimiento:string;
    imagenprincipal:string //
    moneda:string;
    negociacion:number//
    nombre:string;
    nombreusuario:string;
    revision:number;
    sueldo:number;//
    tipo:number;
    tipoUsuario:number;
    ubicacion:number;
    usuario:string;

    constructor(correo,disponibilidad,fecha_oferta,id_requerimiento,moneda,negociacion,nombre,nombreusuario,sueldo,tipo,tipoUsuario,ubicacion,usuario) {
      this.cancelado = 0;
      this.correo = correo;
      this.disponibilidad = disponibilidad;
      this.estado = 0;
      this.fecha_atencion ="default";
      this.fecha_entrega = "default";
      this.fecha_oferta = fecha_oferta;
      this.fecha_realentrega ="default";
      this.id_requerimiento = id_requerimiento;
      this.imagenprincipal = "default";
      this.moneda = moneda;
      this.negociacion = negociacion;
      this.nombre = nombre;
      this.nombreusuario = nombreusuario;
      this.sueldo = sueldo;
      this.revision = 0;
      this.tipo = tipo;
      this.tipoUsuario = tipoUsuario;
      this.ubicacion = ubicacion;
      this.usuario = usuario;
      this.documento = "default";

     }
  }
  
