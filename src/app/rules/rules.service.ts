import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Rule } from './rule'
import {url} from '../urlvar'

@Injectable()
export class RulesService {
  private rulesURL = url + 'api/rules'


  constructor(private http: Http) { }

  getResult(factJson): Promise<Rule>{
    return(this.http.post(this.rulesURL + '/runall', factJson)
    .toPromise()
    .then(response => response.json() as Rule)
    .catch(this.handleError));
  }


  private handleError (error: any): Promise<any> {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}
