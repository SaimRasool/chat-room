import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyMessengerComponent } from './my-messenger/my-messenger.component';
import { MessengerListComponent } from './messenger-list/messenger-list.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './alert/alert.component';
import { MessengerComponent } from './messenger/messenger.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MyMessengerComponent,
    MessengerListComponent,
    LoginComponent,
    AlertComponent,
    MessengerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule 
    
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
