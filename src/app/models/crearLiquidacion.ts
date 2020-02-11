export class crearLiquidacion{
    cant_ofertas:number;
    comprador: string;
    correo: string;//
    departamento:number;//
    descripcion:string;//
    documento:string
    encuestaCliente:string;
    encuestaProveedor:string;
    entrega: string;//
    estado:number;
    fecha_atencion:string;
    fecha_final:string;//
    fecha_publicacion:string;
    formapago:string;//
    imagenprincipal:string
    moneda:string;//
    nombre:string;//
    oferta:string;
    ordencompra:string;
    presupuesto:number;//
    rubro:string;//
    tipo:number;//
    tipoUsuario:number;
    usuario:string;


    constructor(nombre,descripcion,tipoRequerimiento,rubro,departamento,presupuesto,moneda,formapago,correo,fecha_final,entrega,fecha_publicacion,tipoUsuario,usuario) {
      this.cant_ofertas = 0;
      this.comprador ="default";
      this.documento = "default";
      this.encuestaCliente ="default";
      this.encuestaProveedor ="default";
      this.estado = 1;
      this.fecha_atencion = "default";
      this.fecha_publicacion = fecha_publicacion;
      this.imagenprincipal = "default";
      this.oferta ="default";
      this.ordencompra = "default";
      this.tipoUsuario =tipoUsuario;
      this.usuario = usuario;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.tipo = tipoRequerimiento;
      this.rubro = rubro;
      this.departamento = departamento;
      this.presupuesto = presupuesto;
      this.moneda = moneda;
      this.formapago = formapago;
      this.correo = correo;
      this.fecha_final = fecha_final;
      this.entrega = entrega;
     }

  }
  
