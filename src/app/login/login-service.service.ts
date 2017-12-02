import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Token } from './token'
import {url} from '../urlvar'


@Injectable()
export class LoginServiceService {
  private tokenURL = url + 'api/token';

  constructor(private http : Http) {   }

  getToken(userEntered, passEntered): Promise<Token>{
    return(this.http.post(this.tokenURL, {username:userEntered , password:passEntered})
             .toPromise()
             .then(response => response.json() as Token)
             .catch(this.handleError));
  }

  private handleError (error: any): Promise<any> {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}
