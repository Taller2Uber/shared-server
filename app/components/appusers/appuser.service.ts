import { Injectable } from '@angular/core';
import { AppUser } from './appuser';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class AppUserService {
    private usersUrl = '/front/users';

    constructor (private http: Http) {}

    getUsers(): Promise<void | AppUser[]> {
    return this.http.get(this.usersUrl)
               .toPromise()
               .then(response => response.json() as AppUser[])
               .catch(this.handleError);
    }


  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
}
