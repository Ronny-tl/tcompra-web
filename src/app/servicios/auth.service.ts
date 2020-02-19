import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
//import { UserInterface } from '../models/user';
import { auth } from 'firebase/app';
import { error } from 'protractor';
import { cpus } from 'os';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  markersRef: AngularFireList<any>;
  user: Observable<firebase.User>;
  passChange:string;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) {
  
   }
   setPass(pass){
    this.passChange = pass;
   }
   getPass(){
     return this.passChange;
   }

   loginTwitter () {
    return this.afAuth.auth.signInWithPopup( new firebase.auth.TwitterAuthProvider());
  }

  loginFacebook() {
    return this.afAuth.auth.signInWithPopup( new firebase.auth.FacebookAuthProvider());
  }

  loginGoogle() {
    return this.afAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider());
  }

  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
      .then( userData =>  resolve(userData),
      err => reject (err));
    });
  }

  loginEmail(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
      .then( userData =>  resolve(userData),
      err => reject (err));
    });
  }

  getAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  resetPassword(email: string) {
   this.afAuth.auth.sendPasswordResetEmail(email).then(() => {
     alert("Hemos enviado un correo electrónico a "+email+" para restablecer su contraseña");
      })
   .catch((error) => {
     //console.log(error)
     if(error.message === "There is no user record corresponding to this identifier. The user may have been deleted."){
       alert("Este usuario no existe!!");
     }
     if(error.message === "The email address is badly formatted."){
       alert("Ingrese un correo electronico valido");
     }
    });

  }
  changePassword(pass,newPass){
    const user = this.afAuth.auth.currentUser;
    //console.log(user.email);
    //console.log(pass);
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, pass);
    user.reauthenticateWithCredential(credentials)
    .then(() => {
      //console.log('reauth ok')
      user.updatePassword(newPass).then(succ => {
        //console.log(succ);
        alert("Contraseña actualizado correctamente!!");
      }).catch((error)=>{
        //console.log(error);
        if(error.message==="Password should be at least 6 characters"){
          alert("La contraseña debe tener al menos 6 caracteres.");
        }
      });
    })
    .catch((error) => {
      //console.log(error);
      if(error.message==="The password is invalid or the user does not have a password."){
        alert("La contraseña actual es incorrecta!!");
      }
    });

  }

  getUsuario_Empresa() {
    this.markersRef = this.db.list('Empresa');
    return this.editMarkers(this.markersRef);
  }

  getUsuario_Persona() {
    this.markersRef = this.db.list('Persona');
    return this.editMarkers(this.markersRef);
  }

  editMarkers(marker: AngularFireList<any>) {
    return marker.snapshotChanges().pipe(map(items => {
      return items.map(a => {
        const data = a.payload.val();
        const key = a.payload.key;
        return { key, data };
      });
    }));
  }
}
