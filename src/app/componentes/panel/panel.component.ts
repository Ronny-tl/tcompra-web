import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../servicios/auth.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  uidUsuario: string;
  Usuario
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getUsuario();
  }
  getUsuario(){
    this.authService.getAuth().subscribe(auth =>{
      this.authService.getUsuario_Empresa().subscribe(data => {
        data.forEach(item =>{
        if(item.key === auth.uid){
          //this.nombreUsuario = item.data.nombre;
          if(item.data.imagen != "default"){
            //this.imagenUsuario = item.data.imagen;
          }
        }
        });
      });
      this.authService.getUsuario_Persona().subscribe(data => {
        data.forEach(item =>{
        if(item.key == auth.uid){
          //this.nombreUsuario = item.data.nombre;
          if(item.data.imagen != "default"){
            //this.imagenUsuario = item.data.imagen;
          }
        }
        });
      });
    })
  }

}
