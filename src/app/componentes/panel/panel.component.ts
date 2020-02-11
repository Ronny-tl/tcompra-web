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
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  //myInput= "asdasd";
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
  ////////////////////////////
  constructor(
    private authService: AuthService,
    private item: ItemService,
    private registroUsuario: RegistroUsuarioService,
    private storage: AngularFireStorage,
    private datePipe: DatePipe,
    private registroReq: RegistroRequerimientosService
  ) { }

  ngOnInit() {
    this.getUsuario();
    this.getDepartamento();
    this.getRubros();
    
    this.get_mis_requerimientos();
    this.get_mis_ofertas();
    this.getMoneda();
    this.getEntrega();
    this.getFormaPago();
    this.getJornada();
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
      data.forEach(x =>{
        if(x.data.usuario===this.uidUsuario){
          if(x.data.tipo===1){
            const datareq = {
              key: x.key,
              nombre: x.data.nombre,
              rubro: this.findRubros(x.data.rubro).data.nombre,
              departamento: this.findDepartamento(x.data.departamento).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado,
              tipo: x.data.tipo
            }
            this.requerimiento_bien.push(datareq);

            const dataAll = {
              key: x.key,
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
          if(x.data.tipo===2){
            const datareq = {
              key: x.key,
              nombre: x.data.nombre,
              rubro: this.findRubros(x.data.rubro).data.nombre,
              departamento: this.findDepartamento(x.data.departamento).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado,
              tipo: x.data.tipo
            }
            this.requerimiento_servicio.push(datareq);

            const dataAll = {
              key: x.key,
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
      data.forEach(x => {
        if(x.data.usuario === this.uidUsuario){
          const datareq = {
            key: x.key,
            nombre: x.data.nombre,
            rubro: this.findRubros(x.data.rubro).data.nombre,
            departamento: this.findDepartamento(x.data.departamento).data.nombre,
            presupuesto: x.data.presupuesto,
            estado: x.data.estado,
            tipo: x.data.tipo
          }
          this.requerimiento_liquidacion.push(datareq);

          const dataAll = {
            key: x.key,
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
      data.forEach(x => {
        if(x.data.usuario === this.uidUsuario){
          const datareq = {
            key: x.key,
            nombre: x.data.nombre,
            rubro: this.findRubros(x.data.rubro).data.nombre,
            departamento: this.findDepartamento(x.data.departamento).data.nombre,
            sueldo: x.data.sueldo,
            estado: x.data.estado,
            tipo: x.data.tipo
          }
          this.requerimiento_trabajo.push(datareq);

          const dataAll = {
            key: x.key,
            nombre: x.data.nombre,
            rubro: this.findRubros(x.data.rubro).data.nombre,
            departamento: this.findDepartamento(x.data.departamento).data.nombre,
            presupuesto: x.data.presupuesto,
            estado: x.data.estado,
            tipo: x.data.tipo,
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
            const dataOferta = {
              key: x.key,
              nombre: x.data.nombre,
              //rubro: this.findRubros(x.data.rubro).data.nombre,
              ubicacion: this.findDepartamento(x.data.ubicacion).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado,
              tipo: x.data.tipo,
            }
            this.oferta_requerimiento_bien.push(dataOferta);
          }
          if(x.data.tipo===2){
            const dataOferta = {
              key: x.key,
              nombre: x.data.nombre,
              //rubro: this.findRubros(x.data.rubro).data.nombre,
              ubicacion: this.findDepartamento(x.data.ubicacion).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado,
              tipo: x.data.tipo
            }
            this.oferta_requerimiento_servicio.push(dataOferta);
          }
        }
      })
    })
    this.item.getOferta_Liquidacion().subscribe(data =>{
      this.oferta_requerimiento_liquidacion=[];
      data.forEach(x => {
        if(x.data.usuario === this.uidUsuario){
          const dataOferta = {
            key: x.key,
            nombre: x.data.nombre,
            //rubro: this.findRubros(x.data.rubro).data.nombre,
            ubicacion: this.findDepartamento(x.data.ubicacion).data.nombre,
            presupuesto: x.data.presupuesto,
            estado: x.data.estado,
            tipo: x.data.tipo
          }
          this.oferta_requerimiento_liquidacion.push(dataOferta);
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
            tipo: x.data.tipo
          }
          this.oferta_requerimiento_trabajo.push(dataOferta);
        }
      })
    })
  }
  get_mis_ordenes_compra(){
    this.item.getOrdenCompra().subscribe(data =>{

    })
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
   
  }
  eliminarReq(key,tipo,name){
    this.registroReq.deleteReq(key,tipo);
    if(tipo===1 || tipo===2){
      alert("Requerimiento "+name+" eliminado satisfactoriamente!!");
    }
    if(tipo===3){
      alert("Liquidación "+name+" eliminado satisfactoriamente!!");
    }
    if(tipo===4){
      alert("Recurso Humano "+name+" eliminado satisfactoriamente!!");
    }
  }
  eliminarOfe(key,tipo,name){
      this.registroReq.deleteOferta(key,tipo);
      alert("Tu oferta "+name+" eliminado satisfactoriamente!!");
  }
}
