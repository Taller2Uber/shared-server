import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http'
import {Rule} from './rule'
import {url} from '../urlvar'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CreaterulesService {
  private URL = url + 'api/rules';

  constructor(private http: Http) { }

  createRule(ruleJson): Promise<Rule>{
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    return this.http.post(this.URL, ruleJson ,{ headers : headers })
             .toPromise()
             .then(response => response.json().user as Rule)
             .catch(this.handleError);
  }

  getRules(): Promise<Rule[]>{
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
      return(this.http.get(this.URL, {headers: headers})
               .toPromise()
               .then(response => response.json().rules as Rule[])
               .catch(this.handleError));
  }

  deleteRule(id){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
      return(this.http.delete(this.URL + '/' + id, {headers: headers})
               .toPromise()
               .catch(this.handleError));
  }

  updateRule(id, language, active, _ref){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    this.http.put(this.URL + '/' + id, {language: language, active: active, _ref: _ref}
                                  ,{ headers : headers })
             .toPromise()
             .then(response => response.json().rule as Rule)
             .catch(this.handleError);
  }

  private handleError (error: any): Promise<any> {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}
