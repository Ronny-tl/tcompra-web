import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ItemService } from '../../servicios/item.service';
import {RegistroUsuarioService} from '../../servicios/registro-usuario.service';
import {AngularFireStorage} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
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
              estado: x.data.estado
            }
            this.requerimiento_bien.push(datareq);
          // console.log(this.requerimiento_bien);
            //console.log(this.departamentos);
          }
          if(x.data.tipo===2){
            const datareq = {
              key: x.key,
              nombre: x.data.nombre,
              rubro: this.findRubros(x.data.rubro).data.nombre,
              departamento: this.findDepartamento(x.data.departamento).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado
            }
            this.requerimiento_liquidacion.push(datareq);
          }
          if(x.data.tipo===4){
            const datareq = {
              key: x.key,
              nombre: x.data.nombre,
              rubro: this.findRubros(x.data.rubro).data.nombre,
              departamento: this.findDepartamento(x.data.departamento).data.nombre,
              presupuesto: x.data.presupuesto,
              estado: x.data.estado
            }
            this.requerimiento_trabajo.push(datareq);
          }
      }
      })
    })
    //console.log(this.requerimiento_bien);
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

}
