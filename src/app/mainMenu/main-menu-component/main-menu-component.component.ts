import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-main-menu-component',
  templateUrl: './main-menu-component.component.html',
  styleUrls: ['./main-menu-component.component.css']
})
export class MainMenuComponentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToUsers(){
    this.router.navigate(['/users']);
  }

  goToServers(){
    this.router.navigate(['/servers']);
  }

  goToTrips(){
    this.router.navigate(['/trips']);
  }

  goToRules(){
    this.router.navigate(['/rules']);
  }

}
