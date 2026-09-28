import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { BarchartdataservicesService } from '../services/barchartdataservices.service';
import { LoadingService } from '../services/loading.service';
import { FormsModule } from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet,FormsModule,NzSelectModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  selectedArea: string = 'Voltas';
  currentUser: any;
  sidebar = false;
  constructor(public router: Router, public barchartDataService: BarchartdataservicesService, private loadingService: LoadingService) { }

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
    this.loadingService.show();
    localStorage.removeItem('currentUser');
    this.router.navigate(['/loginform']);
  }

  // -----------expand-the-side-bar-when-menu-button-clicked---
  expand() {
    this.sidebar = !this.sidebar;
  }
  // -----------shoe-the-corressponding-report-in-list0based-on-user-domain----
  showdomainreport(domainname: string): boolean {
    if (!this.currentUser) { return false; }
    if (this.currentUser.role === 'ADMIN') { return true; }
    return (
      this.currentUser.domain.toLowerCase() === domainname.toLocaleLowerCase()
    );
  }
  openReport(domain: string) {
    this.loadingService.show();
    this.barchartDataService.selectedDomain = domain;
    console.log("Selected Domain in Layout:", this.barchartDataService.selectedDomain);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
  taskeditOpen() {
    this.loadingService.show();
    this.router.navigate(['/taskedit']);
  }
  placeChange(event: Event) {
   
    this.barchartDataService.selectedArea = this.selectedArea;
  }
  Home(): void {
    this.loadingService.show();
    if (this.currentUser.role === 'ADMIN') {
      this.barchartDataService.selectedDomain = 'All';
    } else {
      this.barchartDataService.selectedDomain = this.currentUser.domain;
    }
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
  onHrefClick(event: Event): void {
    event.preventDefault();
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 600);
  }
}
