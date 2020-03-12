import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import  * as firebase from 'firebase/app';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { createAotUrlResolver } from '@angular/compiler';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import '@firebase/messaging';
import {AlertService} from '../servicios/alert.service'
import { Subscription } from 'rxjs/Subscription';
import { TooltipConfig } from 'ngx-bootstrap/tooltip/public_api';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  markersRef: AngularFireList<any>;
  public messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);
  private subscription: Subscription;

  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private http: HttpClient,
    private db: AngularFireDatabase,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
   }

   
   updateToken(userId, token, tipo) {
        const data = { tokenWeb: token };
        if(tipo===0){
          this.db.object('Empresa/' + userId + '/').update(data);
        }
        if(tipo===1){
          this.db.object('Persona/'+userId+'/').update(data);
        }
 
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId,tipo, item) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        //console.log(token);
        //if(token != item.data.tokenWeb){
          console.log("ENTRO Subscribe Topic")
          this.updateToken(userId,token,tipo);
          this.subscribeTokenToTopic(token,item.data.rubro1);
          this.subscribeTokenToTopic(token,item.data.rubro2);
          this.subscribeTokenToTopic(token,item.data.rubro3);
        //}
      },
      (err) => {
        //console.error('Unable to get permission to notify.', err);
        this.alertService.onWarn2('TCompra','Para un mejor funcionamiento active las notificaciones!!');
      }
    );
      //console.log(firebase.auth().currentUser.getIdToken());
  }

  receiveMessage() {
    //this.messaging.onMessage((payload) => {
      //console.log('ingrese');
      //this.currentMessage.next(payload);
      //this.alertService.onInfo(payload);
      //console.log(payload);
    //}); 

    //if(localStorage.getItem('notificacion')==='0'){
      this.subscription =  this.angularFireMessaging.messages.subscribe(
        (payload) => {
          //console.log("new message received. ", payload);
          this.alertService.onInfo(payload);
          this.currentMessage.next(payload);
          console.log(this.currentMessage);
          
      });
      //localStorage.setItem('notificacion','1');
    //}

    
  }
  
  ngOnDestroy(){
    try{ 
      this.subscription.unsubscribe();
    }catch(err){
      console.log("ERROR UNSUBSCRIBE");
    }

  }
    
  
  sendPushMessage(payload){
    let data = {
        "notification": {
            "title": "title",
            "body": "message",
            "click_action": "http://localhost:3000/",
            "icon": "https://www.soy502.com/sites/default/files/styles/full_node/public/2020/Ene/28/mia_khalifa_luce_mas_sexy_que_nunca_en_sus_posteos_en_instagram_foto_soy502_guatemala.png",
            "sound" : "default"
        },
        "to": "fiDuyZnBkCST-pYJVgf1jj:APA91bGSBLCrRokidlbU9-Dh6NZ5KdxU96bkaBOqooKq5LsB8rpmZ_CPnOiane9qT8Y41z4Ymlog3sdBjvyLXmLqdtK_edRLBvza9Yer_bb6nJCj7anLqlNpI87izU3NQRmm_XhxbO6B"
    }

    let postData = JSON.stringify(payload);    
    let url ="https://fcm.googleapis.com/fcm/send";
    this.http.post(url,  postData, {
      headers: new HttpHeaders()
      // put the server key here
          .set('Authorization', 'key=AAAA942C7-o:APA91bESjDSzDMUagst6NMu12duQHnenmdnU6XsDuTi3BNuIJUEZDnzBNkaYcjQUOgmq16wz2cbSVWU9jh31-HtGlurCgP3VTPBSJNN0wzyiFDHWw6ZTuV-yvK851yMKkP-HKmYlAnPs')
          .set('Content-Type', 'application/json'),
     })
     .subscribe((response: Response) => {
        console.log(response)
        
      },
      (error: Response) => {
        console.log(error);
        console.log("error" + error);
      });
  }

  subscribeTokenToTopic(token, topic) {
    fetch('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'key=AAAA942C7-o:APA91bESjDSzDMUagst6NMu12duQHnenmdnU6XsDuTi3BNuIJUEZDnzBNkaYcjQUOgmq16wz2cbSVWU9jh31-HtGlurCgP3VTPBSJNN0wzyiFDHWw6ZTuV-yvK851yMKkP-HKmYlAnPs'
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        //throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
      }
      //console.log('Subscribed to "'+topic+'"');
    }).catch(error => {
      //console.error(error);
    })
  }
  unSubscribeTokenToTopic(token, topic) {
    fetch('https://iid.googleapis.com/iid/v1:batchRemove/'+token+'/rel/topics/'+topic, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'key=AAAA942C7-o:APA91bESjDSzDMUagst6NMu12duQHnenmdnU6XsDuTi3BNuIJUEZDnzBNkaYcjQUOgmq16wz2cbSVWU9jh31-HtGlurCgP3VTPBSJNN0wzyiFDHWw6ZTuV-yvK851yMKkP-HKmYlAnPs'
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
      }
      console.log('Subscribed to "'+topic+'"');
    }).catch(error => {
      console.error(error);
    })
  }

  guardarNotificacion(tipoUsuario,idUsuario,title,body,imagen,notificacion,tipo,id_requerimiento,click_action){
    var d = new Date();
    let data = {
      tipousuario: tipoUsuario.toString(),
      idusuario: idUsuario,
      title: title,
      body: body,
      imagen: imagen,
      notificacion: notificacion,
      tipo: tipo.toString(),
      timestamp: d.getTime().toString(),
      click_action: click_action,
      estado: 'NoVisto',
      hora: d.getHours()+":"+d.getMinutes()+" del "+this.datePipe.transform(d,'dd-MM-yyyy').toString(),
      id_requerimiento: id_requerimiento
    }
    if(tipoUsuario===0){
      let key = this.angularFireDB.list('Empresa/'+idUsuario+'/Notificacion/').query.ref.push(data);
      this.angularFireDB.list('Empresa/'+idUsuario+'/Notificacion/'+key.key).query.ref.update({
        idNotificacion: key.key
      })
    }
    if(tipoUsuario===1){
      let key = this.angularFireDB.list('Persona/'+idUsuario+'/Notificacion/').query.ref.push(data);
      this.angularFireDB.list('Persona/'+idUsuario+'/Notificacion/'+key.key).query.ref.update({
        idNotificacion: key.key
      })
    }

  }

  getNotificaciones(tipo, id){
    //console.log(tipo+" -- "+id);
    if(tipo===0){
      this.markersRef = this.db.list('Empresa/'+id+'/Notificacion/');
      return this.markersRef;
    }if(tipo===1){
      this.markersRef = this.db.list('Persona/'+id+'/Notificacion/');
      return this.markersRef;
    }
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
