import { Component, OnInit } from '@angular/core';
import { RulesService } from './rules.service'
import { Rule } from './rule';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
  providers: [ RulesService ]
})
export class RulesComponent implements OnInit {

  public distance;
  public mail;
  public ownDailyTrips;
  public totalTrips;
  public fecha;
  public cost;
  public matchingRules;
  public balance;
  public cantViajes;

  constructor(private ruleService: RulesService) {
    this.distance = 0;
    this.mail = '';
    this.ownDailyTrips = 0;
    this.totalTrips = 0;
    this.fecha = 0;
    this.cost;
    this.balance = 0;
    this.cantViajes = 0;
    this.matchingRules = []

  }

  ngOnInit() {
  }

  calculateCost(){
    var factJson = {
      distance : this.distance,
      mail : this.mail,
      ownDailyTrips : this.ownDailyTrips,
      totalTrips : this.totalTrips,
      fecha : this.fecha,
      balance: this.balance,
      cantViajes: this.cantViajes
    }
    this.ruleService.getResult(factJson)
    .then((result : Rule)=> {
      if( result.tripOk == true ){
        this.cost = 'Costo: ' + result.cost * result.discount;
      }else{
        this.cost = 'Viaje rechazado';
      }
      this.matchingRules = result.matchPath;
    }).catch(e =>{
      console.log(e);
    })
  }

}
