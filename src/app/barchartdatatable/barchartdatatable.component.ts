import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
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
  // DATA PROPERTIES
  employees: EmployeeData[] = [];              // All employees for selected domain
  filteredEmployees: EmployeeData[] = [];      // Filtered employees for display
  // FILTER STATE
  allSelected = false;                         // Select all locations checkbox
  selectedLocation = 'All';                    // Single location filter (legacy)
  selectedLocations: string[] = [];            // Multi-select location filter
  selectedStatus: 'All' | 'Present' | 'Absent' = 'All';  // Status filter
  selectedDomain = '';                         // Current domain from service
  searchTerm = '';                             // Global search term

  // EXPORT STATE
  isGeneratingPdf = false;                     // PDF generation loading state
  isGeneratingExcel = false;                   // Excel generation loading state
  tooltipPosition: 'top' | 'bottom' = 'top';   // Responsive tooltip position

  // FILTER OPTIONS
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

  // CONSTRUCTOR
  constructor(
    private router: Router,
    private barchartDataService: BarchartdataservicesService,
  ) { }

  // LIFECYCLE HOOKS
  ngOnInit(): void {
    this.selectedDomain = this.barchartDataService.selectedDomain;
    this.selectedStatus = this.barchartDataService.selectedstatus ?? 'All';
    this.updateTooltipPosition();
    this.loadEmployees();
  }


  // RESPONSIVE TOOLTIP POSITIONING

  @HostListener('window:resize')
  onResize(): void {
    this.updateTooltipPosition();
  }


  updateTooltipPosition(): void {
    this.tooltipPosition = window.innerWidth <= 768 ? 'bottom' : 'top';
  }


  // DATA LOADING

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


  // FILTERING LOGIC

  filterEmployees(): void {
    // Absent employees have machine OFF
    this.employees.forEach((emp) => {
      if (emp.status === 'Absent') {
        emp.machineStatus = 'OFF';
      }
    });

    // Filter by location and status
    const locationStatusFiltered = this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);

      const statusMatch =
        this.selectedStatus === 'All' || emp.status === this.selectedStatus;

      return locationMatch && statusMatch;
    });

    // Apply search filter (only if term >= 3 chars)
    this.filteredEmployees = this.searchTerm.length < 3
      ? locationStatusFiltered
      : locationStatusFiltered.filter((emp) => {
        return (
          emp.id.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.domain.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.machineStatus.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.status.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
  }


  // NAVIGATION

  refresh(): void {
    this.loadEmployees();
  }

  back(): void {
    this.router.navigate(['/dashboard']);
  }


  // EXPORT FUNCTIONS


  // ------------------------- EXCEL EXPORT -------------------------
  async downloadTableExcel(): Promise<void> {
    if (this.isGeneratingExcel) return;
    this.isGeneratingExcel = true;

    try {
      const worksheet = XLSX.utils.json_to_sheet(this.filteredEmployees);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
      XLSX.writeFile(workbook, 'Attendance.xlsx');

      // Show spinner for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    } finally {
      this.isGeneratingExcel = false;
    }
  }

  // ------------------------- PDF EXPORT -------------------------
  async downloadPdf(): Promise<void> {
    if (this.isGeneratingPdf) return;
    this.isGeneratingPdf = true;

    const TablepTable = document.getElementById('AttendanceTable');
    if (!TablepTable) {
      this.isGeneratingPdf = false;
      return;
    }

    try {
      await html2canvas(TablepTable).then(canvas => {
        const imageWidth = 180;
        const imageHeight = canvas.height * imageWidth / canvas.width;
        const image = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        pdf.addImage(image, 'PNG', 10, 10, imageWidth, imageHeight);
        pdf.save('Attendance.pdf');
      });
      // Show spinner for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  // COMPUTED PROPERTIES (Summary Cards)

  get totalEmployees(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      const statusMatch =
        this.selectedStatus === 'All' || emp.status === this.selectedStatus;
      return locationMatch && statusMatch;
    }).length;
  }

  get presentEmployees(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      const statusMatch = emp.status === 'Present';
      return locationMatch && statusMatch;
    }).length;
  }

  get absentEmployees(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      const statusMatch = emp.status === 'Absent';
      return locationMatch && statusMatch;
    }).length;
  }

  get machineOnCount(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      return locationMatch && emp.machineStatus === 'ON';
    }).length;
  }

  get machineOffCount(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      return locationMatch && emp.machineStatus === 'OFF';
    }).length;
  }


  // TOOLBAR ACTIONS

  exportCurrentData(): void {
    this.downloadTableExcel();
  }

  printCurrentData(): void {
    this.downloadPdf();
  }


  // MULTI-SELECT HELPER

  /**
   * Toggles all locations in multi-select
   */
  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedLocations = this.locationOptions.map(x => x.value);
    } else {
      this.selectedLocations = [];
    }
    this.filterEmployees();
  }
}
