import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
 
// INTERFACES
export interface EmployeeData {
  id: number;
  name: string;
  location: string;
  domain: string;
  status: 'Present' | 'Absent';
  machineStatus: 'ON' | 'OFF';
}

@Injectable({
  providedIn: 'root'
})
export class BarchartdataservicesService {

   
  // SHARED STATE
   
  selectedDomain = '';                          // Currently selected domain filter
  selectedstatus: 'Present' | 'Absent' = 'Present';  // Currently selected status filter
  employees: EmployeeData[] = [];               // All employees data

   
  // CONSTRUCTOR
   
  constructor(private router: Router) {
    this.generateEmployeeData();
  }

   
  // DATA GENERATION
  generateEmployeeData(): void {
    const locations = ['Medavakkam', 'shozinganallur', 'Karapakkam', 'Navallur', 'Tambaram', 'Adayar'];

    const names = [
      'Arun', 'Karthik', 'Vignesh', 'Suresh', 'Praveen',
      'Dinesh', 'Ravi', 'Ajith', 'Kiran', 'Manoj',
      'Vimal', 'Hari', 'Naveen', 'Sanjay', 'Madhan',
      'Bharath', 'Ashwin', 'Kishore', 'Rahul', 'Vijay',
      'Lokesh', 'Gokul', 'Ganesh', 'Saravanan', 'Rajesh',
      'Prakash', 'Aravind', 'Yuvaraj', 'Ramesh', 'Mohan',
      'Vinoth', 'Kumar', 'Sathish', 'Deepak', 'Siva',
      'Arul', 'Ranjith', 'Sankar', 'Vasanth', 'Murali',
      'Abinesh', 'Akash', 'Balaji', 'Chandru', 'Dharan',
      'Ezhil', 'Farook', 'Harish', 'Jagan', 'Keerthivasan',
      'Mithun', 'Nithish', 'Pranav', 'Rohith', 'Senthil',
      'Surya', 'Tharun', 'Udhay', 'Varun', 'Yogesh'
    ];

    const domains = ['Voltas', 'Sms', 'Tvs'];
    let id = 1;
    let nameIndex = 0;

    // Generate 10 employees per location (60 total)
    locations.forEach((location) => {
      for (let i = 0; i < 10; i++) {
        this.employees.push({
          id: id++,
          name: names[nameIndex++],
          location: location,
          machineStatus: Math.random() < 0.5 ? 'ON' : 'OFF',
          domain: domains[Math.floor(Math.random() * domains.length)],
          status: Math.random() < 0.5 ? 'Present' : 'Absent',
        });
      }
    });
  }
}
