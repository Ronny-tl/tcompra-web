import { Injectable } from '@angular/core';
import {NotificationsService} from 'angular2-notifications';
import { Subscription } from 'rxjs/Subscription';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subscription: Subscription;
  constructor(
    private alertService :NotificationsService
    
    
    ) { }

  onSuccess(title,msg){
    const pr = this.alertService.success(title,msg, {
      position: ['bottom','center'],
      timeOut: 5000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true
    });
    pr.click.subscribe(event => {
      console.log("HIZO CLICK A LA NOTIFICACION");
    })
  }
  onSuccess2(title,msg){
    const pr = this.alertService.success(title,msg, {
      position: ['bottom','center'],
      timeOut: 5000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true
    });

  }
  onError(title, msg){
    this.alertService.error(title,msg, {
      position: ['bottom','center'],
      timeOut: 5000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true

    });
  }
  onError2(title, msg){
    this.alertService.error(title,msg, {
      position: ['bottom','center'],
      timeOut: 5000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true

    });
  }
  onAlert(payload){
    this.alertService.alert(payload.data.title,payload.data.body, {
      position: ['bottom','center'],
      timeOut: 5000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true

    });
  }
  onInfo(payload){
    const info =this.alertService.info(payload.data.title,payload.data.body, {
      position: ['bottom','center'],
      timeOut: 5000,
      animate: 'fade',
      showProgressBar: true

    });

    info.click.subscribe(event => {
      window.open(payload.data.click_action);
      //console.log(event);
       
    });


  }

  deleteSubscription(){
    this.subscription.unsubscribe();
  }

  onWarn(payload){
    this.alertService.warn(payload.data.title,payload.data.body, {
      position: ['bottom','center'],
      timeOut: 5000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true

    });
  }
  onWarn2(title,body){
    this.alertService.warn(title,body, {
      position: ['bottom','center'],
      timeOut: 5000,
      animate: 'fade',
      showProgressBar: true,
      preventDuplicates: true

    });
  }
}
