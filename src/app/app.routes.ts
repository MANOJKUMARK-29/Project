import { Routes } from '@angular/router';

import { LoginformComponent } from './loginform/loginform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarchartdatatableComponent } from './barchartdatatable/barchartdatatable.component';
import { LayoutComponent } from './layout/layout.component';
import { TaskeditComponent } from './taskedit/taskedit.component';
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'loginform',
    pathMatch: 'full'
  },

  {
    path: 'loginform',
    component: LoginformComponent
  },

  {
    path: '',
    component: LayoutComponent,
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'attendance',
        component: BarchartdatatableComponent
      },
      {
    path: 'taskedit',
    component: TaskeditComponent
  },

    ]
  },

  {
    path: '**',
    redirectTo: 'loginform'
  }

];
