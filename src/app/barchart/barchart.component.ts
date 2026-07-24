import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.css'
})
export class BarchartComponent {
  
   public myData: ChartConfiguration<'bar'>['data']= {
    labels:['Medavakkam','shozinganallur','Karapakkam','Navallur'],
    datasets:[{
      label:'ON',
      backgroundColor:'rgba(235, 38, 38, 0.25)',
      borderColor: 'rgba(0, 0, 0, 0.25)',
      data:[16, 22, 30, 5],
      stack: 'a',
      // barThickness: 35,
    },
  {
    label:'OFF',
    backgroundColor:'rgba(26, 184, 34, 0.25)',
    data:[14, 8, 0,5],
    stack:'a'
  },
 ]
   };
  public myOptions: ChartOptions<'bar'>={
    responsive: true,
    
       plugins:{
        legend:{
          labels:{
            
            font:{
              size:20,
            },
            color:'rgb(255, 0, 0)',
            padding: 20
          },
           title: {
      display: true,
      
      text: 'Machine Status',
      color: '#222222',
      font: {
        size: 30,
        weight: 'bold'
      }
    }
        }
       },
       scales:{
         x:{
          stacked: true,
          ticks: {
            font: {
              weight: 'bold'
            }
          },
          title:{
            color:'rgb(255, 0, 0)',
            
          },
          grid:{
            color:'rgb(8, 8, 8)',
          }
         },
         y:{
          stacked: true,
          title:{
            display: true,
            color:'rgba(70, 255, 14, 0.25)'
          },
          grid:{
            display: true,
            color:'rgba(51, 255, 0, 0.25)'
          }
         }
       }
  };

  public pieChartType: ChartConfiguration<'pie'>['type'] = 'pie';
   
  public pieChartData: ChartData <'pie', number[], string> = {
    
      labels: ['Present', 'Absent'],
      datasets: [{
        data: [73, 47]
      }]

  };
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels:{
          font:{
            size:25,
          }
        }
      }
    }
  };

}
