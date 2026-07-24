import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartData } from 'chart.js';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [BaseChartDirective, TableModule],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.css',
})
export class BarchartComponent {
  tableData = [
    {
      sNo: 1,
      Location: 'Medavakkam',
      MachineOn: 16,
      MachineOff: 14,
      present: 16,
      absent: 14,
      totalEmployees: 120,
    },
    {
      sNo: 1,
      Location: 'shozinganallur',
      MachineOn: 22,
      MachineOff: 8,
      present: 16,
      absent: 14,
      totalEmployees: 120,
    },
    {
      sNo: 1,
      Location: 'Karapakkam',
      MachineOn: 30,
      MachineOff: 0,
      present: 16,
      absent: 14,
      totalEmployees: 120,
    },
    {
      sNo: 1,
      Location: 'Navallur',
      MachineOn: 5,
      MachineOff: 25,
      present: 16,
      absent: 14,
      totalEmployees: 120,
    },
  ];

  public myData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Medavakkam', 'shozinganallur', 'Karapakkam', 'Navallur'],
    datasets: [
      {
        label: 'ON',
        backgroundColor: 'rgb(212, 0, 255)',
        borderColor: 'rgb(12, 12, 12)',
        data: [16, 22, 30, 5],
        stack: 'a',
        // barThickness: 35,
      },
      {
        label: 'OFF',
        backgroundColor: 'rgb(255, 0, 0)',
        data: [14, 8, 0, 5],
        stack: 'a',
      },
    ],
  };
  public myOptions: ChartOptions<'bar'> = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
            weight: 'bold',
          },
          color: 'rgb(255, 0, 0)',
          padding: 20,
        },
        title: {
          display: true,

          text: 'Machine Status',
          color: '#222222',
          font: {
            size: 30,
            weight: 'bold',
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            weight: 'bold',
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

  public pieChartType: ChartConfiguration<'pie'>['type'] = 'pie';

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [73, 47],
        backgroundColor: ['green', 'red'],
      },
    ],
  };
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'ATTENDACE',
        font: {
          size: 32,
          weight: 'bold',
        },
        color: '#333',
      },
      legend: {
        display: true,
        labels: {
          font: {
            size: 25,
          },
        },
      },
    },
  };
}
