import { Component, OnInit } from '@angular/core';
import {ServerService} from './server.service'
import {Server} from './server'


@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
  providers:[ServerService]
})

export class ServerComponent implements OnInit {

  servers: Server[]
  serverName;
  newServerToken;

  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.serverService
     .getServers()
     .then((servers: Server[]) => {
       this.servers = servers.map((server) => {
         var fecha = new Date();
         var lastConnectionDate = new Date(server.lastconnection)
         lastConnectionDate.setMinutes(lastConnectionDate.getMinutes() + 5);
         if ( lastConnectionDate.getTime() > fecha.getTime() && server.lastconnection != null ) {
           server.activo = true;
           var activ = server.activo;
         }else{
           server.activo = false;
         }
         return server;
       });
     });

  }

  createServer(){
    this.serverService.createServer(this.serverName)
        .then((server: Server) =>{
          this.newServerToken = server.token;
          console.log(this.newServerToken);
        })
  }

  serverSelected(i){
    console.log(this.servers[i].id);
    this.serverService.deleteServer(this.servers[i].id);
    this.servers = [];
    this.ngOnInit();
  }

}
