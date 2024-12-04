import {CanActivateFn, Routes} from '@angular/router';
import {SignupComponent} from './signup.component';
import {SigninComponent} from "./signin.component";
import {OuchComponent} from "./ouch/ouch.component";
import {GroupsComponent} from "./groups/groups.component";
import {inject} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {checkTokenGuard} from "./check-token.guard";
import {ProfileComponent} from "./profile.component";

export const routes: Routes = [

  {
    path: '', redirectTo: 'groups', pathMatch: 'full',
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full',
  }, {
    path: 'signin',
    component: SigninComponent,
    pathMatch: 'full',
  },
  {
    path:"groups",
    loadChildren:()=>import('./groups/groups.routes').then(r=>r.routes),
    canActivate:[checkTokenGuard],
  },
  {
    path:"profile",
    component:ProfileComponent,
    canActivate:[checkTokenGuard],
  },
  {
    path: "**", component: OuchComponent
  }
];
