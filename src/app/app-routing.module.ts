import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessengerComponent } from './messenger/messenger.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
    { path: '', component: MessengerComponent,canActivate: [AuthGuard] },
   // { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
