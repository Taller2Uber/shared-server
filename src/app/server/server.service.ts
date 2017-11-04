import { Injectable } from '@angular/core';
import { Server } from './server';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ServerService {
  private serversURL = 'http://localhost:3000/api/servers';

  constructor (private http: Http) {}

  getServers(): Promise<Server[]> {
      return(this.http.get(this.serversURL)
               .toPromise()
               .then(response => response.json().resultado as Server[])
               .catch(this.handleError));
  }

  private handleError (error: any): Promise<any> {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}
