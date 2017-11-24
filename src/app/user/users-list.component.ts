import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UsersServiceService } from './users-service.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  providers: [UsersServiceService]
})
export class UsersListComponent implements OnInit {

  users: User[]
  userId;

  constructor(private usersService : UsersServiceService ) { }

  ngOnInit() {
    this.usersService
     .getAllUsers()
     .then((users: User[]) => {
       this.users = users.map((user) => {
         return user;
       });
     });
  }

  buscarUser(){
    var user;
    this.usersService
        .getOneUser(this.userId)
        .then((user : User) =>{
          this.users = [user];
        })
  }

  deleteUser(i){
    console.log(this.users[i].id)
    this.usersService.deleteUser(this.users[i].id)
  }

}
