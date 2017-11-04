import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ServerComponent } from './server/server.component';
import { UsersListComponent } from './user/users-list.component';
import { LoginComponentComponent } from './login/login-component.component';
import { routing } from './app.routes';
import { MainMenuComponentComponent } from './mainMenu/main-menu-component/main-menu-component.component'

@NgModule({
  declarations: [
    AppComponent,
    ServerComponent,
    UsersListComponent,
    LoginComponentComponent,
    MainMenuComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
