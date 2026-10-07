import { Component, OnInit } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-emailverification",
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: "./emailverification.component.html",
  styleUrl: "./emailverification.component.css",
})
export class EmailverificationComponent implements OnInit {
  email: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;
  showtoast: boolean = false;
  isEmailSent: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  reset(resetForm: NgForm): void {
    if (resetForm.invalid) {
      this.errorMessage = "Please enter a valid email address";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    this.authService.getUserByEmail(this.email).subscribe({
      next: (users) => {
        if (users && users.length > 0) {
          this.isEmailSent = true;
          this.showtoast = true;
          setTimeout(() => {
            this.router.navigate(["/loginform"]);
          }, 5000);
        } else {
          this.errorMessage = "Email not found";
          this.showtoast = true;
          setTimeout(() => {
            this.router.navigate(["/loginform"]);
          }, 5000);
        }
      },
    });
  }

  clearError(): void {
    this.errorMessage = "";
  }

  closeToast(): void {
    this.showtoast = false;
  }
}
