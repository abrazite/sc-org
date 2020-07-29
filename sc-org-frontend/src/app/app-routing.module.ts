import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { UserBrowserComponent } from './components/user/user-browser.component';

const routes: Routes = [
  { path: '', component: UserBrowserComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent},
  { path: 'oauth/callback', component: AuthComponent  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
