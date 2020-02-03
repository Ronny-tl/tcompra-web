import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import {RegistroUsuarioService} from '../../servicios/registro-usuario.service';
import {ItemService} from '../../servicios/item.service';
import { AuthService } from '../../servicios/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {AngularFireList } from 'angularfire2/database';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NgForm } from '@angular/forms';
//import { ofertaRequerimiento } from '../../models/ofertaRequerimientos'
import {AngularFireStorage} from '@angular/fire/storage'

@Component({
  selector: 'app-detalle-prod',
  templateUrl: './detalle-prod.component.html',
  styleUrls: ['./detalle-prod.component.css']
})
export class DetalleProdComponent implements OnInit {
  @ViewChild('nombreUsuario', { static: false }) nombreUsuario: ElementRef;
  @ViewChild('emailUsuario', { static: false }) emailUsuario: ElementRef;
  @ViewChild('garantiaAnio', { static: false }) garantiaAnio: ElementRef;
  @ViewChild('soporteMeses', { static: false }) soporteMeses: ElementRef;
  @ViewChild('presupuestoUsuario', { static: false }) presupuestoUsuario: ElementRef;
  aceptoNegociacion:boolean = false;
  incluyeIGV:boolean=false;
  incluyeEnvio:boolean=false;
  idProducto:string;
  tipoProducto:string;
  producto= undefined;
  rubro= undefined;
  departamento= undefined;
  usuario= undefined;
  tipo= undefined;
  imagenes= [];
  mostrarIMG:boolean;
  entrega=[];
  all_departamento = [];
  all_moneda = [];
  selectedDepartamento: number = 0;
  selectedEntrega: string = '-LjS6ygVTMvasGPrdtqp';
  selectedMoneda: string = '-LjS7G05dji2dWV2Gft1';
  loginService: Subscription;
  isLogin: boolean;
  usuarioAutenticado:string;
  uidUsuario:string;
  imagenUsuario:string ="assets/images/avatar.jpg";
  urlLogout:string;
  imagenesCargadas:any;
  constructor(
    private register: RegistroUsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private items: ItemService,
    private http: HttpClient,
    private storage: AngularFireStorage,
    public authService: AuthService
  ) { }
  ngOnInit() {
    //alert(post.id);
    //if(this.register.getId()===undefined){
      //this.router.navigate(['/']);
    //}
    //alert('DETALLE PRODUCTO: '+this.register.getId());
    this.verificarAutenticacion();
    this.idProducto = this.route.snapshot.paramMap.get('id');
    this.tipoProducto = this.route.snapshot.paramMap.get('tipo');
    //this.urlLogout ="detalle-prod/"+this.tipoProducto+"/"+this.idProducto;

    if(this.idProducto===null || this.tipoProducto===null){
      this.router.navigate(['/']);
    }
    if(this.tipoProducto==="1" || this.tipoProducto==="2"){
      this.mostrarRequerimientos();
    }
    if(this.tipoProducto==="3"){
      this.mostrarLiquidacion();
    }
    if(this.tipoProducto==="4"){
      this.mostrarPuestoTrabajo();
    }

    this.getEntrega();
    this.allDepartamento();
    this.allMoneda();
}
iniciarUsuario(){
  this.authService.getUsuario_Empresa().subscribe(data => {
    data.forEach(item =>{
    if(item.key == this.uidUsuario){
      this.usuarioAutenticado = item.data.nombre;
      if(item.data.imagen != "default"){
        this.imagenUsuario = item.data.imagen;
      }
    }
    });
  });
  this.authService.getUsuario_Persona().subscribe(data => {
    data.forEach(item =>{
    if(item.key == this.uidUsuario){
      this.usuarioAutenticado = item.data;
      if(item.data.imagen != "default"){
        this.imagenUsuario = item.data.imagen;
      }
    }
    });
  });

}
verificarAutenticacion(){
  this.loginService = this.authService.getAuth().subscribe(auth =>{
    if(auth){
      this.isLogin= true;
      this.uidUsuario = auth.uid;
      this.iniciarUsuario();
    }else{
      this.isLogin=false;
    }
  })
}
mostrarRequerimientos(){
  this.items.listarRequerimientos2(this.idProducto).subscribe(data =>{
    this.producto = data.payload.val();
    if(this.producto.imagenes){
      this.mostrarIMG = true;
      data.payload.child("imagenes").forEach(data2 => {
        this.imagenes.push(data2.val());
      });
    }else{
      this.mostrarIMG = false;
    }
    this.getRubro(this.producto.rubro);
    this.getDepartamento(this.producto.departamento);
    this.getUsuario(this.producto.tipoUsuario, this.producto.usuario);
    this.getTipo(this.producto.tipo);
  });
}
mostrarLiquidacion(){
  this.items.listarLiquidacion2(this.idProducto).subscribe(data =>{
    this.producto = data.payload.val();
    if(this.producto.imagenes){
      this.mostrarIMG = true;
      data.payload.child("imagenes").forEach(data2 => {
        this.imagenes.push(data2.val());
      });
    }else{
      this.mostrarIMG = false;
    }
    this.getRubro(this.producto.rubro);
    this.getDepartamento(this.producto.departamento);
    this.getUsuario(this.producto.tipoUsuario, this.producto.usuario);
    this.getTipo(this.producto.tipo);
  });
}

mostrarPuestoTrabajo(){
  this.items.listarPuestoTrabajo2(this.idProducto).subscribe(data =>{
    this.producto = data.payload.val();
    if(this.producto.imagenes){
      this.mostrarIMG = true;
      data.payload.child("imagenes").forEach(data2 => {
        this.imagenes.push(data2.val());
      });
    }else{
      this.mostrarIMG = false;
    }
    this.getRubro(this.producto.rubro);
    this.getDepartamento(this.producto.departamento);
    this.getUsuario(this.producto.tipoUsuario, this.producto.usuario);
    this.getTipo(this.producto.tipo);
  });
}

  getRubro(id){
    this.items.getRubro(id).subscribe(data =>{
      this.rubro = data.payload.val();
      //console.log(this.rubro);
    })
  }
  getDepartamento(id){
    this.items.getDepartamento2(id).subscribe(data =>{
      this.departamento = data.payload.val();
    })
  }
  getUsuario(tipo,uid){
    if(tipo===0){
      this.items.getUsuarioEmpresa(uid).subscribe(data =>{
        this.usuario = data.payload.val();
      })
    }
    if(tipo===1){
      this.items.getUsuarioPersona(uid).subscribe(data =>{
        this.usuario = data.payload.val();
      })
    }
  }
  getTipo(id){
    this.items.getTipo(id).subscribe(data =>{
      this.tipo = data.payload.val();
    })

  }
  descargarArchivo(){
    if(this.producto.documento=="default"){
      alert("Este Producto no tiene ningun archivo")
      return '';
    }
    //window.location.href=this.producto.documento;
    alert(this.producto.documento);
   //saveAs(this.producto.documento,"test.pdf");
    //this.http.get(this.producto.documento,{responseType:'arraybuffer'}).subscribe(pdf =>{
      //const blob = new Blob([pdf],{type: 'application/pdf'});
      //saveAs(blob,"archivo.pdf");
    //});
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(this.producto.documento);



    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  getEntrega(){
    this.items.getEntrega().subscribe(data => {
      data.forEach(x =>{
        this.entrega.push({
          key: x.key,
          value: x.data
        });
      });     
    });
  }
  allDepartamento(){
    this.items.getDepartamento().subscribe(data => {
      data.forEach(x =>{
        this.all_departamento.push({
          key: x.key,
          value: x.data
        });
      });     
    });
  }

  allMoneda(){
    this.items.getMoneda().subscribe(data => {
      data.forEach(x =>{
        this.all_moneda.push({
          key: x.key,
          value: x.data
        });
      });     
    });
  }

  ofertar(id){
    if(this.isLogin)
    //alert(id+' - '+ this.selectedDepartamento);
        if(id==="1"){
          //alert(this.nombreUsuario.nativeElement.value);
          //if(this.nombreUsuario.nativeElement.value===""){alert("Ingrese el nombre de la oferta"); return '';}
          //if(this.emailUsuario.nativeElement.value===""){alert("Ingrese correo"); return'';}
          //if(this.garantiaAnio.nativeElement.value===""){alert("Ingrese garantia en años"); return '';}
          //if(this.soporteMeses.nativeElement.value===""){alert("Ingrese Soporte en meses"); return '';}
          //if(this.presupuestoUsuario.nativeElement.value===""){alert("Ingrese un presupuesto"); return '';}
          //if(this.selectedDepartamento===0){alert("Seleccione un departamento"); return '';}
          //if(this.selectedMoneda==='-LjS7G05dji2dWV2Gft1'){alert("Seleccione un tipo de moneda"); return '';}
          //if(this.selectedEntrega==='-LjS6ygVTMvasGPrdtqp'){alert("Seleccione un tiempo de entrega"); return '';}
          this.subirImage();
          for(let x of this.imagenesCargadas){
            console.log(x);
          }
        }
        if(id==="2"){
          alert(id+' - '+ this.selectedDepartamento)
        }
    else{
      alert("Necesitas estar logueado para ofertar");
    }

  }
 validarBox(values:any,id:number){
  console.log(values.currentTarget.checked);
  if(id===1){ this.aceptoNegociacion = values.currentTarget.checked;}
  if(id===2){ this.incluyeIGV = values.currentTarget.checked;}
  if(id===3){ this.incluyeEnvio = values.currentTarget.checked;}
  }
  cargarImage(data){
    //console.log(data.path[0].files);
    if(data.path[0].files.length>5){
      alert("Cantidad de imagenes permitidas son 5");
      return '';
    }
    this.imagenesCargadas = data.target.files;
    //for(let x of data.path[0].files){
     // console.log(x.name);
    //}
  }
  subirImage(){

  }

  SalirSesion(){
    this.authService.logout();
  }
}
