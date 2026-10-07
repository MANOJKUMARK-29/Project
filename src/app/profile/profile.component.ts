import { Component, OnInit } from "@angular/core";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthService, User } from "../services/auth.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-profile",
  standalone: true,
  imports: [NgbNavModule, FormsModule, CommonModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  profilePicUrl = "/Images/user.png";
  coverImage = "/Images/deskimage.jpg";
  currentUserDetails: any = null;
  userDetails: User | null = null;
  useremail: string = "";
  formSubmitted: boolean = false;
  oldPassword = "";
  newPassword = "";
  confirmPassword = "";
  errorMessage = "";
  successMessage = "";
  showerrMessage: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      this.currentUserDetails = JSON.parse(storedUser);
      this.useremail = this.currentUserDetails?.email || "";

      if (this.useremail) {
        this.getCurrentUserDetails(this.useremail);
      }
    }
  }

  getCurrentUserDetails(useremail: string) {
    this.authService.getUserByEmail(useremail).subscribe({
      next: (users: User[]) => {
        if (users && users.length > 0) {
          this.userDetails = users[0];
          console.log(" user details :", this.userDetails);
        }
      },
      error: (err) => {
        console.error("Error fetching user details:", err);
      },
    });
  }

  formsubmit() {
    this.formSubmitted = true;
    this.errorMessage = "";
    this.successMessage = "";

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = "All fields are required";
      this.showerrMessage = true;
      setTimeout(() => {
        this.showerrMessage = false;
      }, 3000);
      return;
    }

    if (!this.userDetails) {
      this.errorMessage =
        "User profile details not loaded yet. Please check your login session or reload.";
      this.showerrMessage = true;
      setTimeout(() => {
        this.showerrMessage = false;
      }, 3000);

      return;
    }

    if (this.oldPassword !== this.userDetails.password) {
      this.errorMessage = "Old Password does not match your current password";
      this.showerrMessage = true;
      setTimeout(() => {
        this.showerrMessage = false;
      }, 3000);
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage =
        "The confirmed password does not match the new password. Please confirm the new password";
      this.showerrMessage = true;
      setTimeout(() => {
        this.showerrMessage = false;
      }, 3000);
      return;
    }

    if (this.oldPassword === this.newPassword) {
      this.errorMessage =
        "The new password is same as old password, please choose another password";
      this.showerrMessage = true;
      setTimeout(() => {
        this.showerrMessage = false;
      }, 3000);
      return;
    }

    if (this.userDetails?.id) {
      this.authService
        .updatePassword(this.userDetails.id, this.newPassword)
        .subscribe({
          next: () => {
            this.showerrMessage = true;
            this.successMessage = "Password changed successfully";
            setTimeout(() => {
              this.showerrMessage = false;
            }, 5000);
            if (this.userDetails) {
              this.userDetails.password = this.newPassword;
            }
            if (this.currentUserDetails) {
              this.currentUserDetails.password = this.newPassword;
              localStorage.setItem(
                "currentUser",
                JSON.stringify(this.currentUserDetails),
              );
            }
            this.oldPassword = "";
            this.newPassword = "";
            this.confirmPassword = "";
            this.formSubmitted = false;
          },
          error: (err) => {
            this.errorMessage = "Failed to update password";
            console.error("Error updating password:", err);
            this.showerrMessage = true;
            setTimeout(() => {
              this.showerrMessage = false;
            }, 3000);
            return;
          },
        });
    }
  }
}
