import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from './login-service.service'
import { Token } from './token';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
  providers:[ LoginServiceService ]
})
export class LoginComponentComponent implements OnInit {

  public user = "GAGimenez";
  public password = "1234";
  private tokenReceived = "";
  private loginError = "";
  constructor(private loginService : LoginServiceService, private router : Router) { }

  ngOnInit() {}

  action(event){
    this.loginError = "";
    this.loginService
    .getToken(this.user, this.password)
    .then((token: Token) => {
     this.tokenReceived = token.token.token;
     localStorage.setItem('token', this.tokenReceived);
     localStorage.setItem('username', this.user);
     this.router.navigate(['/mainmenu']);
   }).catch(e =>{
     this.loginError = "Error de autenticacion"
   })
  }

}
