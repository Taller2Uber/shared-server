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

  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.serverService
     .getServers()
     .then((servers: Server[]) => {
       this.servers = servers.map((server) => {
         var fecha = new Date();
         console.log('timestamp server' + new Date(server.lastconnection).getTime())
         console.log('timestamp now: ' + fecha.getTime())
         if ( new Date(server.lastconnection).getTime() < fecha.getTime() && server.lastconnection != null ) {
           server.activo = true;
         }else{
           server.activo = false;
         }
         return server;
       });
     });

  }

}
