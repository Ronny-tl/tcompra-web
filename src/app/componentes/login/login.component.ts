import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl,FormsModule } from '@angular/forms';
import { Subscription, iif } from 'rxjs';
import { ModalServiceService } from '../../servicios/modal-service.service';
import { DatePipe } from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {MessagingService} from '../../servicios/messaging.service';
///firebase
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
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
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
  validarDoc : string;
  @ViewChild('Login', { static: false }) loginModal: ElementRef;
  @ViewChild('Empresa', { static: false }) EmpresaModal: ElementRef;
  @ViewChild('Persona', { static: false }) PersonaModal: ElementRef;
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
  rEmpresa ={nombre:'',ruc:'',razonSocial:'',direccion:'',departamento:0,tipo:0,tipo_empresa:0,tutorial:0,especialidad:'',rubro1:undefined,rubro2:undefined,rubro3:undefined,antiguedad:0,email:'',imagen:'default',fec_creacion:'',fec_modificacion:'',telefono:'',tokenWeb:'',tokenMovil:'',ultima_sesion:'',conectado:0,calificacionClienteBien:0,calificacionClienteMal:0,calificacionProveedorBien:0,calificacionProveedorMal:0};
  rPersona={nombre:'',dni:'',direccion:'',departamento:0,tipo:1,tutorial:0,imagen:'default',fec_creacion:'',fec_modificacion:'',rubro1:undefined,rubro2:undefined,rubro3:undefined,email:'',telefono:'',tokenWeb:'',tokenMovil:'',ultima_sesion:'',conectado:0,calificacionClienteBien:0,calificacionClienteMal:0,calificacionProveedorBien:0,calificacionProveedorMal:0}
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

 ///////////////CAMBIOS 11/02/2020
 selectedRubro1:string ="-LjS65S0NtwAABX-VuOg";
 selectedRubro2:string ="-LjS65S0NtwAABX-VuOg";
 selectedRubro3:string ="-LjS65S0NtwAABX-VuOg";
 selectedTipoEmpresa:number =0;
 selectedDepaEmpresa:number =0;
 selectedAntiguedad:number =0;
 aceptoTerminosRegistro:boolean = false;

 selectedRubro1P:string ="-LjS65S0NtwAABX-VuOg";
 selectedRubro2P:string ="-LjS65S0NtwAABX-VuOg";
 selectedRubro3P:string ="-LjS65S0NtwAABX-VuOg";
 selectedDepaPersona:number =0;
 @ViewChild('nombrePersona',{static: false}) nombrePersona: ElementRef;
 @ViewChild('ape1Persona',{static: false}) ape1Persona: ElementRef;
 @ViewChild('ape2Persona',{static: false}) ape2Persona: ElementRef;
 @ViewChild('direccionPersona',{static: false}) direccionPersona: ElementRef;
 @ViewChild('telefonoPersona',{static: false}) telefonoPersona: ElementRef;

 @ViewChild('EmailRec',{static: false}) EmailRec: ElementRef;
 @ViewChild('RecuperarPass',{static: false}) modalRecuperar: ElementRef;

  misNotificaciones = [];
  contNotificaciones: number = 0;
  constructor(
    public authService: AuthService,
    private itemService: ItemService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    public addDB: RegistroUsuarioService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private message: NotificationsService,
    private messagingService: MessagingService,
  ) { 
    this.loginForm = this.createFormGroup();
    this.registerForm = this.registerFormGroup();
  }

  ngOnInit() {
    if(localStorage.getItem("usuarioActivo") != null) {
      this.isLogin = true;
      let user = JSON.parse(localStorage.getItem('usuarioActivo'));
      this.nombreUsuario = user.nombre;
      this.imagenUsuario = user.imagen;
      
    }
    this.authService.getAuth().subscribe(auth =>{
      if(auth){
        this.isLogin= true;
        this.emailUsuario = auth.email;
        this.uid = auth.uid;
        //console.log(localStorage.getItem("usuarioActivo"));
        this.iniciarUsuario();
        ////this.iniciarUsuario();
      }else{
        this.isLogin=false;
      }
    })
    this.getRubros();
    this.getDepartamento();
    //this.getRequerimientos();
    //this.getLiquidacion();
    //this.getPuestoTrabajo();
    this.getJornada();
    this.getEntrega();
    this.getTipoEmpresa()
    this.getAntiguedad();
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
              this.onSuccess('Login','Bienvenido '+this.email.nativeElement.value+' a TCompra');
              this.iniciarUsuario();
              this.loginModal.nativeElement.click();
              this.authService.setPass(this.pass.nativeElement.value);
              this.loginForm.reset();
              //this.messagingService.receiveMessage();
              localStorage.setItem('notificacion','0');
            }
        
        }).catch((err)=>{
          console.log(err.message);
          if(err.message ==="The password is invalid or the user does not have a password."){
            //alert("La contraseña es incorrecta!!");
            this.onError('Login','La contraseña es incorrecta!!')
          }
          if(err.message ==="There is no user record corresponding to this identifier. The user may have been deleted."){
            //alert("El usuario no existe!!");
            this.onError('Login','El usuario no existe!!')
          }
      });
    } else {
      //console.log('Not Valid');
      alert("Ingrese los campos requeridos con el formato correcto!!");
      this.onError('Login','Ingrese los campos requeridos con el formato correcto!!')
    }
  }
  SalirSesion(){
    localStorage.clear();
    this.authService.logout();
    localStorage.clear();
    this.messagingService.ngOnDestroy();
  }

  iniciarUsuario(){
        this.authService.getUsuario_Empresa().subscribe(data => {
          data.forEach(item =>{
          if(item.key === this.uid){
            this.nombreUsuario = item.data.nombre;
            //this.onSuccess('Login Correcto','Bienvenido '+item.data.nombre+' a TCompra EMPRESA');
            //if(item.data.imagen != "default"){
              this.imagenUsuario = item.data.imagen;
            //}
            let usuario = {
              nombre: item.data.nombre,
              imagen: item.data.imagen,
              tipo: 0,
              tipoNombre: 'EMPRESA',
              uid: item.key
            }
            localStorage.setItem("usuarioActivo",JSON.stringify(usuario));
            this.updateTokenWeb(item.key,0,item);
          }
          });
        });
        this.authService.getUsuario_Persona().subscribe(data => {
          data.forEach(item =>{
          if(item.key === this.uid){
            this.nombreUsuario = item.data.nombre;
            //this.onSuccess('Login Correcto','Bienvenido '+item.data.nombre+' a TCompra PERSONA');
            //if(item.data.imagen != "default"){
              this.imagenUsuario = item.data.imagen;
            //}
            let usuario = {
              nombre: item.data.nombre,
              imagen: item.data.imagen,
              tipo: 1,
              tipoNombre: 'PERSONA',
              uid: item.key
            }
            localStorage.setItem("usuarioActivo",JSON.stringify(usuario));
            this.updateTokenWeb(item.key,1,item);
          }
          });
        });
    
  }
  updateTokenWeb(uid,tipo,item){
    this.getNotificaciones(tipo,uid);
    this.messagingService.requestPermission(uid,tipo,item);
    this.messagingService.receiveMessage();
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
      if(this.validarDoc.length < 11){
        alert("Su RUC tiene menos de 11 digitos");
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
        v1.unsubscribe();
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
      const v2 = this.authService.getUsuario_Persona().subscribe(data => {
        data.forEach(item =>{
          if(item.data.dni === this.validarDoc){
            alert("Este DNI ya se encuentra registrado!!");
            this.validar = true;
            return '';
          }
        });
        //alert(this.validar);
        v2.unsubscribe();
        if(this.validar === false){
          this.rPersona['dni'] = this.validarDoc;
          this.tipoRegistro = 'Persona';
          this.RegistrarModal.nativeElement.click();
          document.getElementById("modalPersona").click();
        }
      });
    }
  }

  validarCuentaEmpresa(){
    if(this.nombreEmpresa.nativeElement.value===""){
      alert("Ingrese el nombre de su empresa");
      return '';
    }
    if(this.razonSocialEmpresa.nativeElement.value===""){
      alert("Ingrese Razon Social");
      return '';
    }
    if(this.direccionEmpresa.nativeElement.value===""){
      alert("Ingrese su dirección");
      return '';
    }
    if(this.especialidadEmpresa.nativeElement.value===""){
      alert("Ingrese su especialidad");
      return '';
    }
    if(this.selectedDepaEmpresa === 0){
      alert("Por favor Seleccione un Departamento");
      return '';
    }
    if(this.selectedTipoEmpresa ===0){
      alert("Por favor Seleccione un Tipo");
      return'';
    }
    if(this.selectedRubro1==="-LjS65S0NtwAABX-VuOg" || this.selectedRubro2 ==="-LjS65S0NtwAABX-VuOg" || this.selectedRubro3==="-LjS65S0NtwAABX-VuOg"){
      alert("Por favor Seleccione los 3 rubros");
      return'';
    }
    if(this.selectedAntiguedad===0){
      alert("Por favor Seleccione su Antiguedad");
      return'';
    }
      this.rEmpresa['departamento'] = Number(this.selectedDepaEmpresa);
      this.rEmpresa['tipo_empresa'] = Number(this.selectedTipoEmpresa);
      this.rEmpresa['rubro1'] = this.selectedRubro1;
      this.rEmpresa['rubro2'] = this.selectedRubro2;
      this.rEmpresa['rubro3'] = this.selectedRubro3;
      this.rEmpresa['antiguedad'] = Number(this.selectedAntiguedad);
      this.rEmpresa['nombre'] = this.nombreEmpresa.nativeElement.value;
      this.rEmpresa['razonSocial'] = this.razonSocialEmpresa.nativeElement.value;
      this.rEmpresa['direccion'] = this.direccionEmpresa.nativeElement.value;
      this.rEmpresa['especialidad'] = this.especialidadEmpresa.nativeElement.value;
      this.rEmpresa['fec_creacion'] = this.datePipe.transform(this.myDate, 'dd-MM-yyyy').toString();
      this.rEmpresa['fec_modificacion'] = this.datePipe.transform(this.myDate, 'dd-MM-yyyy').toString();
      document.getElementById("empresahide").click();
      document.getElementById("validarCuenta").click();
      //this.clearInputEmpresa();
  }

  clearInputEmpresa(){
    this.selectedDepaEmpresa = 0;
    this.selectedTipoEmpresa = 0;
    this.selectedAntiguedad = 0;
    this.selectedRubro1 = "-LjS65S0NtwAABX-VuOg";
    this.selectedRubro2 = "-LjS65S0NtwAABX-VuOg";
    this.selectedRubro3 = "-LjS65S0NtwAABX-VuOg";
    this.nombreEmpresa.nativeElement.value = "";
    this.razonSocialEmpresa.nativeElement.value = "";
    this.direccionEmpresa.nativeElement.value = "";
    this.especialidadEmpresa.nativeElement.value = "";
    //this.validarDoc = "";
    this.registerEmail.nativeElement.value = "";
    this.registerPass.nativeElement.value = "";
    this.registerPass2.nativeElement.value = "";

  }
  validarCuentaPersona(){
    if(this.nombrePersona.nativeElement.value===""){
      alert("Ingrese su nombre");
      return ''
    }
    if(this.ape1Persona.nativeElement.value===""){
      alert("Ingrese su apellido paterno");
      return '';
    }
    if(this.ape2Persona.nativeElement.value===""){
      alert("Ingrese su apellido materno");
      return '';
    }
    if(this.direccionPersona.nativeElement.value===""){
      alert("Ingrese su direccion");
      return '';
    }
    if(this.selectedDepaPersona === 0){
      alert("Seleccione un departamento");
      return '';
    }
    if(this.telefonoPersona.nativeElement.value===""){
      alert("Ingrese su telefono");
      return '';
    }
    if(this.selectedRubro1P==="-LjS65S0NtwAABX-VuOg" || this.selectedRubro2P ==="-LjS65S0NtwAABX-VuOg" || this.selectedRubro3P==="-LjS65S0NtwAABX-VuOg"){
      alert("Por favor Seleccione los 3 rubros");
      return'';
    }
    this.rPersona['nombre'] = this.nombrePersona.nativeElement.value +" "+this.ape1Persona.nativeElement.value+" "+this.ape2Persona.nativeElement.value;
    this.rPersona['direccion'] = this.direccionPersona.nativeElement.value;
    this.rPersona['departamento'] = Number(this.selectedDepaPersona);
    this.rPersona['telefono'] = this.telefonoPersona.nativeElement.value;
    this.rPersona['rubro1'] = this.selectedRubro1P;
    this.rPersona['rubro2'] = this.selectedRubro2P;
    this.rPersona['rubro3'] = this.selectedRubro3P;
    this.rPersona['fec_creacion'] = this.datePipe.transform(this.myDate, 'dd-MM-yyyy').toString();
    this.rPersona['fec_modificacion'] = this.datePipe.transform(this.myDate, 'dd-MM-yyyy').toString();
    document.getElementById("personahide").click();
    document.getElementById("validarCuenta").click();
    //this.clearInputPersona()
  }
  clearInputPersona(){
    this.nombrePersona.nativeElement.value = "";
    this.ape1Persona.nativeElement.value = "";
    this.ape2Persona.nativeElement.value = "";
    this.direccionPersona.nativeElement.value = "";
    this.selectedDepaPersona = 0;
    this.telefonoPersona.nativeElement.value = "";
    this.selectedRubro1P = "-LjS65S0NtwAABX-VuOg";
    this.selectedRubro2P = "-LjS65S0NtwAABX-VuOg";
    this.selectedRubro3P = "-LjS65S0NtwAABX-VuOg";
    this.registerEmail.nativeElement.value = "";
    this.registerPass.nativeElement.value = "";
    this.registerPass2.nativeElement.value = "";
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
      if(this.aceptoTerminosRegistro === false){
        alert("Por favor acepte los terminos y condiciones");
        return'';
      }
      this.authService.registerUser(this.registerEmail.nativeElement.value,this.registerPass.nativeElement.value).then((res:any) =>{
          if(res.user.emailVerified==false){
            //this.rEmpresa['email'] = this.registerEmail.nativeElement.value;
            if(this.tipoRegistro==="Empresa"){
              this.onInfo('Registro Empresa','Gracias por registrarte en TCompra Empresa, Para poder Iniciar Sesión es necesario verificar tu correo')
              this.rEmpresa['email'] = this.registerEmail.nativeElement.value;
              this.addDB.addUsuario(this.rEmpresa,res.user.uid,this.tipoRegistro);
              //this.EmpresaModal.nativeElement.click();
              this.clearInputEmpresa();
              document.getElementById("validarhide").click();
              this.registerForm.reset();

            }
            if(this.tipoRegistro==="Persona"){
              this.onInfo('Registro Persona','Gracias por registrarte en TCompra Persona, Para poder Iniciar Sesión es necesario verificar tu correo')
              this.rPersona['email'] = this.registerEmail.nativeElement.value;
              this.addDB.addUsuario(this.rPersona,res.user.uid,this.tipoRegistro);
              //his.PersonaModal.nativeElement.click();
              this.clearInputPersona()
              document.getElementById("validarhide").click();
              this.registerForm.reset();

            }
            //this.EmpresaModal.nativeElement.click();
            //this.PersonaModal.nativeElement.click();
            //this.validarCuenta2.nativeElement.click();

            //this.EmpresaModal.nativeElement.click();
            //this.authService.logout();
            
          }
          this.authService.logout();
          //his.EmpresaModal.nativeElement.click();
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

  validarBox(values:any){
    this.aceptoTerminosRegistro = values.currentTarget.checked
    }
  recuperarPass(){
    this.authService.resetPassword(this.EmailRec.nativeElement.value);
    this.modalRecuperar.nativeElement.click();
    this.EmailRec.nativeElement.value = "";
  }
  onSuccess(title,msg){
    const pr = this.message.success(title,msg, {
      position: ['bottom','center'],
      timeOut: 4000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true
    });
    pr.click.subscribe(event => {
      console.log("HIZO CLICK A LA NOTIFICACION");
    })
  }
  onError(title, msg){
    this.message.error(title,msg, {
      position: ['bottom','center'],
      timeOut: 4000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true

    });
  }
  onInfo(title, msg){
    this.message.info(title,msg, {
      position: ['bottom','center'],
      timeOut: 4000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true

    });
  }
  getNotificaciones(tipo,uid){
    this.messagingService.getNotificaciones(tipo,uid).query.once('value').then(data => {
      this.misNotificaciones = [];
      this.contNotificaciones = 0;
      data.forEach(data2 => {
        this.getTipoUsuario(Number(data2.child('tipousuario').val()),data2.child('idusuario').val()).then(data3 =>{
          let dic = {
            key: data2.key,
            title: data2.child('title').val(),
            body: data2.child('body').val(),
            estado: data2.child('estado').val(),
            timestamp: this.getTimestamp(data2.child('hora').val()),
            id_requerimiento: data2.child('id_requerimiento').val(),
            click_action: data2.child('click_action').val(),
            imagen: data2.child('imagen').val(),
            nombreUsuario: data3.child('nombre').val(),
            tipoUsuario: data2.child('tipousuario').val()
          }
          this.misNotificaciones.push(dic);
        })
        if(data2.child('estado').val()==="NoVisto"){
          this.contNotificaciones = this.contNotificaciones + 1;
        }

      })
    }).catch(err =>{
      console.log(err);
    });

  }
  getTimestamp(rece){
    var data = rece.toString().replace(" del ","/");
    var d = data.split('/');
    var hora = d[0].split(':');
    var fecha = d[1].split('-');

    //var a = new Date(data * 1000);
    var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
    var year = fecha[2];
    var month = months[Number(fecha[1])-1];
    var date = fecha[0];
    var hour = hora[0];
    var min = hora[1];
    if(hour>=12){
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ' PM';
    }else{
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ' AM';
    }
    return time;
  }

  verNotificaciones(){
    if(localStorage.getItem("usuarioActivo") != null) {
      let user = JSON.parse(localStorage.getItem('usuarioActivo'));
      this.messagingService.getNotificaciones(user.tipo,user.uid).query.once('value').then(data => {
        data.forEach(data2 => {
          if(data2.child('estado').val()==="NoVisto"){
            data2.ref.update({
              estado: 'Visto'
            })
          }
        })
      })
    }
    
  }


  getTipoUsuario(tipo,id){
    if(tipo===0){
      return this.itemService.Empresa_once(id).query.once('value');
    }else if(tipo===1){
      return this.itemService.Persona_once(id).query.once('value');
    }
  }
  
}
