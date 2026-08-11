import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BarchartComponent } from '../barchart/barchart.component';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { BarchartdataservicesService } from '../services/barchartdataservices.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BarchartComponent, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {


  constructor(private router: Router, private barchartDataService: BarchartdataservicesService) {}

  ngOnInit(): void {
    console.log("Dashboard Domain:", this.barchartDataService.selectedDomain);
    const user = localStorage.getItem('currentUser');
    if (!user) {
      this.router.navigate(['/loginform']);
    }
  }
}
