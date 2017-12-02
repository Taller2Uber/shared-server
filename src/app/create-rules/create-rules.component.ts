import { Component, OnInit } from '@angular/core';
import { CreaterulesService } from './createrules.service';
import { Rule } from './rule'

@Component({
  selector: 'app-create-rules',
  templateUrl: './create-rules.component.html',
  styleUrls: ['./create-rules.component.css'],
  providers: [ CreaterulesService ]
})
export class CreateRulesComponent implements OnInit {

  public blob;
  public rule;
  public resultRule;
  public rules : Rule[];
  constructor(private service: CreaterulesService) { }

  ngOnInit() {
  }

  crearRegla(){
    this.rule = {};
    this.rule.active = true;
    this.rule.language = 'node-rules';
    this.rule.lastcommit = null;
    this.rule.blob = this.blob;

    this.service.createRule(this.rule)
    .then((resultRule : Rule)=>{
      this.resultRule = resultRule;
    })
  }

  getReglas(){
    this.service.getRules()
    .then((rules : Rule[] ) => {
      this.rules = rules;
    })
  }

  updateRegla(i){
    this.service.updateRule( this.rules[i].id, this.rules[i].language, this.rules[i].active, this.rules[i]._ref );
  }

  deleteRegla(i){
    this.service.deleteRule(this.rules[i].id);
  }

}
