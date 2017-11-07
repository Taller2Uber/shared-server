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
  userId:'71';

  constructor(private tripService: TripServiceService) {
    this.userId='71'
  }

  ngOnInit() {
  }

  buscar(){
    this.tripService
    .getTrips(this.userId)
    .then((trips : Trip[])=>{
      this.trips = trips.map((trip)=>{
        return trip;
      })
    })

  }

}
