import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http'
import {BackofficeUser} from './backoffice-user'
import {url} from '../urlvar'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackofficeService {
  private buUrl = url + 'api/business-users'

  constructor( private http: Http ) { }

  getUsers() : Promise<BackofficeUser[]>{
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    return(this.http.get(this.buUrl, { headers : headers })
             .toPromise()
             .then(response => response.json().users as BackofficeUser[])
             .catch(this.handleError));
  }

  createUser(name, surname, username, password, role){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    this.http.post(this.buUrl, {name: name, surname: surname, username: username, password: password, role: role}
                                  ,{ headers : headers })
             .toPromise()
             .then(response => response.json().user as BackofficeUser)
             .catch(this.handleError);
  }

  modifyUser(name, surname, username, password, role, _ref, id){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    this.http.put(this.buUrl + '/' + id, {name: name, surname: surname, username: username, password: password, role: role, _ref: _ref}
                                  ,{ headers : headers })
             .toPromise()
             .then(response => response.json().user as BackofficeUser)
             .catch(this.handleError);
  }

  deleteUser(id){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    this.http.delete(this.buUrl + '/' + id, { headers : headers })
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
  }


  private handleError (error: any): Promise<any> {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}
