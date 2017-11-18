import { Injectable } from '@angular/core';
import { Trip } from './trip';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TripServiceService {
  private tripsURL = 'http://localhost:3000/api/users/';
  private lastTripsURL = 'http://localhost:3000/api/trips/lasttrips';
  private tripsServersURL = 'http://localhost:3000/api/servers/'

  constructor(private http : Http) {}

  getTrips(userId): Promise<Trip[]>{
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    this.tripsURL = 'http://localhost:3000/api/users/'
    this.tripsURL = this.tripsURL + userId + '/trips';
    return(this.http.get(this.tripsURL, {headers: headers})
    .toPromise()
    .then(response => response.json().trips as Trip[])
    .catch(this.handleError));
  }

  getLastTrips(numberOfTrips): Promise<Trip[]>{
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);

    return(this.http.post(this.lastTripsURL,{numberOfTrips: numberOfTrips}, {headers: headers})
      .toPromise()
      .then(response => response.json().trips as Trip[])
      .catch(this.handleError));
  }

  getAppserverTrips(serverId): Promise<Trip[]>{
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var t = localStorage.getItem("token");
    headers.append("token", t);
    this.tripsServersURL = 'http://localhost:3000/api/servers/'
    this.tripsServersURL = this.tripsServersURL + serverId + '/trips';
    return(this.http.get(this.tripsServersURL, {headers: headers})
      .toPromise()
      .then(response => response.json().trips as Trip[])
      .catch(this.handleError));
  }

  private handleError (error: any): Promise<any> {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}
