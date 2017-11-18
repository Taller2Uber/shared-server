import { Component, OnInit } from '@angular/core';
import { TripServiceService } from './trip-service.service';
import{ Trip } from './trip';

@Component({
  selector: 'app-trip-component',
  templateUrl: './trip-component.component.html',
  styleUrls: ['./trip-component.component.css'],
  providers: [TripServiceService]
})
export class TripComponentComponent implements OnInit {

  trips: Trip[]
  lastTrips: Trip[]
  tripsFromServer: Trip[]
  userId:'71';
  NumberOfLastTripsShowed = 5;
  lastTripsMessage;
  serverTripsMessage;

  constructor(private tripService: TripServiceService) {
    this.userId='71'
    this.lastTripsMessage = 'Ultimos viajes dados de alta';
    this.tripService.getLastTrips(this.NumberOfLastTripsShowed)
                    .then((lastTrips : Trip[])=>{
                      this.lastTrips = lastTrips.map((trip)=>{
                        return trip;
                        })
                      });
  }

  ngOnInit() {
  }

  buscar(){
    this.serverTripsMessage = '';
    this.lastTripsMessage = 'Viajes del usuario ' + this.userId;
    this.lastTrips = [];
    this.tripsFromServer = []
    this.tripService
    .getTrips(this.userId)
    .then((trips : Trip[])=>{
      this.trips = trips.map((trip)=>{
        return trip;
      })
    })

  }

  buscarPorAppserver(){
    this.serverTripsMessage = 'Viajes del appserver ' + this.userId;
    this.lastTripsMessage = '';
    this.lastTrips = [];
    this.tripsFromServer = []
    this.trips = []
    this.tripService.getAppserverTrips(this.userId)
    .then((trips : Trip[]) =>{
      this.tripsFromServer = trips.map((trip)=>{
        return trip;
      })
    })
  }

}
