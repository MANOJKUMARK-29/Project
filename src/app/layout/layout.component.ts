import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { BarchartdataservicesService } from '../services/barchartdataservices.service';
import { TaskeditComponent } from '../taskedit/taskedit.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

   
  // COMPONENT STATE
   
  currentUser: any;      // Logged-in user object from localStorage
  sidebar = false;       // Sidebar open/close state
  loading = false;       // Loading state (unused currently)

   
  // CONSTRUCTOR
   
  constructor(
    private router: Router,
    private barchartDataService: BarchartdataservicesService
  ) {}

   
  // LIFECYCLE HOOKS
   
  ngOnInit(): void {
    // INITIALIZE USER AND DOMAIN
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);

      // Set default domain if not already selected
      if (!this.barchartDataService.selectedDomain) {
        if (this.currentUser.role === 'ADMIN') {
          this.barchartDataService.selectedDomain = 'All';
        } else {
          this.barchartDataService.selectedDomain = this.currentUser.domain;
        }
      }
    }
  }

   
  // AUTHENTICATION
  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/loginform']);
  }

   
  // SIDEBAR CONTROL
  expand(): void {
    this.sidebar = !this.sidebar;
  }

  // ACCESS CONTROL
 
  showdomainreport(domainname: string): boolean {
    if (!this.currentUser) { return false; }
    // Admin sees all domains
     if (!this.currentUser) { return false; }
    // Admin sees all domains
    if (this.currentUser.role === 'ADMIN') { return true; }
    // Regular users only see their own domain
    return this.currentUser.domain.toLowerCase() === domainname.toLocaleLowerCase();
  }

   
  // NAVIGATION
  openReport(domain: string): void {
    this.barchartDataService.selectedDomain = domain;
    console.log('Selected Domain in Layout:', this.barchartDataService.selectedDomain);

    // Navigate with skipLocationChange to force component reload
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  /**
   * Navigates to task edit page
   */
  taskeditOpen(): void {
    this.router.navigate(['/taskedit']);
  }

  Home(): void {
    if (this.currentUser.role === 'ADMIN') {
      this.barchartDataService.selectedDomain = 'All';
    } else {
      this.barchartDataService.selectedDomain = this.currentUser.domain;
    }
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
