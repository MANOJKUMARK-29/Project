// ============================================================================
// BARCHART COMPONENT
// ============================================================================
// Displays bar chart (Machine ON/OFF), pie chart (Present/Absent), and data table
// with export functionality (PDF/Excel) for attendance reports
// ============================================================================

import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { TableModule } from 'primeng/table';
import { RouterModule, Router } from '@angular/router';
import { BarchartdataservicesService } from '../services/barchartdataservices.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

// Register Chart.js plugin for data labels
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [BaseChartDirective, TableModule, RouterModule, CommonModule],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.css',
})
export class BarchartComponent implements OnInit {

  // ---------------------------------------------------------------------------
  // CHART PLUGINS
  // ---------------------------------------------------------------------------
  public barChartPlugins = [ChartDataLabels];
  public pieChartPlugins = [ChartDataLabels];

  // ---------------------------------------------------------------------------
  // COMPONENT STATE
  // ---------------------------------------------------------------------------
  tableData: any[] = [];                    // Table data for attendance report
  isGeneratingBarPdf = false;               // Loading state for bar chart PDF
  isGeneratingPiePdf = false;               // Loading state for pie chart PDF
  isGeneratingTabPdf = false;               // Loading state for table PDF
  isGeneratingExcel = false;   
  isBarChartLoading = true;                 // Loading state for bar chart
  isPieChartLoading = true;                 // Loading state for pie chart
  isTableLoading = true;                    // Loading state for table
  tooltipPosition: 'top' | 'bottom' = 'top'; // Tooltip position (responsive)

  // ---------------------------------------------------------------------------
  // CONSTRUCTOR
  // ---------------------------------------------------------------------------
  constructor(
    private router: Router,
    private barchartDataService: BarchartdataservicesService
  ) { }

  // ---------------------------------------------------------------------------
  // RESPONSIVE TOOLTIP POSITIONING
  // ---------------------------------------------------------------------------
  @HostListener('window:resize')
  onResize(): void {
    this.updateTooltipPosition();
  }

  /**
   * Updates tooltip position based on screen width
   * - Desktop (>768px): tooltip above button
   * - Mobile (≤768px): tooltip below button
   */
  updateTooltipPosition(): void {
    this.tooltipPosition = window.innerWidth <= 768 ? 'bottom' : 'top';
  }

  // ---------------------------------------------------------------------------
  // LIFECYCLE HOOKS
  // ---------------------------------------------------------------------------
  ngOnInit(): void {
    this.updateTooltipPosition();
    console.log('BarchartComponent Domain:', this.barchartDataService.selectedDomain);

    // Start independent 5-second loaders for each section
    setTimeout(() => {
      this.loadBarChartData();
    }, 5000);

    setTimeout(() => {
      this.loadPieChartData();
    }, 5000);

    setTimeout(() => {
      this.loadTableData();
    }, 5000);
  }

  // -------------------------------------------------------------------------
  // FILTER EMPLOYEES BY SELECTED DOMAIN (shared helper)
  // -------------------------------------------------------------------------
  private getFilteredEmployees(): any[] {
    if (this.barchartDataService.selectedDomain === 'All') {
      return this.barchartDataService.employees;
    } else {
      return this.barchartDataService.employees.filter(
        emp => emp.domain.toUpperCase() === this.barchartDataService.selectedDomain.toUpperCase()
      );
    }
  }

  // -------------------------------------------------------------------------
  // LOAD BAR CHART DATA
  // -------------------------------------------------------------------------
  private loadBarChartData(): void {
    const employeeData = this.getFilteredEmployees();

    const locations = ['Medavakkam', 'shozinganallur', 'Karapakkam', 'Navallur', 'Tambaram', 'Adayar'];
    this.tableData = locations.map((location, index) => {
      const employees = employeeData.filter(emp => emp.location === location);

      const presentEmployees = employees.filter(emp => emp.status === 'Present').length;
      const absentEmployees = employees.filter(emp => emp.status === 'Absent').length;
      const MachineOff = employees.filter(emp => emp.machineStatus === 'OFF').length;
      const MachineOn = employees.filter(emp => emp.machineStatus === 'ON').length;

      return {
        SNo: index + 1,
        Location: location,
        MachineOn: MachineOn,
        MachineOff: MachineOff,
        PresentEmployees: presentEmployees,
        AbsentEmployees: absentEmployees,
        totalEmployees: employees.length
      };
    });

    this.myData.labels = this.tableData.map(row => row.Location);
    this.myData.datasets[0].data = this.tableData.map(row => row.MachineOn);
    this.myData.datasets[1].data = this.tableData.map(row => row.MachineOff);

    this.isBarChartLoading = false;
  }

  // -------------------------------------------------------------------------
  // LOAD PIE CHART DATA
  // -------------------------------------------------------------------------
  private loadPieChartData(): void {
    const employeeData = this.getFilteredEmployees();

    const presentCount = employeeData.filter(emp => emp.status === 'Present').length;
    const absentCount = employeeData.filter(emp => emp.status === 'Absent').length;
    this.pieChartData.datasets[0].data = [presentCount, absentCount];

    this.isPieChartLoading = false;
  }

  // -------------------------------------------------------------------------
  // LOAD TABLE DATA
  // -------------------------------------------------------------------------
  private loadTableData(): void {
    const employeeData = this.getFilteredEmployees();

    const locations = ['Medavakkam', 'shozinganallur', 'Karapakkam', 'Navallur', 'Tambaram', 'Adayar'];
    this.tableData = locations.map((location, index) => {
      const employees = employeeData.filter(emp => emp.location === location);

      const presentEmployees = employees.filter(emp => emp.status === 'Present').length;
      const absentEmployees = employees.filter(emp => emp.status === 'Absent').length;
      const MachineOff = employees.filter(emp => emp.machineStatus === 'OFF').length;
      const MachineOn = employees.filter(emp => emp.machineStatus === 'ON').length;

      return {
        SNo: index + 1,
        Location: location,
        MachineOn: MachineOn,
        MachineOff: MachineOff,
        PresentEmployees: presentEmployees,
        AbsentEmployees: absentEmployees,
        totalEmployees: employees.length
      };
    });

    this.isTableLoading = false;
  }

  // ---------------------------------------------------------------------------
  // BAR CHART CONFIGURATION
  // ---------------------------------------------------------------------------
  // ------------------- DATA AND LABELS ------------------
  public myData: ChartConfiguration<'bar'>['data'] = {
    labels: this.tableData.map(row => row.Location),
    datasets: [
      {
        label: 'ON',
        backgroundColor: 'rgb(0, 255, 13)',
        data: this.tableData.map(row => row.MachineOn),
        stack: 'a',
        categoryPercentage: 0.7,
        barPercentage: 0.9,
        maxBarThickness: 80
      },
      {
        label: 'OFF',
        backgroundColor: 'rgb(255, 0, 0)',
        data: this.tableData.map(row => row.MachineOff),
        stack: 'a',
        categoryPercentage: 0.7,
        barPercentage: 0.9,
        maxBarThickness: 80
      },
    ],
  };

  // ------------------- OPTIONS ------------------
  public myOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    animations: {
      // Bars grow from bottom (base) instead of top
      y: {
        from: (ctx: any) => ctx.chart.scales.y.getPixelForValue(0),
        duration: 1000,
        easing: 'easeOutQuart',
      },
      base: {
        from: (ctx: any) => ctx.chart.scales.y.getPixelForValue(0),
        duration: 1000,
        easing: 'easeOutQuart',
      },
    },
    layout: {},
    plugins: {
      title: {
        display: true,
        text: '',
        color: '#222222',
        font: { size: 30, weight: 'bold' },
      },
      legend: {
        position: 'top',
        labels: {
          font: { size: 20, weight: 'bold' },
          color: 'black',
          padding: 10
        },
      },
      datalabels: {
        color: 'black',
        anchor: 'end',
        align: 'top',
        offset: 8,
        font: { weight: 'bold', size: 12 },
        padding: { top: 5, bottom: -10 },
        formatter: (value: number | string, context: any) => {
          // Only show total on OFF dataset (index 1)
          if (context.datasetIndex !== 1) return '';
          const on = context.chart.data.datasets?.[0]?.data?.[context.dataIndex];
          const off = context.chart.data.datasets?.[1]?.data?.[context.dataIndex];
          return on + off;
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { font: { weight: 'bold', size: 10 } },
        title: {
          display: true,
          font: { size: 20, weight: 'bold' },
          text: 'Location',
          color: 'rgb(7, 7, 7)',
        },
        grid: { color: 'rgb(8, 8, 8)' },
      },
      y: {
        stacked: true,
        suggestedMax: 15,
        title: { display: true, color: 'rgba(255, 0, 0, 0.25)' },
        grid: { display: true, color: 'rgba(0, 0, 0, 0.25)' },
      },
    },
  };

  // ---------------------------------------------------------------------------
  // PIE CHART CONFIGURATION
  // ---------------------------------------------------------------------------
  // ------------------- DATA AND LABELS ------------------
  public pieChartType: ChartConfiguration<'pie'>['type'] = 'pie';

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#00ff1e', '#fe1100'],
      },
    ],
  };

  // ------------------- OPTIONS ------------------
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '',
        font: { size: 32, weight: 'bold' },
        color: '#020202',
      },
      legend: {
        display: true,
        labels: { font: { size: 20 } },
      },
      datalabels: {
        color: 'black',
        font: { weight: 'bold', size: 20 },
        formatter: (value: unknown) => String(value),
      },
    },
  };

  // ---------------------------------------------------------------------------
  // PIE CHART CLICK EVENT
  // ---------------------------------------------------------------------------
  /**
   * Navigates to attendance page with selected status filter
   * when user clicks on pie chart segment
   */
  onPiechartClick(event: any): void {
    if (!event.active || event.active.length === 0) return;

    const index = event.active[0].index;
    const label = this.pieChartData.labels?.[index] as 'Present' | 'Absent';

    this.barchartDataService.selectedstatus = label;
    this.router.navigate(['/attendance']);
  }

  // ---------------------------------------------------------------------------
  // EXPORT FUNCTIONS
  // ---------------------------------------------------------------------------

  // ------------------------- BAR CHART PDF -------------------------
  async downloadBarPdf(): Promise<void> {
    if (this.isGeneratingBarPdf) return;
    this.isGeneratingBarPdf = true;

    const BarchartCanvas = document.getElementById('barChart');
    if (!BarchartCanvas) {
      this.isGeneratingBarPdf = false;
      return;
    }

    try {
      await html2canvas(BarchartCanvas as HTMLElement).then(canvas => {
        const imageWidth = 260;
        const imageHeight = (canvas.height * imageWidth) / canvas.width;
        const image = canvas.toDataURL('image/png');

        const pdf = new jsPDF('landscape');
        pdf.addImage(image, 'PNG', 10, 10, imageWidth, imageHeight);
        pdf.save('BarChart.pdf');
      });
      // Show spinner for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    } finally {
      this.isGeneratingBarPdf = false;
    }
  }

  // ------------------------- PIE CHART PDF -------------------------
  async downloadPiePdf(): Promise<void> {
    if (this.isGeneratingPiePdf) return;
    this.isGeneratingPiePdf = true;

    const PiechartCanvas = document.getElementById('pieChart');
    if (!PiechartCanvas) {
      this.isGeneratingPiePdf = false;
      return;
    }

    try {
      await html2canvas(PiechartCanvas).then(canvas => {
        const imageWidth = 200;
        const imageHeight = canvas.height * imageWidth / canvas.width;
        const image = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        pdf.addImage(image, 'PNG', 10, 10, imageWidth, imageHeight);
        pdf.save('PieChart.pdf');
      });
      // Show spinner for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    } finally {
      this.isGeneratingPiePdf = false;
    }
  }

  // ------------------------- TABLE EXCEL -------------------------
  async downloadTableExcel(): Promise<void> {
    if (this.isGeneratingExcel) return;
    this.isGeneratingExcel = true;

    try {
      const worksheet = XLSX.utils.json_to_sheet(this.tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
      XLSX.writeFile(workbook, 'Attendance.xlsx');

      // Show spinner for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    } finally {
      this.isGeneratingExcel = false;
    }
  }

  // ------------------------- TABLE PDF -------------------------
  async downloadTabPdf(): Promise<void> {
    if (this.isGeneratingTabPdf) return;
    this.isGeneratingTabPdf = true;

    const TablepTable = document.getElementById('tableXl');
    if (!TablepTable) {
      this.isGeneratingTabPdf = false;
      return;
    }

    try {
      await html2canvas(TablepTable).then(canvas => {
        const imageWidth = 200;
        const imageHeight = canvas.height * imageWidth / canvas.width;
        const image = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        pdf.addImage(image, 'PNG', 10, 10, imageWidth, imageHeight);
        pdf.save('Attendance.pdf');
      });
      // Show spinner for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    } finally {
      this.isGeneratingTabPdf = false;
    }
  }
}
