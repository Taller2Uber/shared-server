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

}
