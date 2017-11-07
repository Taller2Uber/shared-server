import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponentComponent } from './login/login-component.component';
import { UsersListComponent } from './user/users-list.component';
import { MainMenuComponentComponent } from './mainMenu/main-menu-component/main-menu-component.component';
import { ServerComponent } from './server/server.component';
import {TripComponentComponent} from './trip-component/trip-component.component'
import {RulesComponent} from './rules/rules.component'

// Route Configuration
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponentComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'mainmenu', component: MainMenuComponentComponent },
  { path: 'servers', component: ServerComponent},
  { path: 'trips', component: TripComponentComponent },
  { path:'rules', component: RulesComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
