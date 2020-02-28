import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { FormGroup, FormControl, FormArray, FormsModule } from '@angular/forms';
import { ItemService } from '../../servicios/item.service';
import {RegistroUsuarioService} from '../../servicios/registro-usuario.service';
import {AngularFireStorage} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import {crearRequerimiento } from '../../models/crearRequerimiento';
import { DatePipe } from '@angular/common';
import {RegistroRequerimientosService} from '../../servicios/registro-requerimientos.service'
import {crearLiquidacion} from '../../models/crearLiquidacion';
import {crearTrabajo} from '../../models/crearTrabajo';
import {OrdenCompraService} from '../../servicios/orden-compra.service';
import {NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {usuario} from '../../models/usuario';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  //myInput= "asdasd";
  hideRRHH: boolean = true;
  public labels: any = {
    previousLabel: 'Atras',
    nextLabel: 'Siguiente'
};
  
  myDate = new Date();
  nombreCompleto:string;
  uidUsuario: string;
  logoUsuario:boolean=false;
  tipoUsuario:string;
  tipoUsuarioNumber:number;
  usuario: any;
  rubros = [];
  requerimiento_bien= [];
  requerimiento_servicio = [];
  requerimiento_liquidacion = [];
  requerimiento_trabajo = [];
  oferta_requerimiento_bien = [];
  oferta_requerimiento_servicio = [];
  oferta_requerimiento_liquidacion = [];
  oferta_requerimiento_trabajo = [];
  cot_requerimiento_bien = [];
  cot_requerimiento_servicio = [];
  cot_requerimiento_liquidacion = [];
  cot_requerimiento_trabajo = [];
  departamentoUsuario = undefined;
  antiguedadUsuario = undefined;
  tipoEmp = undefined;
  departamentos:any;
  allRubros:any;
  @ViewChild('inDireccion', { static: false }) inDireccion: ElementRef;
  @ViewChild('inTelefono', { static: false }) inTelefono: ElementRef;
  @ViewChild('inEspecialidad', { static: false }) inEspecialidad: ElementRef;
  @ViewChild('inRazon_Social', { static: false }) inRazon_Social: ElementRef;
  ///////////////////////
  imagenesCargadas: any;
  cantImagenes: number;
  cantFile: number;
  fileCargado: any;
  //////Creacion Bien//////
  @ViewChild('nombreBien', { static: false }) nombreBien: ElementRef;
  @ViewChild('descripcionBien', { static: false }) descripcionBien: ElementRef;
  @ViewChild('correoBien', { static: false }) correoBien: ElementRef;
  @ViewChild('presupuestoBien', { static: false }) presupuestoBien: ElementRef;
  @ViewChild('fecha_finalBien', { static: false }) fecha_finalBien: ElementRef;
  allMoneda = [];
  allEntrega = [];
  allFormaPago = [];
  allJornada = [];
  selectedDepartamentoBien: number = 0;
  selectedEntregaBien: string = '-LjS6ygVTMvasGPrdtqp';
  selectedMonedaBien: string = '-LjS7G05dji2dWV2Gft1';
  selectedRubroBien: string = '-LjS65S0NtwAABX-VuOg';
  selectedFormaPagoBien: string = '-LjvpvZRlL8_syrMkxOx';

  /////Creacion Servicio//////
  @ViewChild('nombreServicio', { static: false }) nombreServicio: ElementRef;
  @ViewChild('descripcionServicio', { static: false }) descripcionServicio: ElementRef;
  @ViewChild('correoServicio', { static: false }) correoServicio: ElementRef;
  @ViewChild('presupuestoServicio', { static: false }) presupuestoServicio: ElementRef;
  @ViewChild('fecha_finalServicio', { static: false }) fecha_finalServicio: ElementRef;
  selectedDepartamentoServicio: number = 0;
  selectedEntregaServicio: string = '-LjS6ygVTMvasGPrdtqp';
  selectedMonedaServicio: string = '-LjS7G05dji2dWV2Gft1';
  selectedRubroServicio: string = '-LjS65S0NtwAABX-VuOg';
  selectedFormaPagoServicio: string = '-LjvpvZRlL8_syrMkxOx';
  /////Creacion Liquidacion//////
  @ViewChild('nombreLiq', { static: false }) nombreLiq: ElementRef;
  @ViewChild('descripcionLiq', { static: false }) descripcionLiq: ElementRef;
  @ViewChild('correoLiq', { static: false }) correoLiq: ElementRef;
  @ViewChild('presupuestoLiq', { static: false }) presupuestoLiq: ElementRef;
  @ViewChild('fecha_finalLiq', { static: false }) fecha_finalLiq: ElementRef;
  selectedDepartamentoLiq: number = 0;
  selectedEntregaLiq: string = '-LjS6ygVTMvasGPrdtqp';
  selectedMonedaLiq: string = '-LjS7G05dji2dWV2Gft1';
  selectedRubroLiq: string = '-LjS65S0NtwAABX-VuOg';
  selectedFormaPagoLiq: string = '-LjvpvZRlL8_syrMkxOx';
  /////Creacion Puesto Trabajo //////
  @ViewChild('nombrePT', { static: false }) nombrePT: ElementRef;
  @ViewChild('descripcionPT', { static: false }) descripcionPT: ElementRef;
  @ViewChild('correoPT', { static: false }) correoPT: ElementRef;
  @ViewChild('presupuestoPT', { static: false }) presupuestoPT: ElementRef;
  @ViewChild('fecha_finalPT', { static: false }) fecha_finalPT: ElementRef;
  selectedDepartamentoPT: number = 0;
  selectedEntregaPT: string = '-LjS6ygVTMvasGPrdtqp';
  selectedMonedaPT: string = '-LjS7G05dji2dWV2Gft1';
  selectedRubroPT: string = '-LjS65S0NtwAABX-VuOg'
  selectedJornadaPT: string = '-LjS6SlPBOA29CcKypLS';

  //////// PAGINACION PANEL////////
  pageActual_1_1:number = 1;
  pageActual_1_2:number = 1;
  pageActual_1_3:number = 1;
  pageActual_1_4:number = 1;

  pageActual_2_1:number = 1;
  pageActual_2_2:number = 1;
  pageActual_2_3:number = 1;
  pageActual_2_4:number = 1;

  pageActual_3_1:number = 1;
  pageActual_3_2:number = 1;
  pageActual_3_3:number = 1;
  pageActual_3_4:number = 1;

  pageActual_4_1:number = 1;
  pageActual_4_2:number = 1;

  cant_Mis_Req_Bienes:number= 10;
  cant_Mis_Req_Servicios:number= 10;
  cant_Mis_Req_Liquidacion:number= 10;
  cant_Mis_Req_Trabajo:number= 10;

  cant_Mis_Ofe_Bienes: number = 10;
  cant_Mis_Ofe_Servicios: number = 10;
  cant_Mis_Ofe_Liquidacion: number = 10;
  cant_Mis_Ofe_Trabajo: number = 10;

  cant_Coti_Bienes:number = 10;
  cant_Coti_Servicios:number = 10;
  cant_Coti_Liquidacion:number = 10;
  cant_Coti_Trabajo:number = 10;

  cant_Ord_Emitido:number = 10;
  cant_Ord_Recibido:number = 10;
  ////////////////////////////
  //////CAMBIAR PASS ////////
  @ViewChild('passActual', { static: false }) passActual: ElementRef;
  @ViewChild('passNuevo1', { static: false }) passNuevo1: ElementRef;
  @ViewChild('passNuevo2', { static: false }) passNuevo2: ElementRef;

  ///////////// OFERTAS MODAL
  mi_req_ofertas:any;
  list_ofertantes = [];
  idModal:string;
  allAntiguedad = [];
  mi_liq_ofertas: any;
  list_ofertantes_liq = [];

  @ViewChild('modalCita', { static: false }) modalCita: ElementRef;
  @ViewChild('fechaCita', { static: false }) fechaCita: ElementRef;
  @ViewChild('horaCita', { static: false }) horaCita: ElementRef;
  @ViewChild('mensajeCita', { static: false }) mensajeCita: ElementRef;
  citaSeleccionada: any;
  fechaRepublicarSeleccionada: any;
  //@ViewChild('fechaRepublicar', { static: false }) fechaRepublicar: ElementRef;
  @ViewChild('modalRepublicar', { static: false }) modalRepublicar: ElementRef;
  ////calificaciones
  @ViewChild('calificacionClienteBien', { static: false }) calificacionClienteBien: ElementRef;
  @ViewChild('calificacionClienteMal', { static: false }) calificacionClienteMal: ElementRef;
  @ViewChild('calificacionProveedorBien', { static: false }) calificacionProveedorBien: ElementRef;
  @ViewChild('calificacionProveedorMal', { static: false }) calificacionProveedorMal: ElementRef;
  //modalReference: NgbModalRef; para el modal
  resumenGanador = {};
  resumenOfertas = [];
  itemCulminar: any;
  itemCulminarPro: any;
  @ViewChild('modalCulminar', { static: false }) modalCulminar: ElementRef;
  @ViewChild('modalCulminar2', { static: false }) modalCulminar2: ElementRef;
  deOferta: any;
  ordenCompraEmitidos = [];
  ordenCompraRecibidos = [];
  constructor(
    private authService: AuthService,
    private item: ItemService,
    private registroUsuario: RegistroUsuarioService,
    private storage: AngularFireStorage,
    private datePipe: DatePipe,
    private registroReq: RegistroRequerimientosService,
    private ordenCompra: OrdenCompraService,
    //private modalService: NgbModal //para el modal
  ) {
   
   }

  ngOnInit() {
    this.getUsuario();
    this.getEntrega();
    this.getMoneda();
    this.getDepartamento();
    this.getRubros();
    this.getFormaPago();
    this.getJornada();
    this.getAntiguedad();
    this.get_mis_requerimientos();
    this.get_mis_ofertas();
    this.get_mis_ordenes_compra();

  }
  getUsuario(){
    this.authService.getAuth().subscribe(auth =>{
      this.uidUsuario = auth.uid;
      this.authService.getUsuario_Empresa().subscribe(data => {
        data.forEach(item =>{
        if(item.key === auth.uid){
          //alert(auth.uid);
          this.usuario = item.data;
          this.tipoUsuario = "EMPRESA";
          this.hideRRHH = true;
          this.tipoUsuarioNumber = 0,
          this.datosComplementariosUsuario();
          if(item.data.imagen != "default"){
            this.logoUsuario = true;
          }
        }
        });
      });
      this.authService.getUsuario_Persona().subscribe(data => {
        data.forEach(item =>{
        if(item.key == auth.uid){
          //alert("persona");
          this.usuario = item.data;
          this.tipoUsuario = "PERSONA";
          this.hideRRHH = false;
          this.tipoUsuarioNumber = 1,
          this.datosComplementariosUsuario();
          if(item.data.imagen != "default"){
            this.logoUsuario = true;
          }
        }
        });
      });
    })
  }
  datosComplementariosUsuario(){
    this.getRubroUsuario(this.usuario.rubro1);
    this.getRubroUsuario(this.usuario.rubro2);
    this.getRubroUsuario(this.usuario.rubro3);
    this.getDepartamentoUsuario(this.usuario.departamento)
    this.getAntiguedadUsuario(this.usuario.antiguedad);
    this.getTipo(this.usuario.tipo_empresa);
  }
  getRubroUsuario(id){
    this.item.getRubro(id).subscribe(data =>{
      this.rubros.push(data.payload.val());
      //console.log(this.rubro);
    })
  }
  getDepartamentoUsuario(id){
    this.item.getDepartamento2(id).subscribe(data =>{
      this.departamentoUsuario = data.payload.val();
    })
  }
  getAntiguedadUsuario(id){
    this.item.getAntiguedad2(id).subscribe(data =>{
      this.antiguedadUsuario = data.payload.val();
    })
  }
  getTipo(id){
    this.item.getTipo(id).subscribe(data =>{
      this.tipoEmp = data.payload.val();
    })
  }
  actualizar_datos(){
    if(this.tipoUsuario==="EMPRESA"){
      let data = {
        direccion: this.inDireccion.nativeElement.value,
        telefono: this.inTelefono.nativeElement.value,
        especialidad: this.inEspecialidad.nativeElement.value,
        razon_social: this.inRazon_Social.nativeElement.value
      }
      this.registroUsuario.updateUsuario(data,this.tipoUsuario,this.uidUsuario);
    }
    if(this.tipoUsuario==="PERSONA"){
      let data = {
        direccion: this.inDireccion.nativeElement.value,
        telefono: this.inTelefono.nativeElement.value,
      }
      this.registroUsuario.updateUsuario(data,this.tipoUsuario,this.uidUsuario);
    }

  }
  updateImageUsuario(data){
    //console.log(files[0]);
    var selectedFile = data.target.files[0];
    var idxDot = selectedFile.name.lastIndexOf(".") + 1;
    var extFile = selectedFile.name.substr(idxDot, selectedFile.name.length).toLowerCase();
    if (extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "svg" || extFile === "gif") {
      if(this.tipoUsuario==="EMPRESA"){
        const ref = this.storage.ref('Empresa/'+this.uidUsuario);
        const task = this.storage.upload('Empresa/'+this.uidUsuario,data.target.files[0]);
        task.snapshotChanges().pipe(finalize(() => {
                    ref.getDownloadURL().subscribe(downloadURL => {
                        this.registroUsuario.updateImageUsuario(downloadURL,this.tipoUsuario,this.uidUsuario);
                    });
              })
          ).subscribe();
      }
      if(this.tipoUsuario==="PERSONA"){
        const ref = this.storage.ref('Persona/'+this.uidUsuario);
        const task = this.storage.upload('Persona/'+this.uidUsuario,data.target.files[0]);
        task.snapshotChanges().pipe(finalize(() => {
                    ref.getDownloadURL().subscribe(downloadURL => {
                        this.registroUsuario.updateImageUsuario(downloadURL,this.tipoUsuario,this.uidUsuario);
                    });
              })
          ).subscribe();
      }
    } else {
        alert("Formato de imagenes permitidas jpg/jpeg, png, gif");
    }
  }
  SalirSesion(){
    this.authService.logout();
  }
  get_mis_requerimientos(){
    this.item.getRequerimientosPanel().subscribe(data =>{
      this.requerimiento_bien=[];
      this.requerimiento_servicio=[];
      this.cot_requerimiento_bien=[];
      this.cot_requerimiento_servicio=[];
      data.forEach(x =>{
        if(x.data.usuario===this.uidUsuario){
          if(x.data.tipo===1){
            const datareq = {
              key: x.key,
              keyUsuario: x.data.usuario,
              nombre: x.data.nombre,
              rubro: this.findRubros(x.data.rubro).data.nombre,
              departamento: this.findDepartamento(x.data.departamento).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado,
              tipo: x.data.tipo,
              cant_ofertas: x.data.cant_ofertas,
              comprador: x.data.comprador,
              oferta: x.data.oferta,
              ordencompra: x.data.ordencompra

            }
            this.requerimiento_bien.push(datareq);

          }
          if(x.data.tipo===2){
            const datareq = {
              key: x.key,
              keyUsuario: x.data.usuario,
              nombre: x.data.nombre,
              rubro: this.findRubros(x.data.rubro).data.nombre,
              departamento: this.findDepartamento(x.data.departamento).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado,
              tipo: x.data.tipo,
              cant_ofertas: x.data.cant_ofertas,
              comprador: x.data.comprador,
              oferta: x.data.oferta,
              ordencompra: x.data.ordencompra
            }
            this.requerimiento_servicio.push(datareq);

          }
      }
      if(x.data.tipo===1){
        if(x.data.estado===1 || x.data.estado===2){
            const dataAll = {
              key: x.key,
              keyUsuario: x.data.usuario,
              nombre: x.data.nombre,
              rubro: this.findRubros(x.data.rubro).data.nombre,
              departamento: this.findDepartamento(x.data.departamento).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado,
              tipo: x.data.tipo,
              cant_ofertas: x.data.cant_ofertas
            }
            this.cot_requerimiento_bien.push(dataAll);
        }
      }
      if(x.data.tipo===2){
        if(x.data.estado===1 || x.data.estado===2){
          const dataAll = {
            key: x.key,
            keyUsuario: x.data.usuario,
            nombre: x.data.nombre,
            rubro: this.findRubros(x.data.rubro).data.nombre,
            departamento: this.findDepartamento(x.data.departamento).data.nombre,
            presupuesto: x.data.presupuesto,
            estado: x.data.estado,
            tipo: x.data.tipo,
            cant_ofertas: x.data.cant_ofertas
          }
          this.cot_requerimiento_servicio.push(dataAll);
        }
      }

      })
    })
    this.item.getLiquidacionPanel().subscribe(data =>{
      this.requerimiento_liquidacion =[];
      this.cot_requerimiento_liquidacion=[];
      data.forEach(x => {
        if(x.data.usuario === this.uidUsuario){
          const datareq = {
            key: x.key,
            keyUsuario: x.data.usuario,
            nombre: x.data.nombre,
            rubro: this.findRubros(x.data.rubro).data.nombre,
            departamento: this.findDepartamento(x.data.departamento).data.nombre,
            presupuesto: x.data.presupuesto,
            estado: x.data.estado,
            tipo: x.data.tipo,
            cant_ofertas: x.data.cant_ofertas,
            comprador: x.data.comprador,
            oferta: x.data.oferta,
            ordencompra: x.data.ordencompra
          }
          this.requerimiento_liquidacion.push(datareq);

        }
        if(x.data.estado===1 || x.data.estado===2){
          const dataAll = {
            key: x.key,
            keyUsuario: x.data.usuario,
            nombre: x.data.nombre,
            rubro: this.findRubros(x.data.rubro).data.nombre,
            departamento: this.findDepartamento(x.data.departamento).data.nombre,
            presupuesto: x.data.presupuesto,
            estado: x.data.estado,
            tipo: x.data.tipo,
            cant_ofertas: x.data.cant_ofertas
          }
          this.cot_requerimiento_liquidacion.push(dataAll);
        }
      })
    })

    this.item.getTrabajoPanel().subscribe(data =>{
      this.requerimiento_trabajo =[];
      this.cot_requerimiento_trabajo = [];
      data.forEach(x => {
        if(x.data.usuario === this.uidUsuario){
          const datareq = {
            key: x.key,
            keyUsuario: x.data.usuario,
            nombre: x.data.nombre,
            rubro: this.findRubros(x.data.rubro).data.nombre,
            departamento: this.findDepartamento(x.data.departamento).data.nombre,
            sueldo: x.data.sueldo,
            estado: x.data.estado,
            tipo: x.data.tipo,
            cant_personal: x.data.cant_personal,
            cant_citas: x.data.cant_citas
          }
          this.requerimiento_trabajo.push(datareq);

        }
        if(x.data.estado===1 || x.data.estado===2){
          const dataAll = {
            key: x.key,
            keyUsuario: x.data.usuario,
            nombre: x.data.nombre,
            rubro: this.findRubros(x.data.rubro).data.nombre,
            departamento: this.findDepartamento(x.data.departamento).data.nombre,
            presupuesto: x.data.sueldo,
            estado: x.data.estado,
            tipo: x.data.tipo,
            cant_personal: x.data.cant_personal,
            cant_citas: x.data.cant_citas
          }
          this.cot_requerimiento_trabajo.push(dataAll);
        }
      })
    })
  }
  get_mis_ofertas(){
    this.item.getOferta_Requerimiento().subscribe(data =>{
      this.oferta_requerimiento_bien = [];
      this.oferta_requerimiento_servicio = [];
      data.forEach(x =>{
        if(x.data.usuario === this.uidUsuario){
          if(x.data.tipo===1){
            //const ref_Req = this.item.Requerimiento_once(x.data.id_requerimiento).query.once('value');
            //ref_Req.then(data => { 
            //const ref_Ord = this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value');
            //ref_Ord.then(data2 => { 
                const dataOferta = {
                  key: x.key,
                  nombre: x.data.nombre,
                  //rubro: this.findRubros(x.data.rubro).data.nombre,
                  ubicacion: this.findDepartamento(x.data.ubicacion).data.nombre,
                  presupuesto: x.data.presupuesto,
                  estado: x.data.estado,
                  tipo: x.data.tipo,
                  cancelado: x.data.cancelado,
                  fecha_entrega: x.data.fecha_entrega,
                  fecha_atencion: x.data.fecha_atencion,
                  id_requerimiento: x.data.id_requerimiento,
                  //confirmacionPro: data2.child('confirmacionProveedor').val(),
                  //id_ordencompra: data2.key
                  nombreusuario: x.data.nombreusuario,
                  correo: x.data.correo,
                  entrega: this.findEntrega(x.data.entrega).data.nombre,
                  fecha_publicacion: x.data.fecha_oferta,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  imagen: x.data.imagenprincipal


                }
                this.oferta_requerimiento_bien.push(dataOferta);
              //})
            //})
            
          }
          if(x.data.tipo===2){
            //const ref_Req = this.item.Requerimiento_once(x.data.id_requerimiento).query.once('value');
            //ref_Req.then(data => { 
            //const ref_Ord = this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value'); 
              //ref_Ord.then(data2 => {
                const dataOferta = {
                  key: x.key,
                  nombre: x.data.nombre,
                  //rubro: this.findRubros(x.data.rubro).data.nombre,
                  ubicacion: this.findDepartamento(x.data.ubicacion).data.nombre,
                  presupuesto: x.data.presupuesto,
                  estado: x.data.estado,
                  tipo: x.data.tipo,
                  cancelado: x.data.cancelado,
                  fecha_entrega: x.data.fecha_entrega,
                  fecha_atencion: x.data.fecha_atencion,
                  id_requerimiento: x.data.id_requerimiento,
                  //confirmacionPro: data2.child('confirmacionProveedor'),
                  //id_ordencompra: data2.key
                  nombreusuario: x.data.nombreusuario,
                  correo: x.data.correo,
                  entrega: this.findEntrega(x.data.entrega).data.nombre,
                  fecha_publicacion: x.data.fecha_oferta,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  imagen: x.data.imagenprincipal
                }
                this.oferta_requerimiento_servicio.push(dataOferta);
              //})
            //})
            
          }
        }
      })
    })
    this.item.getOferta_Liquidacion().subscribe(data =>{
      this.oferta_requerimiento_liquidacion=[];
      data.forEach(x => {
        if(x.data.usuario === this.uidUsuario){
          //const ref_Req = this.item.Liquidacion_once(x.data.id_requerimiento).query.once('value');
          //ref_Req.then(data => { 
            //const ref_Ord = this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value'); 
              //ref_Ord.then(data2 => {
              //console.log(this.findDepartamento(x.data.ubicacion).data.nombre);
              const dataOferta = {
                key: x.key,
                nombre: x.data.nombre,
                //rubro: this.findRubros(x.data.rubro).data.nombre,
                ubicacion: this.findDepartamento(x.data.ubicacion).data.nombre,
                presupuesto: x.data.presupuesto,
                estado: x.data.estado,
                tipo: x.data.tipo,
                cancelado: x.data.cancelado,
                fecha_entrega: x.data.fecha_entrega,
                fecha_atencion: x.data.fecha_atencion,
                id_requerimiento: x.data.id_requerimiento,
                //confirmacionPro: data2.child('confirmacionProveedor').val(),
                //id_ordencompra: data2.key
                nombreusuario: x.data.nombreusuario,
                  correo: x.data.correo,
                  entrega: this.findEntrega(x.data.entrega).data.nombre,
                  fecha_publicacion: x.data.fecha_oferta,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  imagen: 'default'
              }
              this.oferta_requerimiento_liquidacion.push(dataOferta);
            //});
            
         // })
        }
      })
    })
    this.item.getOferta_Puesto_Trabajo().subscribe(data =>{
      this.oferta_requerimiento_trabajo = [];
      data.forEach(x => {
        if(x.data.usuario === this.uidUsuario){
          const dataOferta = {
            key: x.key,
            nombre: x.data.nombre,
            //rubro: this.findRubros(x.data.rubro).data.nombre,
            ubicacion: this.findDepartamento(x.data.ubicacion).data.nombre,
            sueldo: x.data.sueldo,
            estado: x.data.estado,
            tipo: x.data.tipo,
            cancelado: x.data.cancelado,
            fecha_entrega: x.data.fecha_entrega,
            fecha_atencion: x.data.fecha_atencion,
            id_requerimiento: x.data.id_requerimiento
          }
          this.oferta_requerimiento_trabajo.push(dataOferta);
        }
      })
    })
  }
  get_mis_ordenes_compra(){
    
    this.item.getOrdenCompra().subscribe(data =>{
      this.ordenCompraEmitidos = [];
      this.ordenCompraRecibidos = [];
      data.forEach(snap => {
        //EMITIDOS
        if(snap.data.idCliente===this.uidUsuario){
          this.getTipoUsuario(snap.data.tipoProveedor,snap.data.idProveedor).then(x => {
            this.getTipoRequerimiento(snap.data.tipo,snap.data.idRequerimiento).then(x2 =>{
              let temp = {
                nombreProUsuario: x.child('nombre').val(),
                nombreRequerimiento: x2.child('nombre').val(),
                fecha: snap.data.fechaCompra,
                confirmacionCli: snap.data.confirmacionCliente,
                confirmacionPro: snap.data.confirmacionProveedor,
                idOrdenCompra: snap.key,
                idRequerimiento: snap.data.idRequerimiento,
                idOferta: snap.data.idOferta,
                idCliente: snap.data.idCliente,
                idProveedor:snap.data.idProveedor,
                tipoCliente: snap.data.tipoCliente,
                tipoProveedor: snap.data.tipoProveedor,
                tipoRequerimiento: snap.data.tipo,
                cancelado: snap.data.cancelado,
                calificacionProveedorBien: snap.data.calificacionProveedorBien,
                calificacionProveedorMal: snap.data.calificacionProveedorMal
              }
              this.ordenCompraEmitidos.push(temp);
            })
          })
        }
        if(snap.data.idProveedor===this.uidUsuario){//RECIBIDOS
          this.getTipoUsuario(snap.data.tipoCliente,snap.data.idCliente).then(x => {
            this.getTipoRequerimiento(snap.data.tipo,snap.data.idRequerimiento).then(x2 =>{
              let temp = {
                nombreCliUsuario: x.child('nombre').val(),
                nombreRequerimiento: x2.child('nombre').val(),
                fecha: snap.data.fechaCompra,
                confirmacionCli: snap.data.confirmacionCliente,
                confirmacionPro: snap.data.confirmacionProveedor,
                idOrdenCompra: snap.key,
                idRequerimiento: snap.data.idRequerimiento,
                idOferta: snap.data.idOferta,
                idCliente: snap.data.idCliente,
                idProveedor:snap.data.idProveedor,
                tipoCliente: snap.data.tipoCliente,
                tipoProveedor: snap.data.tipoProveedor,
                tipoRequerimiento: snap.data.tipo,
                cancelado: snap.data.cancelado,
                calificacionClienteBien: snap.data.calificacionClienteBien,
                calificacionClienteMal: snap.data.calificacionClienteMal
              }
              this.ordenCompraRecibidos.push(temp);
            })
          })
        }
      })
      //console.log(this.ordenCompraEmitidos);
      //console.log(this.ordenCompraRecibidos);
    })
  }
  getTipoUsuario(tipo,id){
    if(tipo===0){
      return this.item.Empresa_once(id).query.once('value');
    }else if(tipo===1){
      return this.item.Persona_once(id).query.once('value');
    }
  }
  getTipoRequerimiento(tipo,id){
    if(tipo===1 || tipo===2){
      return this.item.Requerimiento_once(id).query.once('value');
    }else if(tipo===3){
      return this.item.Liquidacion_once(id).query.once('value');
    }
  }

  getDepartamento(){
    this.item.getDepartamento().subscribe(data => {
      this.departamentos = data;
      //this.buscarForm.controls.departamento.setValue(this.departamentos[0].data.nombre);      
    });
  }
  getRubros(){
    this.item.getRubros().subscribe(data => {
      this.allRubros = data;  
      //this.buscarForm.controls.rubroFormSelect.setValue(this.rubros[0].data.nombre);      
    });

  }
  getMoneda(){
    this.item.getMoneda().subscribe(data => {
      this.allMoneda = data;     
    });
  }
  getAntiguedad(){
    this.item.getAntiguedad().subscribe(data => {
      this.allAntiguedad = data;     
    });
  }
  getEntrega(){
    this.item.getEntrega().subscribe(data => {
      this.allEntrega = data;     
    });
  }
  getFormaPago(){
    this.item.getFormaPago().subscribe(data => {
      this.allFormaPago = data;     
    });
  }
  getJornada(){
    this.item.getJornada().subscribe(data => {
      this.allJornada = data;     
    });
  }
  findDepartamento(keyId){
    return this.departamentos.find( function(item) {
      return item.key == keyId;
    });
  }
  findRubros(keyId){
    return this.allRubros.find( function(item) {
      return item.key == keyId;
    });
  }
  findEntrega(keyId){
    return this.allEntrega.find( function(item) {
      return item.key == keyId;
    });
  }
  findAntiguedad(keyId){
    return this.allAntiguedad.find( function(item) {
      return item.key == keyId;
    });
  }
  findMoneda(keyId){
    return this.allMoneda.find( function(item) {
      return item.key == keyId;
    });
  }

  agregarBien(){
    //console.log(this.fecha_finalBien.nativeElement.value);
    if(this.nombreBien.nativeElement.value ===""){
      alert("Ingrese el nombre del servicio");
      return '';
    }
    if(this.correoBien.nativeElement.value ===""){
      alert("Ingrese correo de contacto");
      return '';
    }
    if(this.presupuestoBien.nativeElement.value ===""){
      alert("Ingrese un presupuesto");
      return '';
    }
    if(this.fecha_finalBien.nativeElement.value ===""){
      alert("Seleccione una fecha final");
      return '';
    }
    if(this.selectedRubroBien === "-LjS65S0NtwAABX-VuOg"){
      alert("Seleccione un rubro");
      return '';
    }
    if(this.selectedDepartamentoBien === 0){
      alert("Seleccione un departamento");
      return '';
    }
    if(this.selectedMonedaBien === "-LjS7G05dji2dWV2Gft1"){
      alert("Seleccione un tipo de moneda");
      return '';
    }
    if(this.selectedFormaPagoBien === "-LjvpvZRlL8_syrMkxOx"){
      alert("Seleccione forma de pago");
      return '';
    }
    if(this.selectedEntregaBien === "-LjS6ygVTMvasGPrdtqp"){
      alert("Seleccione el tiempo de entrega");
      return '';
    }
      const reqBien = new crearRequerimiento(
      this.nombreBien.nativeElement.value,
      this.descripcionBien.nativeElement.value,
      1,
      this.selectedRubroBien,
      Number(this.selectedDepartamentoBien),
      Number(this.presupuestoBien.nativeElement.value),
      this.selectedMonedaBien,
      this.selectedFormaPagoBien,
      this.correoBien.nativeElement.value,
      this.datePipe.transform(this.fecha_finalBien.nativeElement.value,'dd-MM-yyyy').toString(),
      this.selectedEntregaBien,
      this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString(),
      this.tipoUsuarioNumber,
      this.uidUsuario);
      
      var id = this.registroReq.addBien(reqBien);
      this.subirImage(id,1);
      this.subirFile(id,1)
      alert("Requerimiento creado satisfactoriamente");
      document.getElementById("hideAgregar").click();
      this.clearBien();

 
  }
  clearBien(){
    this.nombreBien.nativeElement.value = "";
    this.descripcionBien.nativeElement.value = "";
    this.selectedRubroBien = "-LjS65S0NtwAABX-VuOg";
    this.selectedDepartamentoBien= 0;
    this.presupuestoBien.nativeElement.value = "";
    this.selectedMonedaBien = "-LjS7G05dji2dWV2Gft1";
    this.selectedFormaPagoBien = "-LjvpvZRlL8_syrMkxOx";
    this.correoBien.nativeElement.value = "";
    this.fecha_finalBien.nativeElement.value = this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString(),
    this.selectedEntregaBien = "-LjS6ygVTMvasGPrdtqp";
    this.cantImagenes = 0;
    this.cantFile = 0;

  }
  cargarImage(data){
    //console.log(data.path[0].files);
    this.cantImagenes = data.path[0].files.length;
    if(data.path[0].files.length>5){
      alert("Cantidad de imagenes permitidas son 5");
      return '';
    }
    this.imagenesCargadas = data.target.files;
  }
  subirImage(id,tipoProducto){
    if(this.cantImagenes>0){
      let cont = 0;
      for(let x of this.imagenesCargadas){
        //console.log(x);
        if(tipoProducto===1 || tipoProducto===2){
          const ref = this.storage.ref('Requerimiento/Imagenes/'+cont+'-'+id);
          const task = this.storage.upload('Requerimiento/Imagenes/'+cont+'-'+id,x);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroReq.updateImagen(downloadURL,1,id);
                      });
                })
            ).subscribe();
        }
        if(tipoProducto===3){
          const ref = this.storage.ref('Liquidacion/Imagenes/'+cont+'-'+id);
          const task = this.storage.upload('Liquidacion/Imagenes/'+cont+'-'+id,x);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroReq.updateImagen(downloadURL,3,id);
                      });
                })
            ).subscribe();
        }
        if(tipoProducto===4){
          const ref = this.storage.ref('Puesto/Imagenes/'+cont+'-'+id);
          const task = this.storage.upload('Puesto/Imagenes/'+cont+'-'+id,x);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroReq.updateImagen(downloadURL,4,id);
                      });
                })
            ).subscribe();
        }
        cont++;
      }
    }else{
      //console.log("sin imagenes");
  }
  }

  cargarFile(data){
    //console.log(data.path[0].files);
    this.cantFile = data.path[0].files.length;
    if(data.path[0].files.length>1){
      alert("Maximo de archivos es 1");
      return '';
    }
    //console.log(data.path[0].files)
    this.fileCargado = data.target.files[0];

  }
  
  subirFile(id,tipoProducto){
    if(this.cantFile>0){
        if(tipoProducto===1 || tipoProducto===2){
          //alert("entro");
          const ref = this.storage.ref('Requerimiento/Documentos/'+id);
          const task = this.storage.upload('Requerimiento/Documentos/'+id,this.fileCargado);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroReq.updateFile(downloadURL,1,id);
                      });
                })
            ).subscribe();
        }
        if(tipoProducto===3){
          const ref = this.storage.ref('Liquidacion/Documentos/'+id);
          const task = this.storage.upload('Liquidacion/Documentos/'+id,this.fileCargado);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroReq.updateFile(downloadURL,3,id);
                      });
                })
            ).subscribe();
        }
        if(tipoProducto===4){
          const ref = this.storage.ref('Puesto/Documentos/'+id);
          const task = this.storage.upload('Puesto/Documentos/'+id,this.fileCargado);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroReq.updateFile(downloadURL,4,id);
                      });
                })
            ).subscribe();
        }

    }else{
      //console.log("sin archivos");
  }
  }

  agregarServicio(){
    //console.log(this.fecha_finalBien.nativeElement.value);
    if(this.nombreServicio.nativeElement.value ===""){
      alert("Ingrese el nombre del servicio");
      return '';
    }
    if(this.correoServicio.nativeElement.value ===""){
      alert("Ingrese correo de contacto");
      return '';
    }
    if(this.presupuestoServicio.nativeElement.value ===""){
      alert("Ingrese un presupuesto");
      return '';
    }
    if(this.fecha_finalServicio.nativeElement.value ===""){
      alert("Seleccione una fecha final");
      return '';
    }
    if(this.selectedRubroServicio === "-LjS65S0NtwAABX-VuOg"){
      alert("Seleccione un rubro");
      return '';
    }
    if(this.selectedDepartamentoServicio === 0){
      alert("Seleccione un departamento");
      return '';
    }
    if(this.selectedMonedaServicio === "-LjS7G05dji2dWV2Gft1"){
      alert("Seleccione un tipo de moneda");
      return '';
    }
    if(this.selectedFormaPagoServicio === "-LjvpvZRlL8_syrMkxOx"){
      alert("Seleccione forma de pago");
      return '';
    }
    if(this.selectedEntregaServicio === "-LjS6ygVTMvasGPrdtqp"){
      alert("Seleccione el tiempo de entrega");
      return '';
    }
      const reqServicio = new crearRequerimiento(
      this.nombreServicio.nativeElement.value,
      this.descripcionServicio.nativeElement.value,
      2,
      this.selectedRubroServicio,
      Number(this.selectedDepartamentoServicio),
      Number(this.presupuestoServicio.nativeElement.value),
      this.selectedMonedaServicio,
      this.selectedFormaPagoServicio,
      this.correoServicio.nativeElement.value,
      this.datePipe.transform(this.fecha_finalServicio.nativeElement.value,'dd-MM-yyyy').toString(),
      this.selectedEntregaServicio,
      this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString(),
      this.tipoUsuarioNumber,
      this.uidUsuario);
      
      var id = this.registroReq.addBien(reqServicio);
      this.subirImage(id,1);
      this.subirFile(id,1)
      alert("Requerimiento creado satisfactoriamente");
      document.getElementById("hideAgregar").click();
      this.clearServicio();
 
  }
  clearServicio(){
    this.nombreServicio.nativeElement.value = "";
    this.descripcionServicio.nativeElement.value = "";
    this.selectedRubroServicio = "-LjS65S0NtwAABX-VuOg";
    this.selectedDepartamentoServicio= 0;
    this.presupuestoServicio.nativeElement.value = "";
    this.selectedMonedaServicio = "-LjS7G05dji2dWV2Gft1";
    this.selectedFormaPagoServicio = "-LjvpvZRlL8_syrMkxOx";
    this.correoServicio.nativeElement.value = "";
    this.fecha_finalServicio.nativeElement.value = this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString(),
    this.selectedEntregaServicio = "-LjS6ygVTMvasGPrdtqp";
    this.cantImagenes = 0;
    this.cantFile = 0;

  }
  agregarLiquidacion(){
    //console.log(this.fecha_finalBien.nativeElement.value);
    if(this.nombreLiq.nativeElement.value ===""){
      alert("Ingrese el nombre del servicio");
      return '';
    }
    if(this.correoLiq.nativeElement.value ===""){
      alert("Ingrese correo de contacto");
      return '';
    }
    if(this.presupuestoLiq.nativeElement.value ===""){
      alert("Ingrese un presupuesto");
      return '';
    }
    if(this.fecha_finalLiq.nativeElement.value ===""){
      alert("Seleccione una fecha final");
      return '';
    }
    if(this.selectedRubroLiq === "-LjS65S0NtwAABX-VuOg"){
      alert("Seleccione un rubro");
      return '';
    }
    if(this.selectedDepartamentoLiq === 0){
      alert("Seleccione un departamento");
      return '';
    }
    if(this.selectedMonedaLiq === "-LjS7G05dji2dWV2Gft1"){
      alert("Seleccione un tipo de moneda");
      return '';
    }
    if(this.selectedFormaPagoLiq === "-LjvpvZRlL8_syrMkxOx"){
      alert("Seleccione forma de pago");
      return '';
    }
    if(this.selectedEntregaLiq === "-LjS6ygVTMvasGPrdtqp"){
      alert("Seleccione el tiempo de entrega");
      return '';
    }
      const reqLiq = new crearLiquidacion(
      this.nombreLiq.nativeElement.value,
      this.descripcionLiq.nativeElement.value,
      3,
      this.selectedRubroLiq,
      Number(this.selectedDepartamentoLiq),
      Number(this.presupuestoLiq.nativeElement.value),
      this.selectedMonedaLiq,
      this.selectedFormaPagoLiq,
      this.correoLiq.nativeElement.value,
      this.datePipe.transform(this.fecha_finalLiq.nativeElement.value,'dd-MM-yyyy').toString(),
      this.selectedEntregaLiq,
      this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString(),
      this.tipoUsuarioNumber,
      this.uidUsuario);
      
      var id = this.registroReq.addLiquidacion(reqLiq);
      this.subirImage(id,3);
      this.subirFile(id,3)
      alert("Liquidación creado satisfactoriamente");
      document.getElementById("hideAgregar").click();
      this.clearLiquidacion();
 
  }
  clearLiquidacion(){
    this.nombreLiq.nativeElement.value = "";
    this.descripcionLiq.nativeElement.value = "";
    this.selectedRubroLiq = "-LjS65S0NtwAABX-VuOg";
    this.selectedDepartamentoLiq = 0;
    this.presupuestoLiq.nativeElement.value = "";
    this.selectedMonedaLiq = "-LjS7G05dji2dWV2Gft1";
    this.selectedFormaPagoLiq = "-LjvpvZRlL8_syrMkxOx";
    this.correoLiq.nativeElement.value = "";
    this.fecha_finalLiq.nativeElement.value = this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString(),
    this.selectedEntregaLiq = "-LjS6ygVTMvasGPrdtqp";
    this.cantImagenes = 0;
    this.cantFile = 0;

  }
  agregarPT(){
    if(this.nombrePT.nativeElement.value ===""){
      alert("Ingrese el nombre del servicio");
      return '';
    }
    if(this.correoPT.nativeElement.value ===""){
      alert("Ingrese correo de contacto");
      return '';
    }
    if(this.presupuestoPT.nativeElement.value ===""){
      alert("Ingrese un Sueldo");
      return '';
    }
    if(this.fecha_finalPT.nativeElement.value ===""){
      alert("Seleccione una fecha final");
      return '';
    }
    if(this.selectedRubroPT === "-LjS65S0NtwAABX-VuOg"){
      alert("Seleccione un rubro");
      return '';
    }
    if(this.selectedDepartamentoPT === 0){
      alert("Seleccione un departamento");
      return '';
    }
    if(this.selectedMonedaPT === "-LjS7G05dji2dWV2Gft1"){
      alert("Seleccione un tipo de moneda");
      return '';
    }
    if(this.selectedJornadaPT === "-LjS6SlPBOA29CcKypLS"){
      alert("Seleccione una Jornada Laboral");
      return '';
    }
    if(this.selectedEntregaPT === "-LjS6ygVTMvasGPrdtqp"){
      alert("Seleccione la Disponibilidad");
      return '';
    }
      const reqPT = new crearTrabajo(
      this.nombrePT.nativeElement.value,
      this.descripcionPT.nativeElement.value,
      4,
      this.selectedRubroPT,
      Number(this.selectedDepartamentoPT),
      Number(this.presupuestoPT.nativeElement.value),
      this.selectedMonedaPT,
      this.selectedEntregaPT,
      this.correoPT.nativeElement.value,
      this.datePipe.transform(this.fecha_finalPT.nativeElement.value,'dd-MM-yyyy').toString(),
      this.selectedJornadaPT,
      this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString(),
      this.tipoUsuarioNumber,
      this.uidUsuario);
      
      var id = this.registroReq.addTrabajo(reqPT);
      this.subirImage(id,4);
      this.subirFile(id,4)
      alert("Recurso Humano creado satisfactoriamente");
      document.getElementById("hideAgregar").click();
      this.clearPT();
 
  }
  clearPT(){
    this.nombrePT.nativeElement.value = "";
    this.descripcionPT.nativeElement.value = "";
    this.selectedRubroPT = "-LjS65S0NtwAABX-VuOg";
    this.selectedDepartamentoPT = 0;
    this.presupuestoPT.nativeElement.value = "";
    this.selectedMonedaPT = "-LjS7G05dji2dWV2Gft1";
    this.selectedJornadaPT = "-LjS6SlPBOA29CcKypLS";
    this.correoPT.nativeElement.value = "";
    this.fecha_finalPT.nativeElement.value = this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString(),
    this.selectedEntregaPT = "-LjS6ygVTMvasGPrdtqp";
    this.cantImagenes = 0;
    this.cantFile = 0;

  }
  paginationTable(cant,id_1:number,id_2:number){

    if(id_1===1 && id_2 ===1){ 
      this.cant_Mis_Req_Bienes = parseInt(cant);
    }
    if(id_1===1 && id_2 ===2){ 
      this.cant_Mis_Req_Servicios = parseInt(cant);
    }
    if(id_1===1 && id_2 ===3){
       this.cant_Mis_Req_Liquidacion = parseInt(cant);
    }
    if(id_1===1 && id_2 ===4){ 
      this.cant_Mis_Req_Trabajo = parseInt(cant);
    }
    if(id_1===2 && id_2 ===1){ 
      this.cant_Mis_Ofe_Bienes = parseInt(cant);
    }
    if(id_1===2 && id_2 ===2){ 
      this.cant_Mis_Ofe_Servicios = parseInt(cant);
    }
    if(id_1===2 && id_2 ===3){ 
      this.cant_Mis_Ofe_Liquidacion = parseInt(cant);
    }
    if(id_1===2 && id_2 ===4){ 
      this.cant_Mis_Ofe_Trabajo = parseInt(cant);
    }
    if(id_1===3 && id_2 ===1){ 
      this.cant_Coti_Bienes = parseInt(cant);
    }
    if(id_1===3 && id_2 ===2){ 
      this.cant_Coti_Servicios = parseInt(cant);
    }
    if(id_1===3 && id_2 ===3){ 
      this.cant_Coti_Liquidacion = parseInt(cant);
    }
    if(id_1===3 && id_2 ===4){ 
      this.cant_Coti_Trabajo = parseInt(cant);
    }
    if(id_1===4 && id_2 ===1){ 
      this.cant_Ord_Emitido = parseInt(cant);
    }
    if(id_1===4 && id_2 ===2){ 
      this.cant_Ord_Recibido = parseInt(cant);
    }
   
  }
  eliminarReq(item){
    this.registroReq.deleteReq(item.key,item.tipo);
    console.log(item);
    if(item.tipo===1 || item.tipo===2){
      if(item.comprador!="default"){
        this.item.oferta_Requerimiento_once(item.oferta).query.once('value').then(data => {
          data.ref.update({cancelado: 1});
        })
        this.item.ordenCompra_once(item.ordencompra).query.once('value').then(data => {
          data.ref.update({cancelado: 1});
        })
      }
      alert("Requerimiento "+item.nombre+" eliminado satisfactoriamente!!");
    }
    if(item.tipo===3){
      if(item.comprador!="default"){
        this.item.oferta_Liquidacion_once(item.oferta).query.once('value').then(data => {
          data.ref.update({cancelado: 1});
        })
        this.item.ordenCompra_once(item.ordencompra).query.once('value').then(data => {
          data.ref.update({cancelado: 1});
        })
      }
       alert("Liquidación "+item.nombre+" eliminado satisfactoriamente!!");
    }
    if(item.tipo===4){
      if(item.cant_citas>0){
        this.item.citas_once().query.once('value').then(data => {
          data.forEach(x => {
            if(x.child('idRecurso').val()===item.key){
              x.ref.update({
                cancelado: 1
              });
              this.item.oferta_Trabajo_once(x.child('idOferta').val()).query.once('value').then(r => {
                r.ref.update({
                  cancelado: 1
                })
              })
            }
          });
        })
      }
      alert("Recurso Humano "+item.nombre+" eliminado satisfactoriamente!!");
    }
  }
  eliminarOfe(item){
      
      this.registroReq.deleteOferta(item.key,item.tipo,item);
      alert("Tu oferta "+item.nombre+" eliminado satisfactoriamente!!");
  }

  cambiarPass(){
    var temp = this.passActual.nativeElement.value;
    if(this.passActual.nativeElement.value=""){
      alert("Ingrese su contraseña actual");
      return '';
    }
    if(this.passNuevo1.nativeElement.value=="" || this.passNuevo2.nativeElement.value==""){
      alert("Ingrese su contraseña nueva");
      return '';
    }
    if(this.passNuevo1.nativeElement.value != this.passNuevo2.nativeElement.value){
      alert("La contraseña Nueva no coincide");
      return '';
    }
    this.authService.changePassword(temp,this.passNuevo1.nativeElement.value);
    this.passActual.nativeElement.value="";
    this.passNuevo1.nativeElement.value="";
    this.passNuevo2.nativeElement.value="";
  }

  cantOfertas(cant,key,tipo,cali){

    if(cant<1){
      if(tipo!=4){
        alert("Este requerimiento no tiene ninguna oferta");
        return'';
      }else{
        alert("Este Puesto de trabajo no tiene ningun postulante");
        return'';
      }
    }

    this.calificacionClienteBien['readonly']= false;
    this.calificacionClienteMal['readonly'] = false;
    this.calificacionClienteBien['value'] = this.usuario.calificacionClienteBien;
    this.calificacionClienteMal['value'] = this.usuario.calificacionClienteMal;
    this.calificacionClienteMal['readonly'] = true;
    this.calificacionClienteBien['readonly'] = true;
    //console.log(this.calificacionCliente2['readonly']);
    this.mi_req_ofertas = [];
    this.list_ofertantes = [];
    if(tipo===1 || tipo ===2){///////REQUERIMIENTOS
      const prueba2 = this.item.listarRequerimientos2(key).subscribe(data =>{
        this.mi_req_ofertas = data.payload.val();
      });
      this.item.getOferta_Requerimiento().subscribe(data =>{
        this.list_ofertantes = [];
        data.forEach(x => {
          if(x.data.id_requerimiento === key){
            if(x.data.tipoUsuario===0){
              const usuarioEmpresa = this.item.getUsuarioEmpresa2(x.data.usuario).query.once('value').then(function(ue){
                return ue;
              });
              usuarioEmpresa.then(ue => {
                var ofe_temp = {
                  keyOferta: x.key,
                  keyUsuario: x.data.usuario,
                  nombreOferta: x.data.nombre,
                  tipoUsuario :x.data.tipoUsuario,
                  ubicacionOferta: this.findDepartamento(x.data.ubicacion).data.nombre,
                  nombreUsuario: x.data.nombreusuario,
                  antiguedadUsuario: this.findAntiguedad(ue.child('antiguedad').val()).data.nombre,
                  ubicacionUsuario: this.findDepartamento(ue.child('departamento').val()).data.nombre,
                  presupuesto: x.data.presupuesto,
                  correo: x.data.correo,
                  tiempoEntrega: this.findEntrega(x.data.entrega).data.nombre,
                  fecha_entrega: x.data.fecha_entrega,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  cancelado: x.data.cancelado,
                  documento: x.data.documento,
                  id_requerimiento: x.data.id_requerimiento,
                  tipo: x.data.tipo,
                  calificacionClienteBien: ue.child('calificacionClienteBien').val(),
                  calificacionClienteMal: ue.child('calificacionClienteMal').val(),
                  calificacionProveedorBien: ue.child('calificacionProveedorBien').val(),
                  calificacionProveedorMal: ue.child('calificacionProveedorMal').val()
                }

                this.list_ofertantes.push(ofe_temp);
                //console.log(this.list_ofertantes);

              })
            }
            if(x.data.tipoUsuario===1){
              const usuarioPersona = this.item.getUsuarioPersona2(x.data.usuario).query.once('value').then(function(ue){
                return ue;
              });
              usuarioPersona.then(ue => {
                var ofe_temp = {
                  keyOferta: x.key,
                  keyUsuario: x.data.usuario,
                  nombreOferta: x.data.nombre,
                  tipoUsuario :x.data.tipoUsuario,
                  ubicacionOferta: this.findDepartamento(x.data.ubicacion).data.nombre,
                  nombreUsuario: x.data.nombreusuario,
                  //antiguedadUsuario: this.findAntiguedad(ue.payload.child('antiguedad').val()).data.nombre,
                  ubicacionUsuario: this.findDepartamento(ue.child('departamento').val()).data.nombre,
                  presupuesto: x.data.presupuesto,
                  correo: x.data.correo,
                  tiempoEntrega: this.findEntrega(x.data.entrega).data.nombre,
                  fecha_entrega: x.data.fecha_entrega,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  cancelado: x.data.cancelado,
                  documento: x.data.documento,
                  id_requerimiento: x.data.id_requerimiento,
                  tipo: x.data.tipo,
                  calificacionClienteBien: ue.child('calificacionClienteBien').val(),
                  calificacionClienteMal: ue.child('calificacionClienteMal').val(),
                  calificacionProveedorBien: ue.child('calificacionProveedorBien').val(),
                  calificacionProveedorMal: ue.child('calificacionProveedorMal').val()
                }
                //console.log(ofe_temp);
                this.list_ofertantes.push(ofe_temp);
                //console.log(this.list_ofertantes);
                //console.log(this.list_ofertantes);
              })
            }

          }
        });
        
      });
      document.getElementById("showModalOfe").click();
    }
    if(tipo===3){/////LIQUIDACION
      this.mi_req_ofertas = [];
      this.list_ofertantes = [];
      this.item.listarLiquidacion2(key).subscribe(data =>{
        this.mi_req_ofertas = data.payload.val();
      });
      this.item.getOferta_Liquidacion().subscribe(data =>{
        this.list_ofertantes = [];
        data.forEach(x => {
          if(x.data.id_requerimiento === key){
            if(x.data.tipoUsuario===0){
              const usuarioEmpresa = this.item.getUsuarioEmpresa2(x.data.usuario).query.once('value').then(function(ue){
                return ue;
              });
              usuarioEmpresa.then(ue => {
                var ofe_temp = {
                  keyOferta: x.key,
                  keyUsuario: x.data.usuario,
                  nombreOferta: x.data.nombre,
                  tipoUsuario :x.data.tipoUsuario,
                  ubicacionOferta: this.findDepartamento(x.data.ubicacion).data.nombre,
                  nombreUsuario: x.data.nombreusuario,
                  antiguedadUsuario: this.findAntiguedad(ue.child('antiguedad').val()).data.nombre,
                  ubicacionUsuario: this.findDepartamento(ue.child('departamento').val()).data.nombre,
                  presupuesto: x.data.presupuesto,
                  correo: x.data.correo,
                  tiempoEntrega: this.findEntrega(x.data.entrega).data.nombre,
                  fecha_entrega: x.data.fecha_entrega,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  cancelado: x.data.cancelado,
                  //documento: x.data.documento,
                  id_requerimiento: x.data.id_requerimiento,
                  tipo: x.data.tipo,
                  calificacionClienteBien: ue.child('calificacionClienteBien').val(),
                  calificacionClienteMal: ue.child('calificacionClienteMal').val(),
                  calificacionProveedorBien: ue.child('calificacionProveedorBien').val(),
                  calificacionProveedorMal: ue.child('calificacionProveedorMal').val()
                }
  
                this.list_ofertantes.push(ofe_temp);

              })
            }
            if(x.data.tipoUsuario===1){
              const usuarioPersona = this.item.getUsuarioPersona2(x.data.usuario).query.once('value').then(function(ue){
                return ue;
              });
              usuarioPersona.then(ue => {
                var ofe_temp = {
                  keyOferta: x.key,
                  keyUsuario: x.data.usuario,
                  nombreOferta: x.data.nombre,
                  tipoUsuario :x.data.tipoUsuario,
                  ubicacionOferta: this.findDepartamento(x.data.ubicacion).data.nombre,
                  nombreUsuario: x.data.nombreusuario,
                  //antiguedadUsuario: this.findAntiguedad(ue.payload.child('antiguedad').val()).data.nombre,
                  ubicacionUsuario: this.findDepartamento(ue.child('departamento').val()).data.nombre,
                  presupuesto: x.data.presupuesto,
                  correo: x.data.correo,
                  tiempoEntrega: this.findEntrega(x.data.entrega).data.nombre,
                  fecha_entrega: x.data.fecha_entrega,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  cancelado: x.data.cancelado,
                  //documento: x.data.documento,
                  id_requerimiento: x.data.id_requerimiento,
                  tipo: x.data.tipo,
                  calificacionClienteBien: ue.child('calificacionClienteBien').val(),
                  calificacionClienteMal: ue.child('calificacionClienteMal').val(),
                  calificacionProveedorBien: ue.child('calificacionProveedorBien').val(),
                  calificacionProveedorMal: ue.child('calificacionProveedorMal').val()
                }

                this.list_ofertantes.push(ofe_temp);

              })
            }
  
          }
        });
        
      });
  
      document.getElementById("showModalOfe").click();

    }
    if(tipo===4){/////RECURSOS HUMANOS

      this.mi_req_ofertas = [];
      this.list_ofertantes = [];
      this.item.listarPuestoTrabajo2(key).subscribe(data =>{
        this.mi_req_ofertas = data.payload.val();
      });
      this.item.getOferta_Puesto_Trabajo().subscribe(data =>{
        this.list_ofertantes = [];
        data.forEach(x => {
          if(x.data.id_requerimiento === key){
            if(x.data.tipoUsuario===0){
              const usuarioEmpresa = this.item.getUsuarioEmpresa2(x.data.usuario).query.once('value').then(function(ue){
                return ue;
              });
              usuarioEmpresa.then(ue => {
                var ofe_temp = {
                  keyOferta: x.key,
                  keyUsuario: x.data.usuario,
                  nombreOferta: x.data.nombre,
                  tipoUsuario :x.data.tipoUsuario,
                  ubicacionOferta: this.findDepartamento(x.data.ubicacion).data.nombre,
                  nombreUsuario: x.data.nombreusuario,
                  antiguedadUsuario: this.findAntiguedad(ue.child('antiguedad').val()).data.nombre,
                  ubicacionUsuario: this.findDepartamento(ue.child('departamento').val()).data.nombre,
                  presupuesto: x.data.sueldo,
                  correo: x.data.correo,
                  tiempoEntrega: this.findEntrega(x.data.disponibilidad).data.nombre,
                  fecha_entrega: x.data.fecha_entrega,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  cancelado: x.data.cancelado,
                  documento: x.data.documento,
                  id_requerimiento: x.data.id_requerimiento,
                  tipo: x.data.tipo,
                  fecha_atencion: x.data.fecha_atencion,
                  calificacionClienteBien: ue.child('calificacionClienteBien').val(),
                  calificacionClienteMal: ue.child('calificacionClienteMal').val(),
                  calificacionProveedorBien: ue.child('calificacionProveedorBien').val(),
                  calificacionProveedorMal: ue.child('calificacionProveedorMal').val()
                }
  
                this.list_ofertantes.push(ofe_temp);

              })
            }
            if(x.data.tipoUsuario===1){
              const usuarioPersona = this.item.getUsuarioPersona2(x.data.usuario).query.once('value').then(function(ue){
                return ue;
              });
              usuarioPersona.then(ue => {
                var ofe_temp = {
                  keyOferta: x.key,
                  keyUsuario: x.data.usuario,
                  nombreOferta: x.data.nombre,
                  tipoUsuario :x.data.tipoUsuario,
                  ubicacionOferta: this.findDepartamento(x.data.ubicacion).data.nombre,
                  nombreUsuario: x.data.nombreusuario,
                  //antiguedadUsuario: this.findAntiguedad(ue.payload.child('antiguedad').val()).data.nombre,
                  ubicacionUsuario: this.findDepartamento(ue.child('departamento').val()).data.nombre,
                  presupuesto: x.data.sueldo,
                  correo: x.data.correo,
                  tiempoEntrega: this.findEntrega(x.data.disponibilidad).data.nombre,
                  fecha_entrega: x.data.fecha_entrega,
                  moneda: this.findMoneda(x.data.moneda).data.nombre,
                  cancelado: x.data.cancelado,
                  documento: x.data.documento,
                  id_requerimiento: x.data.id_requerimiento,
                  tipo: x.data.tipo,
                  fecha_atencion: x.data.fecha_atencion,
                  calificacionClienteBien: ue.child('calificacionClienteBien').val(),
                  calificacionClienteMal: ue.child('calificacionClienteMal').val(),
                  calificacionProveedorBien: ue.child('calificacionProveedorBien').val(),
                  calificacionProveedorMal: ue.child('calificacionProveedorMal').val()
                }

                this.list_ofertantes.push(ofe_temp);

              })
            }
  
          }
        });
        
      });
  
      document.getElementById("showModalOfe").click();

    }
  }
 

  comprarOferta(item,tipo){
    //console.log(item);
    if(item.estado===3){
      alert("Este requerimiento ha culminado");
      return '';
    }
    if(item.estado===5){
      alert("Tiempo de vigencia del requerimiento ha expirado");
      return '';
    }
    if(item.estado===6){
      alert("Este requerimiento fue cancelado");
      return '';
    }
    if(item.estado===7){
      alert("Este requerimiento fue eliminado");
      return '';
    }
    if(item.tipo===1 || item.tipo===2){
      this.item.Requerimiento_once(item.id_requerimiento).query.once('value').then(data =>{
        if(data.child('ordencompra').val()==="default"){
          console.log(data.child('ordencompra').val());
          this.ordenCompra.generarOrdenCompraRequerimiento(item,this.mi_req_ofertas,this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString());
        }else{
          this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value').then( data2 => {
            if(data2.child('cancelado').val()===1){
              this.ordenCompra.generarOrdenCompraRequerimiento(item,this.mi_req_ofertas,this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString());
            }else{
              alert("Ya compraste una oferta");
            }
          })
        }
      })
    }else if(item.tipo===3){
      this.item.Liquidacion_once(item.id_requerimiento).query.once('value').then(data =>{
        if(data.child('ordencompra').val()==="default"){
          console.log(data.child('ordencompra').val());
          this.ordenCompra.generarOrdenCompraLiquidacion(item,this.mi_req_ofertas,this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString());
        }else{
          this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value').then( data2 => {
            if(data2.child('cancelado').val()===1){
              this.ordenCompra.generarOrdenCompraLiquidacion(item,this.mi_req_ofertas,this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString());
            }else{
              alert("Ya compraste una oferta");
            }
          })
        }
      })
    }
  }

  cancelarOferta(item){
    console.log(item);////FALTA VALIDAR QUE REVISE CUANDO ESTE CULMINADO
    if(item.tipo===1 || item.tipo===2){
      this.item.Requerimiento_once(item.id_requerimiento).query.once('value').then(snap => {
        this.item.ordenCompra_once(snap.child('ordencompra').val()).query.once('value').then(snap2 => {
          if(snap2.child('confirmacionProveedor').val()===0){
            this.item.oferta_Requerimiento_once(item.keyOferta).query.once('value').then( data => {
              data.ref.update({
                cancelado: 1
              })
            })
            this.item.Requerimiento_once(item.id_requerimiento).query.once('value').then(data =>{
              this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value').then( data2 => {
                data2.ref.update({
                  cancelado:1,
                  estado:2,
                  fechaCancelar: this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString()
                })
                alert("Orden de compra cancelada");
              })
            })
          }
          if(snap2.child('confirmacionProveedor').val()===1){
            alert("Su proveedor ha indicado que envio su requerimiento");
          }
        })
      })
    }
    else if(item.tipo===3){
      this.item.Liquidacion_once(item.id_requerimiento).query.once('value').then(snap => {
        this.item.ordenCompra_once(snap.child('ordencompra').val()).query.once('value').then(snap2 => {
          if(snap2.child('confirmacionProveedor').val()===0){
            this.item.oferta_Liquidacion_once(item.keyOferta).query.once('value').then( data => {
              data.ref.update({
                cancelado: 1
              })
            })
            this.item.Liquidacion_once(item.id_requerimiento).query.once('value').then(data =>{
              this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value').then( data2 => {
                data2.ref.update({
                  cancelado:1,
                  estado:2,
                  fechaCancelar: this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString()
                })
                alert("Orden de compra cancelada");
              })
            })
          }
          if(snap2.child('confirmacionProveedor').val()===1){
            alert("Su proveedor ha indicado que envio su requerimiento");
          }
        })
      })
    }
  }
  cancelarRequerimiento(item){
    this.item.ordenCompra_once(item.ordencompra).query.once('value').then(snap => {
      if(snap.child('confirmacionProveedor').val()===0){
        if(item.estado===2){
          this.item.oferta_Requerimiento_once(item.oferta).query.once('value').then( data => {
            data.ref.update({
              cancelado: 1
            })
          });
          this.item.ordenCompra_once(item.ordencompra).query.once('value').then( data2 => {
            data2.ref.update({
              cancelado:1,
              estado:2,
              fechaCancelar: this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString()
            })
          })
        }
        this.item.Requerimiento_once(item.key).query.once('value').then(data =>{
          data.ref.update({
            estado: 6
          })
        })
        alert("Tu requerimiento "+item.nombre+" fue cancelado");
      }if(snap.child('confirmacionProveedor').val()===1){
        alert("Su proveedor ha indicado que envio su requerimiento");
      }
      if(snap.val()===null){
        if(item.estado===2){
          this.item.oferta_Requerimiento_once(item.oferta).query.once('value').then( data => {
            data.ref.update({
              cancelado: 1
            })
          });
          this.item.ordenCompra_once(item.ordencompra).query.once('value').then( data2 => {
            data2.ref.update({
              cancelado:1,
              estado:2,
              fechaCancelar: this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString()
            })
          })
        }
        this.item.Requerimiento_once(item.key).query.once('value').then(data =>{
          data.ref.update({
            estado: 6
          })
        })
        alert("Tu requerimiento "+item.nombre+" fue cancelado");
      }
  })
  }

  cancelarLiquidacion(item){
    console.log(item);
    this.item.ordenCompra_once(item.ordencompra).query.once('value').then(snap => {
      if(snap.child('confirmacionProveedor').val()===0){
        if(item.estado===2){
          this.item.oferta_Liquidacion_once(item.oferta).query.once('value').then( data => {
            data.ref.update({
              cancelado: 1
            })
          });
          this.item.ordenCompra_once(item.ordencompra).query.once('value').then( data2 => {
            data2.ref.update({
              cancelado:1,
              estado:2,
              fechaCancelar: this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString()
            })
          })
        }
        this.item.Liquidacion_once(item.key).query.once('value').then(data =>{
          data.ref.update({
            estado: 6
          })
        })
        alert("Tu liquidacion "+item.nombre+" fue cancelado");
      }if(snap.child('confirmacionProveedor').val()===1){
        alert("Su proveedor ha indicado que envio su requerimiento");
      }
      if(snap.val()===null){
        if(item.estado===2){
          this.item.oferta_Liquidacion_once(item.oferta).query.once('value').then( data => {
            data.ref.update({
              cancelado: 1
            })
          });
          this.item.ordenCompra_once(item.ordencompra).query.once('value').then( data2 => {
            data2.ref.update({
              cancelado:1,
              estado:2,
              fechaCancelar: this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString()
            })
          })
        }
        this.item.Liquidacion_once(item.key).query.once('value').then(data =>{
          data.ref.update({
            estado: 6
          })
        })
        alert("Tu liquidacion "+item.nombre+" fue cancelado");
      }
    })
  }

  culminarRequerimiento(item){
    console.log(item);
    if(item.tipo ===1 || item.tipo ===2){
      this.item.Requerimiento_once(item.key).query.once('value').then(data => {
        data.ref.update({estado: 3});
      })
      this.item.oferta_Requerimiento_once(item.oferta).query.once('value').then(data =>{
        data.ref.update({estado: 1})
      })
    }
    if(item.tipo===3){
      this.item.Liquidacion_once(item.key).query.once('value').then(data =>{
        data.ref.update({estado: 3});
      })
      this.item.oferta_Liquidacion_once(item.oferta).query.once('value').then(data =>{
        data.ref.update({estado: 1})
      })
    }

    this.item.ordenCompra_once(item.ordencompra).query.once('value').then(data => {
      data.child('confirmacionCliente')
      data.ref.update({
        confirmacionCliente: 1,
        estado: 1
      })
    })

    this.itemCulminar = item;

  }
  generarCitaModal(item){
    //console.log(item);
    this.citaSeleccionada = item;
  }

  generarCita(){
    if(this.fechaCita.nativeElement.value===""){
      alert("Por favor ingrese una fecha");
      return '';
    }
    if(this.horaCita.nativeElement.value==="00:00"){
      alert("Por favor ingrese una hora");
      return '';
    }
    if(this.mensajeCita.nativeElement.value===""){
      alert("Por favor ingrese un mensaje");
      return '';
    }
    this.ordenCompra.generarCitaTrabajo(
      this.citaSeleccionada,this.mi_req_ofertas,
      this.datePipe.transform(this.fechaCita.nativeElement.value,'dd-MM-yyyy').toString(),
      this.horaCita.nativeElement.value,
      this.mensajeCita.nativeElement.value,
      this.datePipe.transform(this.myDate,'yyyy-MM-dd').toString());
    this.modalCita.nativeElement.click();
    this.clearModalCita();
  }
  clearModalCita(){
    this.fechaCita.nativeElement.value = null;
    this.horaCita.nativeElement.value = "00:00";
    this.mensajeCita.nativeElement.value = "";
  }

  cancelarCita(item){
    this.item.oferta_Trabajo_once(item.keyOferta).query.once('value').then(data => {
      data.ref.update({
        cancelado: 1
      })
    })
    this.item.citas_once().query.once('value').then(data => {
      data.forEach( x => {
        if(x.child('idOferta').val()===item.keyOferta && x.child('idPostulante').val()===item.keyUsuario && x.child('idRecurso').val()===item.id_requerimiento){
          x.ref.update({
            cancelado: 1
          })
        }
      })
    });
    this.item.Trabajo_once(item.id_requerimiento).query.once('value').then(data => {
      data.ref.update({
        cant_citas: data.child('cant_citas').val()-1
      })
    })

    alert("Cita cancelada satisfactoriamente");
  }

  cancelarTrabajo(item){
    //console.log(item);
    //if(item.cant_citas>0){
      //this.item.citas_once().query.once('value').then(data => {
        //data.forEach(x => {
          //if(x.child('idRecurso').val()===item.key){
            //x.ref.update({
              //cancelado: 1
            //});
            //this.item.oferta_Trabajo_once(x.child('idOferta').val()).query.once('value').then(r => {
              //r.ref.update({
                //cancelado: 1
              //})
            //})
          //}
        //});
      //})
    //}

    this.item.Trabajo_once(item.key).query.once('value').then(data => {
      data.ref.update({
        estado: 6
      })
    })
    alert("Puesto de trabajo "+item.nombre+" cancelado satisfactoriamente");
  }
  republicarRequerimientoModal(item){
    //this.modalReference = this.modalService.open(modal);
    this.fechaRepublicarSeleccionada = item;
    //console.log(item);
  }
  republicarRequerimiento(fechaR){
    //console.log(fechaR.value);
    if(fechaR.value ===""){
      alert("Por favor seleccione una fecha");
      return '';
    }
    if(this.fechaRepublicarSeleccionada.tipo===1 || this.fechaRepublicarSeleccionada.tipo===2){
      this.item.Requerimiento_once(this.fechaRepublicarSeleccionada.key).query.once('value').then(data => {
        data.ref.update({
          estado: 1,
          fecha_final:  this.datePipe.transform(fechaR.value,'dd-MM-yyyy').toString()
        })
        fechaR.value = null;
        
      })
      alert("Requerimiento " +this.fechaRepublicarSeleccionada.nombre+" republicado satisfactoriamente");

    }
    if(this.fechaRepublicarSeleccionada.tipo===3){
      this.item.Liquidacion_once(this.fechaRepublicarSeleccionada.key).query.once('value').then(data => {
        data.ref.update({
          estado: 1,
          fecha_final:  this.datePipe.transform(fechaR.value,'dd-MM-yyyy').toString()
        })
        fechaR.value = null;
        
      })
      alert("Liquidacion " +this.fechaRepublicarSeleccionada.nombre+" republicado satisfactoriamente");
    }
    if(this.fechaRepublicarSeleccionada.tipo===4){
      this.item.Trabajo_once(this.fechaRepublicarSeleccionada.key).query.once('value').then(data => {
        data.ref.update({
          estado: 1,
          fecha_final:  this.datePipe.transform(fechaR.value,'dd-MM-yyyy').toString()
        })
        fechaR.value = null;
      })
      alert("Puesto de trabajo " +this.fechaRepublicarSeleccionada.nombre+" republicado satisfactoriamente");

    }
    this.modalRepublicar.nativeElement.click();
  }
  cancelarMiOferta(item){
    console.log(item);
    if(item.confirmacionPro===1){
      alert("Su oferta no puede ser cancelada por que ha sido culminado");
      return '';
    }
    if(item.tipo===1 || item.tipo===2){

      this.item.oferta_Requerimiento_once(item.key).query.once('value').then( data => {
        data.ref.update({
          cancelado: 1
        })
      })
      this.item.Requerimiento_once(item.id_requerimiento).query.once('value').then(data =>{
        this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value').then( data2 => {
          data2.ref.update({
            cancelado:1,
            estado:2,
            fechaCancelar: this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString()
          })
          alert("Orden de compra cancelada");
        })
      })
    }
    else if(item.tipo===3){

      this.item.oferta_Liquidacion_once(item.key).query.once('value').then( data => {
        data.ref.update({
          cancelado: 1
        })
      })
      this.item.Liquidacion_once(item.id_requerimiento).query.once('value').then(data =>{
        this.item.ordenCompra_once(data.child('ordencompra').val()).query.once('value').then( data2 => {
          data2.ref.update({
            cancelado:1,
            estado:2,
            fechaCancelar: this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString()
          })
          alert("Orden de compra cancelada");
        })
      })
    }
  }

  caliProveedorBien(event,item){
    event.readonly = false;
    event.value = item.calificacionProveedorBien;
    event.readonly = true;
  }

  caliProveedorMal(event,item){
    event.readonly = false;
    event.value = item.calificacionProveedorMal;
    event.readonly = true;
  }
  verResumen(item){
    console.log(item);
      this.item.ordenCompra_once(item.ordencompra).query.once('value').then(data => {
        if(data.child('tipoProveedor').val()===0){
          this.item.Empresa_once(data.child('idProveedor').val()).query.once('value').then(data2 => {
            this.resumenGanador = {
              nombre: data2.child('nombre').val(),
              antiguedad: this.findAntiguedad(data2.child('antiguedad').val()).data.nombre,
              ruc: data2.child('ruc').val(),
              telefono:data2.child('telefono').val(),
              email: data2.child('email').val(),
              calificacionProveedorBien: data2.child('calificacionProveedorBien').val(),
              calificacionProveedorMal: data2.child('calificacionProveedorMal').val(),
              tipo: data.child('tipoProveedor').val()
              
            }

          })
        }else{
          this.item.Persona_once(data.child('idProveedor').val()).query.once('value').then(data2 => {
            this.resumenGanador = {
              nombre: data2.child('nombre').val(),
              //antiguedad: this.findAntiguedad(data2.child('antiguedad').val()).data.nombre,
              direccion: data2.child('direccion').val(),
              dni: data2.child('dni').val(),
              telefono:data2.child('telefono').val(),
              email: data2.child('email').val(),
              calificacionProveedorBien: data2.child('calificacionProveedorBien').val(),
              calificacionProveedorMal: data2.child('calificacionProveedorMal').val(),
              tipo: data.child('tipoProveedor').val()
            }

          })
        }
      })

      if(item.tipo===1 || item.tipo ===2){
        this.resumenOfertas = [];
        this.item.oferta_Requerimiento_once_SN().query.once('value').then(snap =>{
          snap.forEach(data => {
            if(data.child('id_requerimiento').val()===item.key){
              let data_temp = {
                nombre: data.child('nombre').val(),
                departamento:  this.findDepartamento(data.child('ubicacion').val()).data.nombre,
                entrega: this.findEntrega(data.child('entrega').val()).data.nombre,
                //antiguedad: this.findAntiguedad(data.child('antiguedad').val()).data.nombre,
                documento: data.child('documento').val(),
                presupuesto: data.child('presupuesto').val()
              }
              this.resumenOfertas.push(data_temp);
            }
          })
        })
      }
      if(item.tipo===3){
        this.resumenOfertas = [];
        this.item.oferta_Liquidacion_once_SN().query.once('value').then(snap =>{
          snap.forEach(data => {
            if(data.child('id_requerimiento').val()===item.key){
              let data_temp = {
                nombre: data.child('nombre').val(),
                departamento:  this.findDepartamento(data.child('ubicacion').val()).data.nombre,
                entrega: this.findEntrega(data.child('entrega').val()).data.nombre,
                //antiguedad: this.findAntiguedad(data.child('antiguedad').val()).data.nombre,
                documento: 'default',
                presupuesto: data.child('presupuesto').val()
              }
              this.resumenOfertas.push(data_temp);
            }
          })
        })
      }
    
  }

  enviarCalificacion(select,c1,c2,c3){
    if(select.value==="NA"){
      alert("Seleccione si recibio el producto");
      return '';
    }
    if(c1.value===0 || c2.value===0 || c3.value===0){
      alert("Por favor califique a su proveedor..!!")
    }
    this.registroReq.culminarReqCliente(this.itemCulminar,select,c1,c2,c3);
    this.modalCulminar.nativeElement.click();
  }

  culminarOferta(item){
    if(item.tipo===1 || item.tipo===2){
      this.item.oferta_Requerimiento_once(item.key).query.once('value').then(data => {
        data.ref.update({
          estado: 1
        });
      })
      this.item.Requerimiento_once(item.id_requerimiento).query.once('value').then(data2 => {
        this.item.ordenCompra_once(data2.child('ordencompra').val()).query.once('value').then(data2 => {
          this.itemCulminarPro = data2.val();
          data2.ref.update({
            confirmacionProveedor: 1
          })
        })
      })
    }
    if(item.tipo===3){
      this.item.oferta_Liquidacion_once(item.key).query.once('value').then(data => {
        data.ref.update({
          estado: 1
        })
      })
      this.item.Liquidacion_once(item.id_requerimiento).query.once('value').then(data2 => {
        this.item.ordenCompra_once(data2.child('ordencompra').val()).query.once('value').then(data2 => {
          this.itemCulminarPro = data2.val();
          data2.ref.update({
            confirmacionProveedor: 1
          })
        })
      })
    }
  }
  enviarCalificacionPro(select,c1,c2,c3){
    if(select.value==="NA"){
      alert("Seleccione si envio el producto");
      return '';
    }
    if(c1.value===0 || c2.value===0 || c3.value===0){
      alert("Por favor califique a su cliente..!!")
    }
    //console.log(this.itemCulminarPro);
    this.registroReq.culminarOfertaProveedor(this.itemCulminarPro,select,c1,c2,c3);
    this.modalCulminar2.nativeElement.click();
  }
  detalleOferta(item){
    console.log(item);
    this.deOferta = item;
  }
  culminarOrdenCompra(item){
    console.log(item);
  }

}
