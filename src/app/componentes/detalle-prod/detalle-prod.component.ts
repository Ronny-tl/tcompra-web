import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import {RegistroUsuarioService} from '../../servicios/registro-usuario.service';
import {ItemService} from '../../servicios/item.service';
import { AuthService } from '../../servicios/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {AngularFireList } from 'angularfire2/database';
import { saveAs } from 'file-saver';
import { Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ofertaRequerimiento } from '../../models/ofertaRequerimientos'
import {AngularFireStorage} from '@angular/fire/storage'
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import {RegistroOfertasService} from '../../servicios/registro-ofertas.service';
import { ofertaLiquidacion } from 'src/app/models/ofertaLiquidacion';
import { ofertaTrabajo } from 'src/app/models/ofertaTrabajo';
import { Observer } from 'rxjs/observer';
declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-detalle-prod',
  templateUrl: './detalle-prod.component.html',
  styleUrls: ['./detalle-prod.component.css']
})
export class DetalleProdComponent implements OnInit {
  idMiOferta:string;
  isOfertaste:boolean = false;
  myDate = new Date();
  @ViewChild('nombreUsuario', { static: false }) nombreUsuario: ElementRef;
  @ViewChild('emailUsuario', { static: false }) emailUsuario: ElementRef;
  @ViewChild('garantiaAnio', { static: false }) garantiaAnio: ElementRef;
  @ViewChild('soporteMeses', { static: false }) soporteMeses: ElementRef;
  @ViewChild('presupuestoUsuario', { static: false }) presupuestoUsuario: ElementRef;
  aceptoNegociacion:number = 0;
  incluyeIGV:number=0;
  incluyeEnvio:number=0;
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
  isLogin: boolean = false;
  usuarioAutenticado:string;
  uidUsuario:string;
  imagenUsuario:string ="assets/images/avatar.jpg";
  urlLogout:string;
  imagenesCargadas:any;
  fileCargado:any;
  urlImage: Observable<string>;
  tipoUsuario:number;
  cantImagenes:number = 0;
  cantFile:number = 0;

  /////////////////// 12/02/2020
  formaPagoArray = [];
  formaPago:any;
  tipoMoneda:any;
  tiempoEntrega:any;
  //////////////////27/02/2020
  @ViewChild('caliClienteBien2', { static: false }) caliClienteBien2: ElementRef;
  @ViewChild('caliClienteMal2', { static: false }) caliClienteMal2: ElementRef;

  constructor(
    private register: RegistroUsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private items: ItemService,
    private http: HttpClient,
    private storage: AngularFireStorage,
    public authService: AuthService,
    private datePipe: DatePipe,
    private registroOferta: RegistroOfertasService
  ) { }
  ngOnInit() {
    //alert(post.id);
    //if(this.register.getId()===undefined){
      //this.router.navigate(['/']);
    //}
    //alert('DETALLE PRODUCTO: '+this.register.getId());
    //this.estadoProducto();
    this.getEntrega();
    this.allDepartamento();
    this.allMoneda();
    this.getFormapago();
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

}
iniciarUsuario(){
  this.authService.getUsuario_Empresa().subscribe(data => {
    data.forEach(item =>{
    if(item.key == this.uidUsuario){
      this.usuarioAutenticado = item.data.nombre;
      this.tipoUsuario =0;
      if(item.data.imagen != "default"){
        this.imagenUsuario = item.data.imagen;
      }
    }
    });
  });
  this.authService.getUsuario_Persona().subscribe(data => {
    data.forEach(item =>{
    if(item.key == this.uidUsuario){
      this.usuarioAutenticado = item.data.nombre;
      this.tipoUsuario =1;
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
      this.verificarOferta();
    }else{
      this.isLogin=false;
    }
  })
}
verificarOferta(){
  this.isOfertaste=false;
  if(this.tipoProducto==="1" || this.tipoProducto=="2"){
    this.items.getOferta_Requerimiento().subscribe(data => {
      data.forEach(x=>{
        if(x.data.usuario===this.uidUsuario && x.data.id_requerimiento===this.idProducto){
          this.isOfertaste = true;
          this.idMiOferta = x.key;
        }
      });
    });
  }
  if(this.tipoProducto==="3"){
    this.items.getOferta_Liquidacion().subscribe(data => {
      data.forEach(x=>{
        if(x.data.usuario===this.uidUsuario && x.data.id_requerimiento===this.idProducto){
          this.isOfertaste = true;
          this.idMiOferta = x.key;
        }
      });
    });
  }
  if(this.tipoProducto==="4"){
    this.items.getOferta_Puesto_Trabajo().subscribe(data => {
      data.forEach(x=>{
        if(x.data.usuario===this.uidUsuario && x.data.id_requerimiento===this.idProducto){
          this.isOfertaste = true;
          this.idMiOferta = x.key;
        }
      });
    });
  }
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
    this.getMoneda(this.producto.moneda);
    this.getFormaPago2(this.producto.formapago);
    this.getEntrega2(this.producto.entrega);

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
    this.getMoneda(this.producto.moneda);
    this.getFormaPago2(this.producto.formapago);
    this.getEntrega2(this.producto.entrega);

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
    this.getMoneda(this.producto.moneda);
    this.getFormaPago2(this.producto.formapago);
    this.getEntrega2(this.producto.entrega);

  });
}

  getRubro(id){
    this.items.getRubro(id).subscribe(data =>{
      this.rubro = data.payload.val();
      //console.log(this.rubro);
    })
  }
  getMoneda(id){
    this.items.getMonedaID(id).subscribe(data =>{
      this.tipoMoneda = data.payload.val();
      //console.log(this.rubro);
    })
  }
  getFormaPago2(id){
    this.items.getFormaPagoID(id).subscribe(data =>{
      this.formaPago = data.payload.val();
      //console.log(this.rubro);
    })
  }
  getEntrega2(id){
    this.items.getEntregaID(id).subscribe(data =>{
      this.tiempoEntrega = data.payload.val();
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
        this.caliClienteBien();
        this.caliClienteMal();
      })
    }
    if(tipo===1){
      this.items.getUsuarioPersona(uid).subscribe(data =>{
        this.usuario = data.payload.val();
        this.caliClienteBien();
        this.caliClienteMal();
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
      this.entrega = [];
      data.forEach(x =>{
        this.entrega.push({
          key: x.key,
          value: x.data
        });
      });     
    });
  }
  getFormapago(){
    this.items.getFormaPago().subscribe(data => {
      data.forEach(x =>{
        this.formaPagoArray.push({
          key: x.key,
          value: x.data
        });
      });     
    });
  }
  allDepartamento(){
    this.items.getDepartamento().subscribe(data => {
      this.all_departamento = data;
      //console.log(data);
      //this.buscarForm.controls.departamento.setValue(this.departamentos[0].data.nombre);      
    });
  }

  allMoneda(){
    this.items.getMoneda().subscribe(data => {
      this.all_moneda =[];
      data.forEach(x =>{
        this.all_moneda.push({
          key: x.key,
          value: x.data
        });
      });     
    });
  }

  ofertar(id){
    if(this.isLogin){
    //alert(id+' - '+ this.selectedDepartamento);
        if(this.nombreUsuario.nativeElement.value===""){alert("Ingrese el nombre de la oferta"); return '';}
        if(this.emailUsuario.nativeElement.value===""){alert("Ingrese correo"); return'';}
        if(this.presupuestoUsuario.nativeElement.value===""){alert("Ingrese un presupuesto"); return '';}
        if(this.selectedDepartamento===0){alert("Seleccione un departamento"); return '';}
        if(this.selectedMoneda==='-LjS7G05dji2dWV2Gft1'){alert("Seleccione un tipo de moneda"); return '';}

        if(id==="1" || id==="2"){
          //if(this.garantiaAnio.nativeElement.value===""){alert("Ingrese garantia en años"); return '';}
          //if(this.soporteMeses.nativeElement.value===""){alert("Ingrese Soporte en meses"); return '';}
          if(this.selectedEntrega==='-LjS6ygVTMvasGPrdtqp'){alert("Seleccione un tiempo de entrega"); return '';}
          //this.subirImage();
          const dataOferta = new ofertaRequerimiento(
            this.emailUsuario.nativeElement.value,
            this.selectedEntrega,
            this.incluyeEnvio,
            this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString(),
            Number(this.garantiaAnio.nativeElement.value),
            this.idProducto,
            this.incluyeIGV,
            this.selectedMoneda,
            this.aceptoNegociacion,
            this.nombreUsuario.nativeElement.value,
            this.usuarioAutenticado,
            Number(this.presupuestoUsuario.nativeElement.value),
            Number(this.soporteMeses.nativeElement.value),
            Number(this.tipoProducto),
            this.tipoUsuario,
            Number(this.selectedDepartamento),
            this.uidUsuario
            );
            var key = this.registroOferta.addOferta(dataOferta,this.tipoProducto,this.idProducto);
            this.subirImage(key);
            this.subirFile(key);
            this.verificarOferta();
            alert("Su oferta ha sido registrado satisfactoriamente");
        }
        if(id==="3"){
          if(this.selectedEntrega==='-LjS6ygVTMvasGPrdtqp'){alert("Seleccione un tiempo de entrega"); return '';}
          const dataOfertaLiqui = new ofertaLiquidacion(
            this.emailUsuario.nativeElement.value,
            this.selectedEntrega,
            this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString(),
            this.idProducto,
            this.selectedMoneda,
            this.nombreUsuario.nativeElement.value,
            this.usuarioAutenticado,
            Number(this.presupuestoUsuario.nativeElement.value),
            Number(this.tipoProducto),
            this.tipoUsuario,
            Number(this.selectedDepartamento),
            this.uidUsuario
          );
            var key = this.registroOferta.addOferta(dataOfertaLiqui,this.tipoProducto,this.idProducto);
            this.verificarOferta();
            alert("Su oferta ha sido registrado satisfactoriamente");
        }
        if(id==="4"){
          if(this.selectedEntrega==='-LjS6ygVTMvasGPrdtqp'){alert("Seleccione la Disponibilidad"); return '';}
          const dataOfertaTrabajo = new ofertaTrabajo(
            this.emailUsuario.nativeElement.value,
            this.selectedEntrega,
            this.datePipe.transform(this.myDate,'dd-MM-yyyy').toString(),
            this.idProducto,
            this.selectedMoneda,
            this.aceptoNegociacion,
            this.nombreUsuario.nativeElement.value,
            this.usuarioAutenticado,
            Number(this.presupuestoUsuario.nativeElement.value),
            Number(this.tipoProducto),
            this.tipoUsuario,
            Number(this.selectedDepartamento),
            this.uidUsuario
          );
            var key = this.registroOferta.addOferta(dataOfertaTrabajo,this.tipoProducto,this.idProducto);
            this.subirImage(key);
            this.subirFile(key);
            this.verificarOferta();
            alert("Se ha postulado satisfactoriamente");
        }
      }
    else{
      alert("Necesitas estar logueado para ofertar");
    }

  }


 validarBox(values:any,id:number){
  //console.log(values.currentTarget.checked);
  if(id===1){
     if(values.currentTarget.checked){
      this.aceptoNegociacion = 1;
     }else{
      this.aceptoNegociacion = 0;
     }
  }
  if(id===2){
     if(values.currentTarget.checked){
      this.incluyeIGV=1;
     }else{
      this.incluyeIGV=0;
     }
    }
  if(id===3){
     if(values.currentTarget.checked){
      this.incluyeEnvio = 1;
     }else{
      this.incluyeEnvio = 0;
     }
    }
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

  subirImage(id){
    if(this.cantImagenes>0){
      let cont = 0;
      for(let x of this.imagenesCargadas){
        //console.log(x);
        if(this.tipoProducto==="1" || this.tipoProducto==="2"){
          const ref = this.storage.ref('Oferta_Requerimiento/Imagenes/'+cont+'-'+id);
          const task = this.storage.upload('Oferta_Requerimiento/Imagenes/'+cont+'-'+id,x);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroOferta.updateImagen(downloadURL,1,id);
                      });
                })
            ).subscribe();
        }
        if(this.tipoProducto==="3"){
          const ref = this.storage.ref('Oferta_Liquidacion/Imagenes/'+cont+'-'+id);
          const task = this.storage.upload('Oferta_Liquidacion/Imagenes/'+cont+'-'+id,x);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroOferta.updateImagen(downloadURL,3,id);
                      });
                })
            ).subscribe();
        }
        if(this.tipoProducto==="4"){
          const ref = this.storage.ref('Oferta_Trabajo/Imagenes/'+cont+'-'+id);
          const task = this.storage.upload('Oferta_Trabajo/Imagenes/'+cont+'-'+id,x);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroOferta.updateImagen(downloadURL,4,id);
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

  subirFile(id){
    if(this.cantFile>0){
        if(this.tipoProducto==="1" || this.tipoProducto==="2"){
          //alert("entro");
          const ref = this.storage.ref('Oferta_Requerimiento/Documentos/'+id);
          const task = this.storage.upload('Oferta_Requerimiento/Documentos/'+id,this.fileCargado);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroOferta.updateFile(downloadURL,1,id);
                      });
                })
            ).subscribe();
        }
        if(this.tipoProducto==="3"){
          const ref = this.storage.ref('Oferta_Liquidacion/Documentos/'+id);
          const task = this.storage.upload('Oferta_Liquidacion/Documentos/'+id,this.fileCargado);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroOferta.updateFile(downloadURL,3,id);
                      });
                })
            ).subscribe();
        }
        if(this.tipoProducto==="4"){
          const ref = this.storage.ref('Oferta_Trabajo/Documentos/'+id);
          const task = this.storage.upload('Oferta_Trabajo/Documentos/'+id,this.fileCargado);
          task.snapshotChanges().pipe(finalize(() => {
                      ref.getDownloadURL().subscribe(downloadURL => {
                          this.registroOferta.updateFile(downloadURL,4,id);
                      });
                })
            ).subscribe();
        }

    }else{
      //console.log("sin archivos");
  }
  }

  eliminarOferta(){
    this.registroOferta.eliminarOferta(this.idMiOferta,this.tipoProducto,this.idProducto);
    this.isOfertaste = false;
  }

  SalirSesion(){
    this.authService.logout();
  }

  caliClienteBien(){
    //console.log(this.usuario);
    this.caliClienteBien2['readonly']= false;
    this.caliClienteBien2['value'] = this.usuario.calificacionClienteBien;
    this.caliClienteBien2['readonly']= true;
  }

  caliClienteMal(){
    this.caliClienteMal2['readonly']= false;
    this.caliClienteMal2['value'] = this.usuario.calificacionClienteMal;
    this.caliClienteMal2['readonly']= true;
  }
  getBase64ImageFromURL() {
    let url ="https://firebasestorage.googleapis.com/v0/b/tcompra-c2bc0.appspot.com/o/Requerimiento%2FDocumentos%2F-M17qTWjq7ad2TVcUlu-?alt=media&token=338d300b-87fb-40f4-ba91-0327dd351bea";

    const pdfName = 'your_pdf_file';
    FileSaver.saveAs(url, pdfName);
 }

 descargarImagen(pro){
  if(pro.imagenprincipal==="default"){
    alert("Este requerimiento no contiene una imagen");
    return '';
  }
  window.open(pro.imagenprincipal,'TCompraDocument.pdf', 'width=720,height=750,toolbar=0,location=0, directories=0, status=0,location=no,menubar=0,resize=no');
 }

 descargarDocumento(pro){
  if(pro.documento==="default"){
    alert("Este requerimiento no cuenta con un documento")
    return '';
  }
  window.open(pro.documento,'TCompraDocument.pdf', 'width=7200,height=750,toolbar=0,scrollbars=no,location=0, directories=0, status=0,location=no,menubar=0,resize=no');
 }

   

}
