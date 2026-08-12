import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { BarchartdataservicesService } from '../services/barchartdataservices.service';
import { TaskeditComponent } from '../taskedit/taskedit.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule ,RouterOutlet, TaskeditComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  currentUser: any;
  sidebar = false;
constructor(private router: Router, private barchartDataService: BarchartdataservicesService) {}

  ngOnInit(): void {

    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
if (!this.barchartDataService.selectedDomain) {
  if (this.currentUser.role === 'ADMIN') {
    this.barchartDataService.selectedDomain = 'All';
  } else {
    this.barchartDataService.selectedDomain = this.currentUser.domain;
  }
}
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
    if (!this.currentUser){ return false;}
    if (this.currentUser.role === 'ADMIN') {return true;}
    return (
      this.currentUser.domain.toLowerCase() === domainname.toLocaleLowerCase()
    );
  }
  openReport(domain: string) {

  this.barchartDataService.selectedDomain = domain;
     console.log("Selected Domain in Layout:", this.barchartDataService.selectedDomain);
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/dashboard']);
  });
}
 taskeditOpen(){
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
