import { Component, OnInit, ViewChild , ElementRef, TemplateRef } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl,FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalServiceService } from '../../servicios/modal-service.service';
import { DatePipe } from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
///firebase
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {Observable} from 'rxjs/observable';
import {requerimientos} from '../../models/requerimientos';
import {liquidacion} from '../../models/liquidacion';
import {puestoTrabajo} from '../../models/puesto_trabajo';
import {registroEmpresa} from '../../models/registroEmpresa';
import {usuario} from '../../models/usuario';
//servicios
import {ItemService} from '../../servicios/item.service';
import {RegistroUsuarioService} from '../../servicios/registro-usuario.service';
//bootstrap
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// jQuery
//import $ from 'jquery';
//import * as $ from 'jquery';
//declare var $: any;
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public labels: any = {
    previousLabel: 'Atras',
    nextLabel: 'Siguiente'
};
  pageActual:number = 1;
  pageActualServicios:number = 1;
  pageActualLiquidacion:number = 1;
  pageActualTrabajo:number = 1;
  cantListBienes:number= 10;
  cantListServicios:number =10;
  cantListLiquidacion:number= 10;
  cantListTrabajo:number= 10;
  cantBienes: number = 0;
  cantServicios: number =0;
  cantLiquidacion: number;
  cantTrabajo: number;
  selectTest: string ="-LjS65S0NtwAABX-VuOg";
  myDate = new Date();
  loginForm: FormGroup;
  registerForm: FormGroup;
  public isLogin: boolean;
  public isRadio: boolean = true;
  public lblRadio: string ="Ingrese su RUC";
  public emailUsuario: string;
  public uid: string;
  public validar: boolean = false;
  buscarForm: FormGroup;
  @ViewChild('email',{static: false}) email: ElementRef; // get value email
  @ViewChild('pass', {static: false}) pass: ElementRef; // get value email
  //@ViewChild('dni', {static: false}) dni: ElementRef;
  //@ViewChild('ruc', {static: false}) ruc: ElementRef;
  validarDoc : string;
  @ViewChild('Login', { static: false }) loginModal: ElementRef;
  @ViewChild('Empresa', { static: false }) EmpresaModal: ElementRef;
  @ViewChild('Registrar', { static: false }) RegistrarModal: ElementRef;
  @ViewChild('ValidarCuenta', { static: false }) validarCuenta2: ElementRef;
//////////////////// Registro Empresa
@ViewChild('nombreEmpresa',{static: false}) nombreEmpresa: ElementRef;
@ViewChild('razonSocialEmpresa',{static: false}) razonSocialEmpresa: ElementRef;
@ViewChild('direccionEmpresa',{static: false}) direccionEmpresa: ElementRef;
@ViewChild('especialidadEmpresa',{static: false}) especialidadEmpresa: ElementRef;
@ViewChild('registerEmail',{static: false}) registerEmail: ElementRef;
@ViewChild('registerPass',{static: false}) registerPass: ElementRef;
@ViewChild('registerPass2',{static: false}) registerPass2: ElementRef;
////////////////////////////
  usuario: usuario[];
  requerimientos_bien: requerimientos[];
  requerimientos_servicio: requerimientos[];
  pTrabajo: puestoTrabajo[];
  liquidacion: liquidacion[];
  rEmpresa ={nombre:'',ruc:'',razonSocial:'',direccion:'',departamento:0,tipo:0,especialidad:'',rubro1:undefined,rubro2:undefined,rubro3:undefined,antiguedad:0,email:'',imagen:'default',fec_creacion:'',fec_modificacion:'',telefono:'',tokenWeb:'',ultima_sesion:'',conectado:0};
  rPersona={nombre:'',dni:'',direccion:'',departamento:0,tipo:0,imagen:'default',fec_creacion:'',fec_modificacion:'',rubro1:undefined,rubro2:undefined,rubro3:undefined,email:'',telefono:'',tokenWeb:'',ultima_sesion:'',conectado:0}
  tipoRegistro: string;
  persona = [];
  empresa = [];

  childs: [];

  public dpa: string;
  departamentos = [];
  rubros = [];
  jornada = [];
  entrega = [];
  antiguedad = [];
  tipoEmpresa = [];
  loginService: Subscription;
  nombreUsuario: any;
  imagenUsuario: any = "assets/images/avatar.jpg";

  public modalRef: BsModalRef; 
  selectedOption: string;
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(this.emailPattern)]),
      pass: new FormControl('', [Validators.required, Validators.minLength(6),Validators.nullValidator])
    });
  }
  registerFormGroup() {
    return new FormGroup({
      registerEmail: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(this.emailPattern)]),
      registerPass: new FormControl('', [Validators.required, Validators.minLength(6),Validators.nullValidator]),
      registerPass2: new FormControl('', [Validators.required, Validators.minLength(6),Validators.nullValidator])
    });
  }
  /////////////////ULTIMO 11/02/2020

  tipoUsuario:number=3;

  ///////////////// 12/02/2020
  busquedaBien:boolean = false;
  busquedaServicio:boolean = false;
  busquedaLiquidacion:boolean = false;
  busquedaTrabajo:boolean = false;

  @ViewChild('busqBien',{static: false}) busqBien: ElementRef;
  selecDepBien:string = "Departamento";
  selecRubroBien:string = "Seleccione Rubro";
  selecEntregaBien:string = "-LjS6ygVTMvasGPrdtqp";
  @ViewChild('busqBien1',{static: false}) busqBien1: ElementRef;
  @ViewChild('busqBien2',{static: false}) busqBien2: ElementRef;

  @ViewChild('busqServicio',{static: false}) busqServicio: ElementRef;
  selecDepServicio:string = "Departamento";
  selecRubroServicio:string = "Seleccione Rubro";
  selecEntregaServicio:string = "-LjS6ygVTMvasGPrdtqp";
  @ViewChild('busqServicio1',{static: false}) busqServicio1: ElementRef;
  @ViewChild('busqServicio2',{static: false}) busqServicio2: ElementRef;

  @ViewChild('busqLiq',{static: false}) busqLiq: ElementRef;
  selecDepLiq:string = "Departamento";
  selecRubroLiq:string = "Seleccione Rubro";
  selecEntregaLiq:string = "-LjS6ygVTMvasGPrdtqp";
  @ViewChild('busqLiq1',{static: false}) busqLiq1: ElementRef;
  @ViewChild('busqLiq2',{static: false}) busqLiq2: ElementRef;
  
  @ViewChild('busqTrabajo',{static: false}) busqTrabajo: ElementRef;
  selecDepTrabajo:string = "Departamento";
  selecRubroTrabajo:string = "Seleccione Rubro";
  selecJornadaTrabajo:string = "-LjS6SlPBOA29CcKypLS";
  @ViewChild('busqTrabajo1',{static: false}) busqTrabajo1: ElementRef;
  @ViewChild('busqTrabajo2',{static: false}) busqTrabajo2: ElementRef;

  constructor(
    public authService: AuthService,
    private itemService: ItemService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    public addDB: RegistroUsuarioService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute


  ) {
    this.loginForm = this.createFormGroup();
    this.registerForm = this.registerFormGroup();
   }

  ngOnInit() {
     this.loginService = this.authService.getAuth().subscribe(auth =>{
       if(auth){
         //this.isLogin= true;
         //this.emailUsuario = auth.email;
         this.uid = auth.uid;
         //alert(this.uid);
         this.iniciarUsuario();
         //alert("test");
       }else{
         //this.isLogin=false;
         this.tipoUsuario = 3;
       }
     })
    this.getRubros();
    this.getDepartamento();
    this.getRequerimientos();
    this.getLiquidacion();
    this.getPuestoTrabajo();
    this.getJornada();
    this.getEntrega();
    this.getTipoEmpresa()
    this.getAntiguedad();
    //this.loginService.unsubscribe();
    
  }
  select222(){
    alert(this.selectTest);
  }
  IniciarSesion(){
    if (this.loginForm.valid) {
    //this.authService.loginEmail(this.email.nativeElement.value,this.pass.nativeElement.value).then((res)=>{
        this.authService.loginEmail(this.email.nativeElement.value,this.pass.nativeElement.value).then((res:any)=>{
          //alert("Bienvenido "+this.emailUsuario);
            if(res.user.emailVerified===false){
              alert("Para poder iniciar sesion debe verificar su correo");
              this.authService.logout();
            }else{
              this.iniciarUsuario();
              this.loginModal.nativeElement.click();
            }
        
        }).catch((err)=>{
          console.log(err.message);
          if(err.message ==="The password is invalid or the user does not have a password."){
            alert("La contraseña es incorrecta!!");
          }
          if(err.message ==="There is no user record corresponding to this identifier. The user may have been deleted."){
            alert("El usuario no existe!!");
          }
      });
    } else {
      console.log('Not Valid');
      alert("Ingrese los campos requeridos con el formato correcto!!");
    }
  }

  SalirSesion(){
    this.authService.logout();
    this.tipoUsuario = 3;
  }

  iniciarUsuario(){
        this.authService.getUsuario_Empresa().subscribe(data => {
          data.forEach(item =>{
          if(item.key == this.uid){
            this.nombreUsuario = item.data.nombre;
            this.tipoUsuario = 0;
            if(item.data.imagen != "default"){
              this.imagenUsuario = item.data.imagen;
            }
          }
          });
        });
        this.authService.getUsuario_Persona().subscribe(data => {
          data.forEach(item =>{
          if(item.key == this.uid){
            this.nombreUsuario = item.data.nombre;
            this.tipoUsuario = 1;
            if(item.data.imagen != "default"){
              this.imagenUsuario = item.data.imagen;
            }
          }
          });
        });
  }

  getRequerimientos(){
    let s = this.itemService.listarRequerimientos(); 
    s.snapshotChanges().subscribe(data => {
      if(!this.busquedaBien){ this.requerimientos_bien = []; }
      if(!this.busquedaServicio){ this.requerimientos_servicio = [];}
      this.cantBienes = 0;
      this.cantServicios= 0;
      data.forEach(item => {
        //console.log(item);
        //let a= item.payload.toJSON(); 
        //a['$key'] = item.key;
        if(item.payload.child('tipo').val()==1){
          if(item.payload.child('estado').val()===1){
            const a = {
              key:item.key,
              nombre: item.payload.child('nombre').val(),
              correo: item.payload.child('correo').val(),
              entrega: item.payload.child('entrega').val(),
              rubro: this.findRubros(item.payload.child('rubro').val()).data.nombre,
              fecha_final: item.payload.child('fecha_final').val(),
              tipo: item.payload.child('tipo').val(),
              departamento: this.findDepartamento(item.payload.child('departamento').val()).data.nombre
            }
            if(!this.busquedaBien){
              this.requerimientos_bien.push(a);
            }

          }
        this.cantBienes = this.cantBienes + 1;
        //this.requerimientos_bien.push(a as requerimientos);
      }
      if(item.payload.child('tipo').val()==2){
        if(item.payload.child('estado').val()===1){
            const a = {
              key:item.key,
              nombre: item.payload.child('nombre').val(),
              correo: item.payload.child('correo').val(),
              entrega: item.payload.child('entrega').val(),
              rubro: this.findRubros(item.payload.child('rubro').val()).data.nombre,
              fecha_final: item.payload.child('fecha_final').val(),
              tipo: item.payload.child('tipo').val(),
              departamento: this.findDepartamento(item.payload.child('departamento').val()).data.nombre
              
            }
            if(!this.busquedaServicio){
              this.requerimientos_servicio.push(a);
            }
        }
          this.cantServicios = this.cantServicios +1;
        }
      });
    });
  
  }
  getLiquidacion(){
    let s = this.itemService.listarLiquidacion(); 
    s.snapshotChanges().subscribe(data => { 
      this.cantLiquidacion = data.length;
      if(!this.busquedaLiquidacion){this.liquidacion = [];}
      data.forEach(item => {
        if(item.payload.child('tipo').val()==3){
          if(item.payload.child('estado').val()===1){
            const a = {
              key:item.key,
              tipo: item.payload.child('tipo').val(),
              nombre: item.payload.child('nombre').val(),
              correo: item.payload.child('correo').val(),
              entrega: item.payload.child('entrega').val(),
              rubro: this.findRubros(item.payload.child('rubro').val()).data.nombre,
              fecha_final: item.payload.child('fecha_final').val(),
              departamento: this.findDepartamento(item.payload.child('departamento').val()).data.nombre
            }
            if(!this.busquedaLiquidacion){
              this.liquidacion.push(a);
            }
          }
      }
      
      });
    });
  
  }
  getPuestoTrabajo(){
    let s = this.itemService.listarPuestoTrabajo(); 
    s.snapshotChanges().subscribe(data => { 
      this.cantTrabajo = data.length;
      if(!this.busquedaTrabajo){this.pTrabajo = [];}
      data.forEach(item => {
        if(item.payload.child('tipo').val()==4){
          if(item.payload.child('estado').val()===1){
              const a = {
              key:item.key,
              tipo: item.payload.child('tipo').val(),
              nombre: item.payload.child('nombre').val(),
              correo: item.payload.child('correo').val(),
              jornada: item.payload.child('jornada').val(),
              rubro: this.findRubros(item.payload.child('rubro').val()).data.nombre,
              fecha_final: item.payload.child('fecha_final').val(),
              departamento: this.findDepartamento(item.payload.child('departamento').val()).data.nombre
            }
            if(!this.busquedaTrabajo){
              this.pTrabajo.push(a);
            }
          }
        }
      
      });
    });
  
  }

 getDepartamento(){
    this.itemService.getDepartamento().subscribe(data => {
      this.departamentos = data;
      //this.buscarForm.controls.departamento.setValue(this.departamentos[0].data.nombre);      
    });
  }
  getRubros(){
    this.itemService.getRubros().subscribe(data => {
      this.rubros = data;  
      //this.buscarForm.controls.rubroFormSelect.setValue(this.rubros[0].data.nombre);      
    });

  }
  getJornada(){
    this.itemService.getJornada().subscribe(data => {
      this.jornada = data;  
      //this.buscarForm.controls.jornadaFormSelect.setValue(this.jornada[0].data.nombre);      
    });
  }
  getEntrega(){
    this.itemService.getEntrega().subscribe(data => {
      this.entrega = data;  
      //this.buscarForm.controls.entregaFormSelect.setValue(this.entrega[0].data.nombre);      
    });
  }
  getAntiguedad(){
    this.itemService.getAntiguedad().subscribe(data => {
      this.antiguedad = data;  
      //this.buscarForm.controls.entregaFormSelect.setValue(this.entrega[0].data.nombre);      
    });
  }
  getTipoEmpresa(){
    this.itemService.getTipoEmpresa().subscribe(data => {
      this.tipoEmpresa = data;  
      //this.buscarForm.controls.entregaFormSelect.setValue(this.entrega[0].data.nombre);      
    });
  }

  findRubros(keyId){
    return this.rubros.find( function(item) {
      return item.key == keyId;
    });
  }
  findDepartamento(keyId){
    return this.departamentos.find( function(item) {
      return item.key == keyId;
    });
  }
  setRadio(data){
    if(data=="Persona"){
      this.isRadio= false;
      this.lblRadio ="Ingrese su DNI";
    }
    if(data=="Empresa"){
      this.isRadio= true;
      this.lblRadio ="Ingrese su RUC";
    }
  }
  openModal() {
    //document.getElementById("openModalButton").click();
    alert(this.selectedOption);
  }
  selectOption(id: string) {
    //getted from event
    console.log(id);
    //getted from binding
    //console.log(this.selected)
    alert(id);
  }

  validarFormularioMessage(form: FormGroup, nombre: string) {
    if (form.controls[nombre] === undefined) {
      return '';
    }
    if (form.controls[nombre].value === null) {
      return '';
    }
    if (form.controls[nombre].value.length < 1) {
      return '';
    }
    if (form.controls[nombre].valid) {
      return 'valid-feedback';
    }
    return 'invalid-feedback';
  }

  /**
   * Validacion del mensaje
   */
  validarFormularioMessageShow(form: FormGroup, nombre: string) {
    if (form.controls[nombre] === undefined) {
      return 0;
    }
    if (form.controls[nombre].value === null) {
      return 0;
    }
    if (form.controls[nombre].value.length < 1) {
      return 0;
    }
    if (form.controls[nombre].valid) {
      return 1;
    }
    return 2;
  }

  validarFormularioInput(form: FormGroup, nombre: string) {
    if (form.controls[nombre] === undefined) {
      return '';
    }
    if (form.controls[nombre].value === null) {
      return '';
    }
    if (form.controls[nombre].value.length < 1) {
      return '';
    }
    if (form.controls[nombre].valid) {
      return 'form-control is-valid';
    }
    return 'form-control is-invalid';
  }

  validarDocumento(){
    this.validar = false;
    if(this.isRadio){
      if(this.validarDoc===''){
        alert("Ingrese su RUC");
        return '';
      }
      if(this.validarDoc.length < 12){
        alert("Su RUC tiene menos de 12 digitos");
        return '';
      }
      const v1 = this.authService.getUsuario_Empresa().subscribe(data => {
        data.forEach(item =>{
          if(item.data.ruc === this.validarDoc){
            this.validar = true;
            alert("Este RUC ya se encuentra registrado!!");
            return '';
          }
        });
        v1.unsubscribe()
        //alert(this.validar);
        if(this.validar === false){
          //alert(this.ruc.nativeElement.value);
         this.rEmpresa['ruc'] = this.validarDoc;
         this.tipoRegistro = 'Empresa';
          this.RegistrarModal.nativeElement.click();
          //his.showChildModal();
          document.getElementById("modalEmpresa").click();
          //alert(this.rEmpresa.departamento);
        }
      });
    }else{
      this.authService.getUsuario_Persona().subscribe(data => {
        data.forEach(item =>{
          if(item.data.dni === this.validarDoc){
            alert("Este DNI ya se encuentra registrado!!");
            this.validar = true;
            return '';
          }
        });
        //alert(this.validar);
        if(this.validar === false){
          this.tipoRegistro = 'Persona';
          this.RegistrarModal.nativeElement.click();
          document.getElementById("modalPersona").click();
        }
      });
    }
  }

  validarCuenta(){
    //alert(this.rEmpresa.departamento);
    if(this.rEmpresa.departamento === 0 || this.rEmpresa.departamento ===undefined){
      alert("Por favor Seleccione un Departamento");
      return '';
    }
    if(this.rEmpresa.tipo ===0 || this.rEmpresa.tipo === undefined){
      alert("Por favor Seleccione un Tipo");
      return'';
    }
    if(this.rEmpresa.rubro1==="-LjS65S0NtwAABX-VuOg" || this.rEmpresa.rubro2 ==="-LjS65S0NtwAABX-VuOg" || this.rEmpresa.rubro3==="-LjS65S0NtwAABX-VuOg" || this.rEmpresa.rubro1 ===undefined || this.rEmpresa.rubro2 === undefined ||this.rEmpresa.rubro3===undefined ){
      alert("Por favor Seleccione los 3 rubros");
      return'';
    }
    if(this.tipoRegistro==="Empresa"){
      this.rEmpresa['nombre'] = this.nombreEmpresa.nativeElement.value;
      this.rEmpresa['razonSocial'] = this.razonSocialEmpresa.nativeElement.value;
      this.rEmpresa['direccion'] = this.direccionEmpresa.nativeElement.value;
      this.rEmpresa['especialidad'] = this.especialidadEmpresa.nativeElement.value;
      this.rEmpresa['fec_creacion'] = this.datePipe.transform(this.myDate, 'dd-MM-yyyy').toString();
      this.rEmpresa['fec_modificacion'] = this.datePipe.transform(this.myDate, 'dd-MM-yyyy').toString();
      document.getElementById("validarCuenta").click();
    }
    if(this.tipoRegistro==="´Persona"){
      this.rPersona['nombre'] = this.nombreEmpresa.nativeElement.value;
      this.rPersona['direccion'] = this.direccionEmpresa.nativeElement.value;
      this.rPersona['especialidad'] = this.especialidadEmpresa.nativeElement.value;
      this.rPersona['fec_creacion'] = this.datePipe.transform(this.myDate, 'dd-MM-yyyy').toString();
      this.rPersona['fec_modificacion'] = this.datePipe.transform(this.myDate, 'dd-MM-yyyy').toString();
      document.getElementById("validarCuenta").click();
    }

  }

  selectDepartamento(id: number) {
    this.rEmpresa['departamento'] = id;
    //console.log("departamento id: "+id);
  }
  selectTipo(id: number) {
    this.rEmpresa['tipo'] = id;
    //console.log("tipo id: "+id);
  }
  selectRubro1(id: string) {
    this.rEmpresa['rubro1'] = id;
    //console.log("rubro 1 id: "+id);
  }
  selectRubro2(id: string) {
    this.rEmpresa['rubro2'] = id;
    //console.log("rubro 2 id: "+id);
  }
  selectRubro3(id: string) {
    this.rEmpresa['rubro3'] = id;
    //console.log("rubro 3 id: "+id);
  }
  selectAntiguedad(id: number) {
    this.rEmpresa['antiguedad'] = id;
    //console.log("antiguedad id: "+id);
  }
  RegistrarUsuario(){
    if(this.registerForm.valid){
      if(this.registerPass.nativeElement.value != this.registerPass2.nativeElement.value){
        alert("Las contraseñas no coinciden");
        return'';
      }
      this.authService.registerUser(this.registerEmail.nativeElement.value,this.registerPass.nativeElement.value).then((res:any) =>{
          if(res.user.emailVerified==false){
            //this.rEmpresa['email'] = this.registerEmail.nativeElement.value;
            this.addDB.addUsuario(this.rEmpresa,res.user.uid,this.tipoRegistro);
            alert("Gracias por registrarte en TCompra, Para poder loguearte es necesario verificar tu correo");
            //this.EmpresaModal.nativeElement.click();
            this.validarCuenta2.nativeElement.click();
            //this.EmpresaModal.nativeElement.click();
            //this.authService.logout();
            
          }
          this.authService.logout();
          this.EmpresaModal.nativeElement.click();
          //console.log(res);
      }).catch((err) =>{
        if(err.message ==="The email address is already in use by another account."){
          alert("La dirección de correo electrónico ya está en uso por otra cuenta.");
        }
        console.log(err);
      })
    }else{
      alert("Ingrese el Email y la Contraseña con el formato correcto")
    }
  }
  public enviarData(event, id){
   //this.post.id = this.route.snapshot.params.id;
   //alert(item.key);
   //this.addDB.enviarId(item.key);
   this.router.navigate(['/detalle-prod',id.tipo,id.key]);
  }

  paginationTable(cant,id:number){
    this.cantListBienes = parseInt(cant);
    if(id===1){ this.cantListBienes = parseInt(cant);}
    if(id===2){ this.cantListServicios = parseInt(cant);}
    if(id===3){ this.cantListLiquidacion = parseInt(cant);}
    if(id===4){ this.cantListTrabajo = parseInt(cant);}
   
  }
  buscarBien(){
    if(this.busquedaBien){
      this.busquedaBien = false;
      this.getRequerimientos();
    }else{
      this.busquedaBien = true;
      var temp = [];
      for(let x of this.requerimientos_bien){
        var du = true;
        if(du && this.busqBien.nativeElement.value.toUpperCase() != ""  && x.nombre.toUpperCase().includes(this.busqBien.nativeElement.value.toUpperCase())){
         temp.push(x);
         du = false;
        }
        if(du && this.selecDepBien===x.departamento){
          temp.push(x);
          du = false;
        }
        if(du && this.selecRubroBien=== x.rubro){
          temp.push(x);
          du = false;
        }if(du && this.selecEntregaBien ===x.entrega){
          temp.push(x);
          du = false;
        }if(du && this.busqBien1.nativeElement.value != "" && this.busqBien2.nativeElement.value != ""){
          var p = x.fecha_final.split('-');
          var p2 = this.busqBien1.nativeElement.value.split('-');
          var p3 = this.busqBien2.nativeElement.value.split('-');
          var fp = new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));
          var f1 = new Date(Number(p2[0]),Number(p2[1])-1,Number(p2[2]));
          var f2 = new Date(Number(p3[0]),Number(p3[1]-1),Number(p3[2]));
          if(fp.getTime() >= f1.getTime() && fp.getTime() <= f2.getTime()){
            temp.push(x);
            du = false;
          }
        }
      }
      this.requerimientos_bien = temp;
    }
  }

  buscarServicio(){
    if(this.busquedaServicio){
      this.busquedaServicio = false;
      this.getRequerimientos();
    }else{
      this.busquedaServicio = true;
      var temp = [];
      for(let x of this.requerimientos_servicio){
        var du = true;
        if(du && this.busqServicio.nativeElement.value.toUpperCase() != ""  && x.nombre.toUpperCase().includes(this.busqServicio.nativeElement.value.toUpperCase())){
         temp.push(x);
         du = false;
        }
        if(du && this.selecDepServicio===x.departamento){
          temp.push(x);
          du = false;
        }
        if(du && this.selecRubroServicio=== x.rubro){
          temp.push(x);
          du = false;
        }if(du && this.selecEntregaServicio ===x.entrega){
          temp.push(x);
          du = false;
        }if(du && this.busqServicio1.nativeElement.value != "" && this.busqServicio2.nativeElement.value != ""){
          var p = x.fecha_final.split('-');
          var p2 = this.busqServicio1.nativeElement.value.split('-');
          var p3 = this.busqServicio2.nativeElement.value.split('-');
          var fp = new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));
          var f1 = new Date(Number(p2[0]),Number(p2[1])-1,Number(p2[2]));
          var f2 = new Date(Number(p3[0]),Number(p3[1]-1),Number(p3[2]));
          if(fp.getTime() >= f1.getTime() && fp.getTime() <= f2.getTime()){
            temp.push(x);
            du = false;
          }
        }
      }
      this.requerimientos_servicio = temp;
    }
  }

  buscarLiquidacion(){
    if(this.busquedaLiquidacion){
      this.busquedaLiquidacion = false;
      this.getLiquidacion();
    }else{
      this.busquedaLiquidacion = true;
      var temp = [];
      for(let x of this.liquidacion){
        var du = true;
        if(du && this.busqLiq.nativeElement.value.toUpperCase() != ""  && x.nombre.toUpperCase().includes(this.busqLiq.nativeElement.value.toUpperCase())){
         temp.push(x);
         du = false;
        }
        if(du && this.selecDepLiq===x.departamento){
          temp.push(x);
          du = false;
        }
        if(du && this.selecRubroLiq=== x.rubro){
          temp.push(x);
          du = false;
        }if(du && this.selecEntregaLiq ===x.entrega){
          temp.push(x);
          du = false;
        }if(du && this.busqLiq1.nativeElement.value != "" && this.busqLiq2.nativeElement.value != ""){
          var p = x.fecha_final.split('-');
          var p2 = this.busqLiq1.nativeElement.value.split('-');
          var p3 = this.busqLiq2.nativeElement.value.split('-');
          var fp = new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));
          var f1 = new Date(Number(p2[0]),Number(p2[1])-1,Number(p2[2]));
          var f2 = new Date(Number(p3[0]),Number(p3[1]-1),Number(p3[2]));
          if(fp.getTime() >= f1.getTime() && fp.getTime() <= f2.getTime()){
            temp.push(x);
            du = false;
          }
        }
      }
      this.liquidacion = temp;
    }
  }

  buscarTrabajo(){
    if(this.busquedaTrabajo){
      this.busquedaTrabajo = false;
      this.getPuestoTrabajo();
    }else{
      this.busquedaTrabajo = true;
      var temp = [];
      for(let x of this.pTrabajo){
        var du = true;
        if(du && this.busqTrabajo.nativeElement.value.toUpperCase() != ""  && x.nombre.toUpperCase().includes(this.busqTrabajo.nativeElement.value.toUpperCase())){
         temp.push(x);
         du = false;
        }
        if(du && this.selecDepTrabajo === x.departamento){
          temp.push(x);
          du = false;
        }
        if(du && this.selecRubroTrabajo === x.rubro){
          temp.push(x);
          du = false;
        }if(du && this.selecJornadaTrabajo ===x.jornada){
          temp.push(x);
          du = false;
        }if(du && this.busqTrabajo1.nativeElement.value != "" && this.busqTrabajo2.nativeElement.value != ""){
          var p = x.fecha_final.split('-');
          var p2 = this.busqTrabajo1.nativeElement.value.split('-');
          var p3 = this.busqTrabajo2.nativeElement.value.split('-');
          var fp = new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));
          var f1 = new Date(Number(p2[0]),Number(p2[1])-1,Number(p2[2]));
          var f2 = new Date(Number(p3[0]),Number(p3[1]-1),Number(p3[2]));
          if(fp.getTime() >= f1.getTime() && fp.getTime() <= f2.getTime()){
            temp.push(x);
            du = false;
          }
        }
      }
      this.pTrabajo = temp;
    }
  }

}
