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
  viewpassword = false;
  email: any = '';
  password: any = '';
  showtoast: boolean = false;
  users=[

{
email:'admin@gmail.com',
password:'Admin123',
uname:'ADMIN',
role:'ADMIN',
domain:'ALL'
},

{
email:'manojmj029@gmail.com',
password:'Manoj123',
uname:'MANOJKUMAR',
role:'USER',
domain:'Voltas'
},

{
email:'manoj199929@gmail.com',
password:'SRIMACK',
uname:'MANOJ2',
role:'USER',
domain:'Sms'
},

{
email:'manoj.mailbox.29@gmail.com',
password:'Manoj345',
uname:'VICKY',
role:'USER',
domain:'Tvs'
}

];
  constructor(private router: Router) {}
  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser, 'current user');
    if (currentUser) {
      this.router.navigate(['/dashboard']);
      // localStorage.removeItem('currentUser')
    }
  }

  login(form: any): void {


    if (form.invalid) {
      return;
    }
    const user = this.users.find(
      (u) => u.email === this.email && u.password === this.password,
    );
    if (user) {
     localStorage.setItem(
'currentUser',
JSON.stringify({

name:user.uname,
email:user.email,
domain:user.domain,
role:user.role

}));
      this.showtoast = true;

      this.router.navigate(['/dashboard']);
    } else {
      alert('Please enter correct email & password');
    }

    setTimeout(() => {
      this.showtoast = false;
    }, 4000);
  }
  closeToast() {
    this.showtoast = false;
  }

  showpassword(): void {
    this.viewpassword = !this.viewpassword;
  }
}
