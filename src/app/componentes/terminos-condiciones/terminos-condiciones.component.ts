import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { StarRatingComponent } from 'ng-starrating';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MessagingService} from '../../servicios/messaging.service';
@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent implements OnInit {
  url: string = 'https://us-central1-tcompra-c2bc0.cloudfunctions.net/notificacion22';
  prueba: number= 1;
  closeResult: string;
  modalReference: NgbModalRef;
  message;
  constructor(private modalService: NgbModal,
    private http: HttpClient,
    private msg: MessagingService
    ) { }

  ngOnInit() {
  }
  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  prueba2(){
    this.modalReference.close();
  }
  onRate(event){
    console.log(event);
    console.log(event.newValue);
  }
  changevalue(){
    this.prueba = 4;
  }
  changevalue2(){
    this.prueba = 2;
  }

  sendPostRequest() {
    const headers = new HttpHeaders()
        .set('cache-control', 'no-cache')
        .set('content-type', 'application/json')
        .set('postman-token', 'c-NAbPwzqb0:APA91bF4LaZzow4BMk78YElKbqfo9KXyt4VaLWX9YfPjxlrN9wOqts7e762x3cJKFT-gl1FLWCzYWMMfTb2NO9Jgrcqcbv72yXax-oKwflWoxyXM25MeHW5w94h1QL8QZ6TGy8_hpeXh');

    const body = {
        email: 'myemail@xyz.com',
        user_password: 'mypasss',
        token: 'dfiUfrFzSvvyHgGf3IFWbY:APA91bH51VAiVpvBaQa7M2lthBoistNPqG1J6C7kAaM68eNe_Bk7e4NUjqzEIng9PoM0gpXJdhVKAQgVvFFv0-kGqeYaNX_05f5d9cxkggKSzGlDlZttasBrz_xTXXDbhRfhqPS2ME9N'
    }

    return this.http
               .post(this.url, body, { headers: headers })
               .subscribe((res:any) => {
                 console.log(res);
               });
    }
    
    sendPushMessage2(title, message){
      this.msg.sendPushMessage(title);
    }
    pruebaTest(){
      var d = new Date();
      alert(d.getTime());
    }

  

}
