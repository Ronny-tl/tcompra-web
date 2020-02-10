import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { FormGroup, FormControl, FormArray, FormsModule } from '@angular/forms';
import { ItemService } from '../../servicios/item.service';
import {RegistroUsuarioService} from '../../servicios/registro-usuario.service';
import {AngularFireStorage} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import {crearRequerimiento } from '../../models/crearRequerimiento';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  //myInput= "asdasd";
  req = new crearRequerimiento();
  nombreCompleto:string;
  uidUsuario: string;
  logoUsuario:boolean=false;
  tipoUsuario:string;
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
  constructor(
    private authService: AuthService,
    private item: ItemService,
    private registroUsuario: RegistroUsuarioService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.getDepartamento();
    this.getRubros();
    this.getUsuario();
    this.get_mis_requerimientos();
    this.get_mis_ofertas();
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
            estado: x.data.estado
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
            estado: x.data.estado
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
              estado: x.data.estado
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
              estado: x.data.estado
            }
            this.oferta_requerimiento_servicio.push(dataOferta);
          }
        }
      })
    })
    console.log(this.oferta_requerimiento_bien);
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
            estado: x.data.estado
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
            estado: x.data.estado
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
    this.req.nombre = "Ronny Ticona Laura";
  }
  test(){
    alert(this.req['nombre']);
  }
  valueChange(event){
    console.log(event);
  }
}
