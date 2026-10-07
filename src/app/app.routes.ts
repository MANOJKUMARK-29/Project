import { Routes } from "@angular/router";

import { LoginformComponent } from "./loginform/loginform.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BarchartdatatableComponent } from "./barchartdatatable/barchartdatatable.component";
import { LayoutComponent } from "./layout/layout.component";
import { TaskeditComponent } from "./taskedit/taskedit.component";
import { EmptyComponent } from "./empty/empty.component";
import { ForgotpasswordComponent } from "./forgotpassword/forgotpassword.component";
import { ProfileComponent } from "./profile/profile.component";
import { EmailValidator } from "@angular/forms";
import { EmailverificationComponent } from "./emailverification/emailverification.component";
export const routes: Routes = [
  {
    path: "",
    redirectTo: "loginform",
    pathMatch: "full",
  },

  {
    path: "loginform",
    component: LoginformComponent,
  },
  {
    path: "emailverification",
    component: EmailverificationComponent,
  },
  {
    path: "forgotpassword",
    component: ForgotpasswordComponent,
  },

  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },

      {
        path: "attendance",
        component: BarchartdatatableComponent,
      },
      {
        path: "taskedit",
        component: TaskeditComponent,
      },
      {
        path: "empty",
        component: EmptyComponent,
      },
      {
        path: "profile",
        component: ProfileComponent,
      },
    ],
  },

  {
    path: "**",
    redirectTo: "loginform",
  },
];
