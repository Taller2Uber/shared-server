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
  userId:'71';
  NumberOfLastTripsShowed = 5;
  lastTripsMessage;

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
    this.lastTripsMessage = '';
    this.lastTrips = [];
    this.tripService
    .getTrips(this.userId)
    .then((trips : Trip[])=>{
      this.trips = trips.map((trip)=>{
        return trip;
      })
    })

  }

}
