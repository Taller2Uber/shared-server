import { Injectable } from '@angular/core';
import { Server } from './server';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http'
import {url} from '../urlvar'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ServerService {
  private serversURL = url + 'api/servers';

  constructor (private http: Http) {}

  getServers(): Promise<Server[]> {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var t = localStorage.getItem("token");
      headers.append("token", t);
      return(this.http.get(this.serversURL, { headers : headers })
               .toPromise()
               .then(response => response.json().servers as Server[])
               .catch(this.handleError));
  }

  createServer(serverName): Promise<Server>{
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    return(this.http.post(this.serversURL,{name: serverName }  ,{ headers : headers })
             .toPromise()
             .then(response => response.json().server as Server)
             .catch(this.handleError));
  }

  deleteServer(serverId){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var t = localStorage.getItem("token");
    headers.append("token", t);
    this.http.delete('http://localhost:3000/api/servers/' + serverId,{ headers : headers })
             .toPromise()
             .then(response => response.json().server as Server)
             .catch(this.handleError);
  }

  private handleError (error: any): Promise<any> {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}
