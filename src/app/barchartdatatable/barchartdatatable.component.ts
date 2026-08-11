import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

import {
  BarchartdataservicesService,
  EmployeeData,
} from '../services/barchartdataservices.service';

@Component({
  selector: 'app-barchartdatatable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    MultiSelectModule,
    CheckboxModule,
  ],
  templateUrl: './barchartdatatable.component.html',
  styleUrl: './barchartdatatable.component.css',
})
export class BarchartdatatableComponent implements OnInit {
  employees: EmployeeData[] = [];

  filteredEmployees: EmployeeData[] = [];
  allSelected = false;
  selectedLocation = 'All';
  selectedLocations: string[] = [];

  selectedStatus: 'All' | 'Present' | 'Absent' = 'All';

  selectedDomain = '';

  locationOptions = [
    { label: 'Medavakkam', value: 'Medavakkam' },
    { label: 'shozinganallur', value: 'shozinganallur' },
    { label: 'Karapakkam', value: 'Karapakkam' },
    { label: 'Navallur', value: 'Navallur' },
    { label: 'Tambaram', value: 'Tambaram' },
    { label: 'Adayar', value: 'Adayar' },
  ];

  locations = [
    'All',
    'Medavakkam',
    'shozinganallur',
    'Karapakkam',
    'Navallur',
    'Tambaram',
    'Adayar',
  ];

  constructor(
    private router: Router,
    private barchartDataService: BarchartdataservicesService,
  ) {}

  ngOnInit(): void {
    this.selectedDomain = this.barchartDataService.selectedDomain;

    this.selectedStatus = this.barchartDataService.selectedstatus ?? 'All';

    this.loadEmployees();
  }

  loadEmployees(): void {
    if (this.selectedDomain === 'All') {
      this.employees = this.barchartDataService.employees;
    } else {
      this.employees = this.barchartDataService.employees.filter(
        (emp) => emp.domain.toLowerCase() === this.selectedDomain.toLowerCase(),
      );
    }
    this.filterEmployees();
  }

  filterEmployees(): void {
    this.employees.forEach((emp) => {
      if (emp.status === 'Absent') {
        emp.machineStatus = 'OFF';
      }
    });

    this.filteredEmployees = this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);

      const statusMatch =
        this.selectedStatus === 'All' || emp.status === this.selectedStatus;

      return locationMatch && statusMatch;
    });
  }

  refresh(): void {
    this.loadEmployees();
  }

  back(): void {
    this.router.navigate(['/dashboard']);
  }

  downloadExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.filteredEmployees);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    XLSX.writeFile(workbook, `${this.selectedDomain}_Attendance.xlsx`);
  }

  downloadPdf(): void {
    const table = document.getElementById('AttendanceTable');

    if (!table) {
      return;
    }

    html2canvas(table).then((canvas) => {
      const img = canvas.toDataURL('image/png');

      const pdf = new jsPDF();

      const width = 190;

      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(img, 'PNG', 10, 10, width, height);

      pdf.save(`${this.selectedDomain}_Attendance.pdf`);
    });
  }
  get totalEmployees(): number {
    return this.filteredEmployees.length;
  }

  get presentEmployees(): number {
    return this.filteredEmployees.filter((emp) => emp.status === 'Present')
      .length;
  }

  get absentEmployees(): number {
    return this.filteredEmployees.filter((emp) => emp.status === 'Absent')
      .length;
  }

  get machineOnCount(): number {
    return this.filteredEmployees.filter((emp) => emp.machineStatus === 'ON')
      .length;
  }

  get machineOffCount(): number {
    return this.filteredEmployees.filter((emp) => emp.machineStatus === 'OFF')
      .length;
  }

  exportCurrentData(): void {
    this.downloadExcel();
  }

  printCurrentData(): void {
    this.downloadPdf();
  }
  toggleSelectAll(){
    if (this.allSelected) {
      this.selectedLocations = this.locationOptions.map(x => x.value);
    } else {
      this.selectedLocations = [];
    }
    this.filterEmployees();
  }
}
