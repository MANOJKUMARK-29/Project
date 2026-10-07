import { Component, OnInit } from "@angular/core";
import { NgClass } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-forgotpassword",
  standalone: true,
  imports: [RouterModule, NgClass, FormsModule, CommonModule],
  templateUrl: "./forgotpassword.component.html",
  styleUrl: "./forgotpassword.component.css",
})
export class ForgotpasswordComponent implements OnInit {
  email: string = "";
  password: string = "";
  conPassword: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;
  showtoast: boolean = false;
  viewpassword: boolean = false;
  viewConfirmPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      this.email = remembered;
    }
  }

  reset(resetForm: NgForm): void {
    if (resetForm.invalid) {
      this.errorMessage = "Please fill in all required fields";
      return;
    }

    if (this.password !== this.conPassword) {
      this.errorMessage = "The password and confirm Password do not match!";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    this.authService.getUserByEmail(this.email).subscribe({
      next: (users) => {
        if (users && users.length > 0) {
          const user = users[0];

          this.authService.updatePassword(user.id, this.conPassword).subscribe({
            next: () => {
              this.showtoast = true;
              setTimeout(() => {
                this.isLoading = false;
                this.router.navigate(["/loginform"]);
              }, 2000);
            },
            error: () => {
              this.isLoading = false;
              this.errorMessage =
                "Failed to update password. Please try again.";
            },
          });
        } else {
          this.isLoading = false;
          this.errorMessage = "No account found with this email address!";
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage =
          "Server error. Please ensure json-server is running.";
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
  showConfirmPassword(): void {
    this.viewConfirmPassword = !this.viewConfirmPassword;
  }
}
