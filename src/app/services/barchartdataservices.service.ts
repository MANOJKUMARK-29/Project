import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
  selectedDomain = 'Voltas';
  selectedstatus: 'Present' | 'Absent' = 'Present';
  employees: EmployeeData[] = [];
  constructor(private router: Router) {
    this.generateEmployeeData();
  }
    generateEmployeeData() {
      const locations = ['Medavakkam', 'shozinganallur', 'Karapakkam', 'Navallur','Tambaram','Adayar'];
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

      locations.forEach((location) => {

        for (let i = 0; i < 10; i++) {
          this.employees.push({
            id: id++,
            name: names[nameIndex++],
            location: location,
            machineStatus: Math.random() <0.5 ? 'ON' : 'OFF',
            domain: domains[Math.floor(Math.random() * domains.length)],
            status: Math.random() < 0.5 ? 'Present' : 'Absent',

          });

        }
      });

    }

    // -----------remove-user-from-localstorage-and-log's-out------
  // logout() {
  //   localStorage.removeItem('currentUser');
  //   this.router.navigate(['/loginform']);
  // }

  // // -----------expand-the-side-bar-when-menu-button-clicked---
  // expand() {
  //   this.sidebar = !this.sidebar;
  // }
  // // -----------shoe-the-corressponding-report-in-list0based-on-user-domain----
  // showdomainreport(domainname: string): boolean {
  //   if (!this.currentUser) return false;

  //   return (
  //     this.currentUser.domain.toLowerCase() === domainname.toLocaleLowerCase()
  //   );
  // }

}
