import { Routes } from '@angular/router';
import { LoginformComponent } from './loginform/loginform.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'loginform',
    pathMatch: 'full',
  },
  { path: 'loginform', component: LoginformComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: '**',
    redirectTo: 'loginform',
  },
];
