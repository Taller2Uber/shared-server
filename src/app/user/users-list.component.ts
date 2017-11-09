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

}
