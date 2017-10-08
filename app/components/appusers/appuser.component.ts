import { Component, OnInit } from '@angular/core';
import { AppUser } from './appuser';
import { AppUserService } from './appuser.service';


@Component({
  selector: 'user-list',
  templateUrl: './users-list.html',
  providers: [AppUserService]
})

export class AppUserListComponent implements OnInit {

  appUsers: AppUser[]
  selectedAppUser: AppUser

  constructor(private appuserService: AppUserService) { }

  ngOnInit() {
     this.appuserService
      .getUsers()
      /*.then((appUsers: AppUser[]) => {
        this.appUsers = appUsers.map((appUser) =>{
          if(!appUser.birthdate){
            console.log('ERROR');
          }
        });
          return AppUser;
        });*/
      };

}
