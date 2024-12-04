import { Routes} from '@angular/router';
import {GroupsComponent} from "./groups.component";
import {GroupComponent} from "./group.component";
export const routes: Routes = [

  {
    path: '',
    component: GroupsComponent,
    pathMatch: 'full',
  },
  {
    path: ':group_id',
    component: GroupComponent,
  },

];
