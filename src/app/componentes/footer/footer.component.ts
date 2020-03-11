import { Component, OnInit } from '@angular/core';
import { MessagingService } from "../../servicios/messaging.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  //message;
  //constructor(private messagingService: MessagingService) { }

  ngOnInit() {
    //const userId = 'user001';
    //this.messagingService.requestPermission(userId);
    //this.messagingService.receiveMessage();
    //this.message = this.messagingService.currentMessage;
  }

}
