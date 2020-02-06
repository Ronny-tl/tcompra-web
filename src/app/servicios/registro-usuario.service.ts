import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {
  id:string;
  usuario: AngularFireList<any>;
  constructor(public af: AngularFireDatabase) { }


  addUsuario(data,uid,tipoRegistro){
    if(tipoRegistro==="Empresa"){
    //console.log(data);
    const ref = this.af.list('/Empresa/'+uid+'/').query.ref;
    ref.set(data);
    }else{
    //console.log(data);
    const ref = this.af.list('/Persona/'+uid+'/').query.ref;
    ref.set(data);
    }
  }
  
  enviarId(id){
    this.id = id;
  }

  getId(){
    return this.id;
  }
  updateUsuario(data,tipoUser,uid){
    if(tipoUser==="EMPRESA"){
      //console.log(data);
      this.af.list('/Empresa/'+uid+'/').query.ref.update(data);
      alert("Datos actualizados correctamente!!");
      }else{
      //console.log(data);
      this.af.list('/Persona/'+uid+'/').query.ref.update(data);
      alert("Datos actualizados correctamente!!");
      }
  }
  
  updateImageUsuario(url,tipo,uidUsuario){
      if(tipo==="EMPRESA"){
        this.af.list('/Empresa/'+uidUsuario).query.ref.update({imagen: url});
        alert("Imagen actualizado correctamente!!");
      }
      if(tipo==="PERSONA"){
        this.af.list('/Persona/'+uidUsuario).query.ref.update({imagen: url});
        alert("Imagen actualizado correctamente!!");
      }
  }
  
}
