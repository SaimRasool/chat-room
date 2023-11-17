import { Component } from '@angular/core';
import { UserVM } from './models/usersVM';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-room';
   user: UserVM =new UserVM();
   constructor(private accountService: UserService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
    }
}
