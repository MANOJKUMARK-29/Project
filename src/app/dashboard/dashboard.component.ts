import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarchartComponent } from '../barchart/barchart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BarchartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  sidebar = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    } else {
      this.router.navigate(['/loginform']);
    }
  }
  // -----------remove-user-from-localstorage-and-log's-out------ 
  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/loginform']);
  }

  // -----------expand-the-side-bar-when-menu-button-clicked---
  expand() {
    this.sidebar = !this.sidebar;
  }
  // -----------shoe-the-corressponding-report-in-list0based-on-user-domain----
  showdomainreport(domainname: string): boolean {
    if (!this.currentUser) return false;

    return (
      this.currentUser.domain.toLowerCase() === domainname.toLocaleLowerCase()
    );
  }
}
