import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RouterModule, Router } from '@angular/router';
import { BarchartdataservicesService } from '../services/barchartdataservices.service';
import { LoadingService } from '../services/loading.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  NgApexchartsModule,

} from 'ng-apexcharts';

export type machineStausChart = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  grid: ApexGrid;
  title: ApexTitleSubtitle;

};
export type attendanceStatus = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
};

export type WaterConsumption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  grid: ApexGrid;
}

export type waterQuantity = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  grid: ApexGrid;
}


@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [NgIf, TableModule, RouterModule, NgApexchartsModule],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.css',
})
export class BarchartComponent implements OnInit {
  tableData: any[] = [];
  chartReady = false;
  pdfVar: string = '';
  today: string = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  // Download state flags
  isGeneratingBarPdf: boolean = false;
  isGeneratingPiePdf: boolean = false;
  isGeneratingTablePdf: boolean = false;
  isGeneratingExcel: boolean = false;
  isWaterDataLoaded: boolean = false;

  dataForDate: any = {
    '2026-09-24': {
      type1: [21000, 11000, 12000, 28000, 14000, 39000, 22000],
      type2: [19000, 10000, 13000, 18000, 19000, 16000, 14000]
    },
    '2026-09-21': {
      type1: [23000, 14000, 15000, 31000, 12000, 42000, 24000],
      type2: [21000, 12000, 15000, 21000, 21000, 19000, 16000]
    },
    '2026-09-22': {
      type1: [18000, 13000, 11000, 25000, 16000, 35000, 20000],
      type2: [17000, 11000, 14000, 19000, 18000, 17000, 15000]
    },
    '2026-09-23': {
      type1: [23455, 12446, 12444, 31241, 12441, 42144, 24322],
      type2: [21244, 12423, 15421, 21441, 21244, 19412, 16442]
    }
  };

  dataForDateWater: any = {
    '2026-09-24': {
      type1: [50, 60, 70, 80, 90, 100],
      type2: [50, 60, 70, 80, 90, 100]
    },
    '2026-09-21': {
      type1: [43, 32, 26, 38, 45, 53, 29],
      type2: [41, 39, 28, 31, 24, 49, 37]
    },
    '2026-09-22': {
      type1: [21, 13, 11, 25, 16, 35, 20],
      type2: [17, 11, 14, 19, 18, 17, 15]
    },
    '2026-09-23': {
      type1: [56, 23, 22, 34, 22, 52, 31],
      type2: [45, 22, 21, 41, 43, 22, 20]
    }
  };


 

  constructor(private router: Router, public barchartDataService: BarchartdataservicesService, private loadingService: LoadingService) { }


  ngOnInit(): void {
    // this.selectedArea = this.barchartDataService.selectedArea;
    console.log(
      "BarchartComponent Domain:",
      this.barchartDataService.selectedDomain
    );

    this.barchartDataService.fetchEmployees().subscribe({
      next: () => {
        this.processEmployeeData();
      },
      error: (err) => {
        console.error('Failed to fetch employees:', err);
      }
    });
  }

  processEmployeeData(): void {
    let employeeData;
    if (this.barchartDataService.selectedDomain === 'All') {

      employeeData = this.barchartDataService.employees;

    } else {

      employeeData = this.barchartDataService.employees.filter(
        emp =>
          emp.domain.toUpperCase() ===
          this.barchartDataService.selectedDomain.toUpperCase()
      );

    }
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
      }
    });


    this.machineStausChart.series = [
      {
        name: 'MachineOn',
        data: this.tableData.map(row => row.MachineOn)
      },
      {
        name: 'MachineOff',
        data: this.tableData.map(row => row.MachineOff)
      },
    ];
    this.machineStausChart.xaxis = {
      categories: this.tableData.map(row => row.Location)
    };

    const PresentCount = employeeData.filter(emp => emp.status === 'Present').length;
    const AbsentCount = employeeData.filter(emp => emp.status === 'Absent').length
    this.attendanceStatus.series = [PresentCount, AbsentCount]

    setTimeout(() => {
      this.chartReady = true;
    }, 0);
  }

  public machineStausChart: Partial<machineStausChart> = {
    series: [
      {
        name: "MachineOn",
        data: [],
      },
      {
        name: 'MachineOff',
        data: [],
      }],

    colors: ['#4033fcff', '#fa8e13ff'],
    chart: {
      type: 'bar',
      height: '350',
      toolbar: {
        show: false,
      }
    },
    title: {
      text: 'Machine Status (On/Off)',
      align: 'center',
      style: {
        fontSize: '15px',
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '35%',
        dataLabels: {
          position: 'top',

        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: any) => {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['black']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Medavakkam', 'Shozhinagnallur', 'Karapakkam', 'Navaluur', 'Tambaram', 'Adayar']
    },
    yaxis: {
      title: {
        text: 'Employees Count'
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: any) => {
          return val + 'Employees'
        }
      }
    }
  }


  public waterConsumption: Partial<WaterConsumption> = {
    series: [
      {
        name: "Type1",
        data: [],
      },
      {
        name: 'Type2',
        data: [],
      }],
    colors: ['#fa914bff', '#e737f7ff'],
    chart: {
      type: 'bar',
      height: '350',
      toolbar: {
        show: true,
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        dataLabels: {
          position: 'top',
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: any) => {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['black']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Medavakkam', 'Shozhinagnallur', 'Karapakkam', 'Navaluur', 'Tambaram', 'Adayar', 'Kelambakkam']
    },
    yaxis: {
      title: {
        text: 'Energy (kWh)'
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: any) => {
          return val + 'kWh used'
        }
      }
    }
  }

  public waterQuantity: Partial<waterQuantity> = {
    series: [
      {
        name: "Type1",
        data: [],
      },
      {
        name: 'Type2',
        data: [],
      }],
    colors: ['#52f74cff', '#fa4289ff'],
    chart: {
      type: 'bar',
      height: '350',
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '55%',
        dataLabels: {
          position: 'top',
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: any) => {
        return val;
      },
      offsetX: 20,
      style: {
        fontSize: '12px',
        colors: ['black']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Medavakkam', 'Shozhinagnallur', 'Karapakkam', 'Navaluur', 'Tambaram', 'Adayar', 'Kelambakkam']
    },
    yaxis: {
      title: {
        text: 'Water (Litre)'
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: any) => {
          return val + 'Litre used'
        }
      }
    }
  }

  public attendanceStatus: Partial<attendanceStatus> = {
    series: [],
    colors: ['#61dbb3ff', '#f58787ff'],
    chart: {
      type: 'pie',
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const index = config ?. dataPointIndex;
          if (index === undefined || index < 0) return;
          const label = this.attendanceStatus.labels?.[index] as 'Present' | 'Absent';
          this.barchartDataService.selectedstatus = label;
          this.router.navigate(['/attendance'])
          this.loadingService.hide();
         }
       },
      height: '350',
      width: '350',
      
      toolbar: {
        show: true,
      },
     
      
    },
    labels: ['Present', 'Absent'],
    title: {
      text: 'Overall Attendence',
      align: 'center',
      style: {
        fontSize: '15px',
      }
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -40,
        },
      },
    },
    responsive: [
      {
        breakpoint: 580,
        options: {
          width: 400,
        }
      }
    ],
    tooltip: {
      y: {
        formatter: (val: any) => {
          return val
        }
      }
    }
  }

  searchData(date: string) {
    if (!date) return;
    if (date > this.today) {
      alert('Future dates cannot be selected');
      return;
    }
    const pickedDate = this.dataForDate[date];
    const waterData = this.dataForDateWater[date];

    if (!pickedDate) {
      this.isWaterDataLoaded = false;
      alert('i didnt add data for this data');
      return;
    }
    this.waterConsumption.series = [
      {
        name: 'Type1',
        data: pickedDate.type1
      },
      {
        name: 'Type2',
        data: pickedDate.type2
      }
    ];
    this.waterQuantity.series = [
      {
        name: 'type1',
        data: waterData.type1
      },
      {
        name: 'type2',
        data: waterData.type2
      }
    ];
    this.isWaterDataLoaded = true;

  }


  downloadBarPdf() {
    if (this.isGeneratingBarPdf) return;
    this.isGeneratingBarPdf = true;

    if (this.barchartDataService.selectedArea === 'Voltas') {
      this.pdfVar = 'barChart';
    } else {
      this.pdfVar = 'Area1chart';
    }
    const BarchartApx = document.getElementById(this.pdfVar);

    if (!BarchartApx) {
      this.isGeneratingBarPdf = false;
      return;
    }

    setTimeout(() => {
      html2canvas(BarchartApx as HTMLElement, { scale: 2, useCORS: true })
        .then(canvas => {
          const PDF = new jsPDF('landscape', 'mm', 'a2', true);
          const pageWidth = PDF.internal.pageSize.getWidth();

          const FILEURI = canvas.toDataURL('image/png');
          const fileWidth = pageWidth - 20;
          const fileHeight = (canvas.height * fileWidth) / canvas.width;

          PDF.addImage(FILEURI, 'PNG', 10, 22, fileWidth, fileHeight);
          PDF.save('BarChart.pdf');
          this.isGeneratingBarPdf = false;
        })
        .catch((err) => {
          console.error(err);
          this.isGeneratingBarPdf = false;
        });
    }, 500);
  }


  downloadPiePdf() {
    if (this.isGeneratingPiePdf) return;
    this.isGeneratingPiePdf = true;

    const PiechartApx = document.getElementById('pieChart');

    if (!PiechartApx) {
      this.isGeneratingPiePdf = false;
      return;
    }

    setTimeout(() => {
      html2canvas(PiechartApx as HTMLElement, { scale: 2, useCORS: true }).then(canvas => {

        const PDF = new jsPDF('portrait', 'mm', 'a2', true);
        const pageWidth = PDF.internal.pageSize.getWidth();

        const FILEURI = canvas.toDataURL('image/png');
        const fileWidth = pageWidth - 20;
        const fileHeight = (canvas.height * fileWidth) / canvas.width;

        PDF.setFontSize(34);
        PDF.text('Attendance Status', pageWidth / 2, 15, { align: 'center' });

        PDF.addImage(FILEURI, 'PNG', 10, 22, fileWidth, fileHeight);
        PDF.save('PieChart.pdf');
        this.isGeneratingPiePdf = false;

      })
        .catch((err) => {
          console.error(err);
          this.isGeneratingPiePdf = false;
        });
    }, 500);
  }

  downloadTableExcel() {
    if (this.isGeneratingExcel) return;
    this.isGeneratingExcel = true;

    const worksheet = XLSX.utils.json_to_sheet(this.tableData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'Attendance.xlsx');
    
    setTimeout(() => {
      this.isGeneratingExcel = false;
    }, 500);
  }

  downloadTabPdf() {
    if (this.isGeneratingTablePdf) return;
    this.isGeneratingTablePdf = true;

    const TablepTable = document.getElementById('tableXl');

    if (!TablepTable) {
      this.isGeneratingTablePdf = false;
      return;
    }

    html2canvas(TablepTable, { scale: 2, useCORS: true }).then(canvas => {

      const imageWidth = 200;
      const imageHeight = canvas.height * imageWidth / canvas.width;
      const image = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      pdf.addImage(image, 'PNG', 10, 10, imageWidth, imageHeight);
      pdf.save('Attendance.pdf');
      this.isGeneratingTablePdf = false;

    }).catch((err) => {
      console.error(err);
      this.isGeneratingTablePdf = false;
    });
  }
}
