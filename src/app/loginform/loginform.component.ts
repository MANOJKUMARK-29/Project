import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [RouterModule, NgClass, FormsModule, CommonModule],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.css',
})
export class LoginformComponent implements OnInit {

   
  // COMPONENT STATE
   
  viewpassword = false;           // Password visibility toggle
  email: any = '';                // Email input value
  password: any = '';             // Password input value
  showtoast: boolean = false;     // Toast notification visibility

   
  // MOCK USER DATA
   
  // In production, this would come from an authentication service/API
  users = [
    {
      email: 'admin@gmail.com',
      password: 'Admin123',
      uname: 'ADMIN',
      role: 'ADMIN',
      domain: 'ALL'
    },
    {
      email: 'manojmj029@gmail.com',
      password: 'Manoj123',
      uname: 'MANOJKUMAR',
      role: 'USER',
      domain: 'Voltas'
    },
    {
      email: 'manoj199929@gmail.com',
      password: 'SRIMACK',
      uname: 'MANOJ2',
      role: 'USER',
      domain: 'Sms'
    },
    {
      email: 'manoj.mailbox.29@gmail.com',
      password: 'Manoj345',
      uname: 'VICKY',
      role: 'USER',
      domain: 'Tvs'
    }
  ];

   
  // CONSTRUCTOR
   
  constructor(private router: Router) {}

   
  // LIFECYCLE HOOKS
   
  ngOnInit(): void {
    // -------------------------------------------------------------------------
    // AUTO-LOGIN CHECK
    // -------------------------------------------------------------------------
    // If user already logged in, redirect to dashboard
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser, 'current user');
    if (currentUser) {
      this.router.navigate(['/dashboard']);
      // localStorage.removeItem('currentUser') // Uncomment to force re-login
    }
  }

   
  // AUTHENTICATION

  login(form: any): void {
    // Form validation
    if (form.invalid) {
      return;
    }

    // Find matching user
    const user = this.users.find(
      (u) => u.email === this.email && u.password === this.password,
    );

    if (user) {
      // -----------------------------------------------------------------------
      // SUCCESSFUL LOGIN
      // -----------------------------------------------------------------------
      // Store user data in localStorage for session persistence
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          name: user.uname,
          email: user.email,
          domain: user.domain,
          role: user.role
        })
      );

      // Show success toast
      this.showtoast = true;

      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // -----------------------------------------------------------------------
      // FAILED LOGIN
      // -----------------------------------------------------------------------
      alert('Please enter correct email & password');
    }

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      this.showtoast = false;
    }, 4000);
  }

   
  // TOAST CONTROL
   
  closeToast(): void {
    this.showtoast = false;
  }

  showpassword(): void {
    this.viewpassword = !this.viewpassword;
  }
}
