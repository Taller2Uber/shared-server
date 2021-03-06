import { Component, OnInit } from '@angular/core'
import {BackofficeUser} from './backoffice-user'
import {BackofficeService} from './backoffice.service'

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  providers: [BackofficeService]
})

export class BackofficeComponent implements OnInit {

  users: BackofficeUser[]
  newUsername;
  newSurname;
  newName;
  newPassword;
  newRole;
  errorMessage;

  constructor(private service : BackofficeService) { }

  ngOnInit() {
    this.service.getUsers()
      .then((users: BackofficeUser[]) =>{
        this.users = users.map((user) =>{
          return user
        })
      })
  }

  createUser(){
    if( this.newName == null || this.newUsername == null || this.newUsername == null || this.newPassword == null || this.newRole == null ){
      this.errorMessage = 'Por favor, ingrese todos los datos'
    }else if( this.newRole != 'admin' && this.newRole != 'user' && this.newRole != 'manager' ){
      this.errorMessage = '';
      this.errorMessage = 'Valor incorrecto de rol. Por favor, ingrese admin, user o manager'
    }else{
      this.service.createUser( this.newName, this.newSurname, this.newUsername, this.newPassword, this.newRole );
      this.errorMessage = '';
    }
  }

  modifyUser(i){
    if( this.users[i].name != null && this.users[i].surname != null && this.users[i].username != null && this.users[i].password != null && this.users[i].role != null ){
      this.service.modifyUser(this.users[i].name, this.users[i].surname, this.users[i].username, this.users[i].password, this.users[i].role, this.users[i]._ref, this.users[i].id);
    }
  }

  deleteUser(i){
    this.service.deleteUser( this.users[i].id);
  }

}
