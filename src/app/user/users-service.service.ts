import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { User } from './user'

@Injectable()
export class UsersServiceService {
  private usersURL = 'http://localhost:3000/api/users';


  constructor(private http: Http) { }

  getAllUsers(): Promise<User[]> {
    var token = localStorage.getItem('token');
    let opt : RequestOptions;
    let headers: Headers = new Headers
    headers.set('Content-type', 'application/json')
    headers.append('Accept', 'application/json')
    headers.append("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms");
    opt = new RequestOptions({
      headers: headers
    })
      return(this.http.get(this.usersURL, JSON.stringify({headers: headers}))
               .toPromise()
               .then(response => response.json().users as User[])
               .catch(this.handleError));
  }

  private handleError (error: any): Promise<any> {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}
