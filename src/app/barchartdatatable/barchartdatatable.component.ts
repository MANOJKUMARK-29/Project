import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { Router } from "@angular/router";
import { ChipModule } from "primeng/chip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import {
  BarchartdataservicesService,
  EmployeeData,
} from "../services/barchartdataservices.service";
import { LoadingService } from "../services/loading.service";

@Component({
  selector: "app-barchartdatatable",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    MultiSelectModule,
    CheckboxModule,
    ChipModule,
  ],
  templateUrl: "./barchartdatatable.component.html",
  styleUrl: "./barchartdatatable.component.css",
})
export class BarchartdatatableComponent implements OnInit {
  employees: EmployeeData[] = [];

  filteredEmployees: EmployeeData[] = [];
  allSelected = false;
  selectedLocation = "All";
  selectedLocations: string[] = [];

  selectedStatus: "All" | "Present" | "Absent" = "All";

  selectedDomain = "";

  searchTerm = "";

  locationOptions = [
    { label: "Medavakkam", value: "Medavakkam" },
    { label: "shozinganallur", value: "shozinganallur" },
    { label: "Karapakkam", value: "Karapakkam" },
    { label: "Navallur", value: "Navallur" },
    { label: "Tambaram", value: "Tambaram" },
    { label: "Adayar", value: "Adayar" },
  ];

  locations = [
    "All",
    "Medavakkam",
    "shozinganallur",
    "Karapakkam",
    "Navallur",
    "Tambaram",
    "Adayar",
  ];

  tableData: any[] = [];
  chartReady = false;

  constructor(
    private router: Router,
    private barchartDataService: BarchartdataservicesService,
    private loadingService: LoadingService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.selectedDomain = this.barchartDataService.selectedDomain;

    this.selectedStatus = this.barchartDataService.selectedstatus ?? "All";

    const clientId = localStorage.getItem("clientId") || 101;
    try {
      const data: any = await this.barchartDataService.getEmployees(clientId);
      this.barchartDataService.employees = data;
      this.loadEmployees();
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
    this.loadingService.hide();
  }

  loadEmployees(): void {
    if (this.selectedDomain === "All") {
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
      if (emp.status === "Absent") {
        emp.machineStatus = "OFF";
      }
    });

    const locationStatusFiltered = this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);

      const statusMatch =
        this.selectedStatus === "All" || emp.status === this.selectedStatus;

      return locationMatch && statusMatch;
    });

    this.filteredEmployees =
      this.searchTerm.length < 3
        ? locationStatusFiltered
        : locationStatusFiltered.filter((emp) => {
            return (
              emp.id
                .toString()
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase()) ||
              emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              (emp.role &&
                emp.role
                  .toLowerCase()
                  .includes(this.searchTerm.toLowerCase())) ||
              emp.domain
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase()) ||
              emp.location
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase()) ||
              emp.machineStatus
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase()) ||
              emp.status.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
          });
  }

  refresh(): void {
    this.loadEmployees();
  }

  back(): void {
    this.router.navigate(["/dashboard"]);
  }

  downloadExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.filteredEmployees);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, `${this.selectedDomain}_Attendance.xlsx`);
  }

  downloadPdf() {
    const table = document.getElementById("AttendanceTable");

    if (!table) return;

    setTimeout(() => {
      html2canvas(table as HTMLElement, { scale: 2, useCORS: true })
        .then((canvas) => {
          const PDF = new jsPDF("landscape", "mm", "a2", true);
          const pageWidth = PDF.internal.pageSize.getWidth();

          const FILEURI = canvas.toDataURL("image/png");
          const fileWidth = pageWidth - 20;
          const fileHeight = (canvas.height * fileWidth) / canvas.width;

          PDF.setFontSize(24);
          PDF.text("Attendace Data", pageWidth / 2, 15, { align: "center" });

          PDF.addImage(FILEURI, "PNG", 10, 22, fileWidth, fileHeight);
          PDF.save("attendancetable.pdf");
        })
        .catch(() => {});
    }, 500);
  }
  get totalEmployees(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      const statusMatch =
        this.selectedStatus === "All" || emp.status === this.selectedStatus;
      return locationMatch && statusMatch;
    }).length;
  }

  get presentEmployees(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      const statusMatch = emp.status === "Present";
      return locationMatch && statusMatch;
    }).length;
  }

  get absentEmployees(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      const statusMatch = emp.status === "Absent";
      return locationMatch && statusMatch;
    }).length;
  }

  get machineOnCount(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      return locationMatch && emp.machineStatus === "ON";
    }).length;
  }

  get machineOffCount(): number {
    return this.employees.filter((emp) => {
      const locationMatch =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.includes(emp.location);
      return locationMatch && emp.machineStatus === "OFF";
    }).length;
  }

  exportCurrentData(): void {
    this.downloadExcel();
  }

  printCurrentData(): void {
    this.downloadPdf();
  }
  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedLocations = this.locationOptions.map((x) => x.value);
    } else {
      this.selectedLocations = [];
    }
    this.filterEmployees();
  }
  removeLocation(value: string, event: Event): void {
    this.selectedLocations = this.selectedLocations.filter(
      (loc) => loc !== value,
    );
    this.filterEmployees();
  }
}
