import { NgClass } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";

export interface User {
  id: string;
  email: string;
  password: string;
  uname: string;
  role: string;
  domain: string;
  badge: string;
}

@Component({
  selector: "app-loginform",
  standalone: true,
  imports: [RouterModule, NgClass, FormsModule, CommonModule],
  templateUrl: "./loginform.component.html",
  styleUrl: "./loginform.component.css",
})
export class LoginformComponent implements OnInit {
  email: string = "";
  password: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;
  showtoast: boolean = false;
  rememberMe: boolean = false;
  viewpassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      this.email = remembered;
      this.rememberMe = true;
    }

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      this.router.navigate(["/dashboard"]);
    }
  }

  login(form: any): void {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = "";

    this.authService.getUserByEmail(this.email).subscribe({
      next: (users) => {
        const user = users.find((u) => u.password === this.password);

        if (user) {
          if (this.rememberMe) {
            localStorage.setItem("rememberedEmail", this.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              name: user.uname,
              email: user.email,
              domain: user.domain,
              role: user.role,
            }),
          );

          this.showtoast = true;
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(["/dashboard"]);
          }, 500);
        } else {
          this.isLoading = false;
          this.errorMessage =
            "Invalid email or password. Please verify your credentials.";
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "Unable to Login, Pleasy try again later.";
      },
    });
  }

  clearError(): void {
    this.errorMessage = "";
  }
  closeToast(): void {
    this.showtoast = false;
  }
  showpassword(): void {
    this.viewpassword = !this.viewpassword;
  }
}
