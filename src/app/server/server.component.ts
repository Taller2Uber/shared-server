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
    console.log('ENtro al onInit');
    this.serverService
     .getServers()
     .then((servers: Server[]) => {
       this.servers = servers.map((server) => {
         if (!server.id) {

         }
         return server;
       });
     });

  }

}
