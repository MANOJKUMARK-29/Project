import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { TableModule } from 'primeng/table';
import { RouterModule, Router } from '@angular/router';
import { BarchartdataservicesService } from '../services/barchartdataservices.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';


Chart.register(ChartDataLabels);

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [BaseChartDirective, TableModule, RouterModule],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.css',
})
export class BarchartComponent implements OnInit {
  public barChartPlugins = [ChartDataLabels];
  public pieChartPlugins = [ChartDataLabels];
  tableData: any[] = [];

  constructor(private router: Router, private barchartDataService: BarchartdataservicesService) { }

  // --------------------FILTER-FOR-EMPLOYEES----------------

  // ---------------------ON INIT FUNCTION----------------
  ngOnInit(): void {
     console.log(
  "BarchartComponent Domain:",
  this.barchartDataService.selectedDomain
);
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
     const locations = ['Medavakkam', 'shozinganallur', 'Karapakkam', 'Navallur','Tambaram','Adayar'];
    this.tableData = locations.map((location, index) => {
      const employees = employeeData.filter(emp => emp.location === location);

      const presentEmployees = employees.filter(emp => emp.status === 'Present').length;

      const absentEmployees = employees.filter(emp => emp.status === 'Absent').length;

      const MachineOff = employees.filter(emp => emp.machineStatus === 'OFF').length;

      const MachineOn = employees.filter(emp => emp.machineStatus === 'ON').length;

      this.myData.labels = this.tableData.map(row => row.Location);

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

    // --------------------DATA-LOAD-BARCHART------------

    this.myData.labels = this.tableData.map(row => row.Location);

    this.myData.datasets[0].data = this.tableData.map(row => row.MachineOn);

    this.myData.datasets[1].data = this.tableData.map(row => row.MachineOff);

    const presentCount = employeeData.filter(emp => emp.status === 'Present').length;

    const absentCount = employeeData.filter(emp => emp.status === 'Absent').length;

    this.pieChartData.datasets[0].data = [presentCount, absentCount];

    // ------------------------DATA-LOAD-FOR-PIECHART----------------

    const PresentCount = employeeData.filter(emp => emp.status === 'Present').length;

    const AbsentCount = employeeData.filter(emp => emp.status === 'Absent').length

    this.pieChartData.datasets[0].data = [PresentCount, AbsentCount];

  }

  //  ----------------BARCHART-DESIGN----------------

  // -------------------DATA-AND-LABELS----------------

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
  // ------------OPTIONS----------------
 public myOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    animations: {
      // `y` and `base` are pixel values. `from: 0` = canvas TOP (bars drop down).
      // Instead, start from the BOTTOM pixel of the chart so bars truly grow up.
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
    layout: {

    },
    plugins: {
      title: {
        display: true,
        text: '',
        color: '#222222',
        font: {
          size: 30,
          weight: 'bold',
        },

      },
      legend: {
        position: 'top',
        labels: {

          font: {
            size: 20,
            weight: 'bold',
          },
          color: 'black',
          padding: 10
        },
      },

      datalabels: {
        color: 'black',
        anchor: 'end',
        align: 'top',
        offset: 8,

        font: {
          weight: 'bold',
          size: 12,
        },

        padding: {
          top: 5,
          bottom: -10,
        },

        formatter: (value: number | string, context: any) => {
          if (context.datasetIndex !== 1) {
            return '';
          }

          const on = context.chart.data.datasets?.[0]?.data?.[context.dataIndex];
          const off = context.chart.data.datasets?.[1]?.data?.[context.dataIndex];
          return on + off;
        },
      },
    },

    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            weight: 'bold',
            size: 10,
          },
        },
        title: {
          display: true,
          font: {
            size: 20,
            weight: 'bold',
          },
          text: 'Location',
          color: 'rgb(7, 7, 7)',
        },
        grid: {
          color: 'rgb(8, 8, 8)',
        },
      },

      y: {
        stacked: true,
        suggestedMax: 15,
        title: {
          display: true,
          color: 'rgba(255, 0, 0, 0.25)',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
  };

  //  --------------------PIECHART-------------------
  // ---------------------DATA-AND-LABELS----------------
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

  //  -------------------OPTIONS----------------
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {

      title: {
        display: true,
        text: '',
        font: {
          size: 32,
          weight: 'bold',
        },
        color: '#020202',
      },
      legend: {

        display: true,
        labels: {

          font: {
            size: 20,
          },
        },
      },
      datalabels: {

        color: 'black',
        font: {
          weight: 'bold',
          size: 20,
        },
        formatter: (value: unknown) => String(value),
      },

    },
  }

  //  -----------PIECHART CLICK EVENT----------------
  onPiechartClick(event: any) {

  if (!event.active || event.active.length === 0) {
    return;
  }

  const index = event.active[0].index;

  const label =
    this.pieChartData.labels?.[index] as
    'Present' | 'Absent';

  this.barchartDataService.selectedstatus = label;

  this.router.navigate([
    '/attendance'
  ]);

}
  // -------------------------BARCHART-PDF---------------------
downloadBarPdf() {
  const BarchartCanvas = document.getElementById('barChart');

  if (!BarchartCanvas) return;

  html2canvas(BarchartCanvas as HTMLElement)
    .then(canvas => {
      const imageWidth = 260;
      const imageHeight = (canvas.height  * imageWidth) / canvas.width;
      const image = canvas.toDataURL('image/png');

      const pdf = new jsPDF('landscape');
      pdf.addImage(image, 'PNG', 10, 10, imageWidth, imageHeight);
      pdf.save('BarChart.pdf');
    })
}
// --------------------PIECHART-PDF-----------------
downloadPiePdf() {

  const PiechartCanvas = document.getElementById('pieChart');

  if (!PiechartCanvas) return;

  html2canvas(PiechartCanvas).then(canvas => {

    const imageWidth = 200;
    const imageHeight = canvas.height * imageWidth / canvas.width;

    const image = canvas.toDataURL('image/png');

    const pdf = new jsPDF();

    pdf.addImage(image, 'PNG', 10, 10, imageWidth, imageHeight);

    pdf.save('PieChart.pdf');

  });
}

// -------------------------TABLE-XL-----------------------
downloadTableExcel() {

  const worksheet = XLSX.utils.json_to_sheet(this.tableData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

  XLSX.writeFile(workbook, 'Attendance.xlsx');

}

downloadTabPdf() {

  const TablepTable = document.getElementById('tableXl');

  if (!TablepTable) return;

  html2canvas(TablepTable).then(canvas => {

    const imageWidth = 200;
    const imageHeight = canvas.height * imageWidth / canvas.width;

    const image = canvas.toDataURL('image/png');

    const pdf = new jsPDF();

    pdf.addImage(image, 'PNG', 10, 10, imageWidth, imageHeight);

    pdf.save('Attendance.pdf');

  });
}
}
