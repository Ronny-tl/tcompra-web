export class crearTrabajo{
    cant_citas: number;
    cant_personal:number;
    correo: string;//
    departamento:number;//
    descripcion:string;//
    disponiblidad:string;
    documento:string
    estado:number;
    fecha_final:string;//
    fecha_publicacion:string;
    imagenprincipal:string
    jornada:string;
    moneda:string;//
    nombre:string;//
    rubro:string;//
    sueldo:number;
    tipo:number;//
    tipoUsuario:number;
    usuario:string;

    constructor(nombre,descripcion,tipoRequerimiento,rubro,departamento,sueldo,moneda,disponibilidad,correo,fecha_final,jornada,fecha_publicacion,tipoUsuario,usuario) {
      this.cant_citas = 0;
      this.cant_personal = 0;
      this.documento = "default";
      this.estado = 1;
      this.fecha_publicacion = fecha_publicacion;
      this.imagenprincipal = "default";
      this.tipoUsuario =tipoUsuario;
      this.usuario = usuario;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.tipo = tipoRequerimiento;
      this.rubro = rubro;
      this.departamento = departamento;
      this.sueldo = sueldo;
      this.moneda = moneda;
      this.correo = correo;
      this.fecha_final = fecha_final;
      this.disponiblidad = disponibilidad;
      this.jornada = jornada;
     }

  }
  
