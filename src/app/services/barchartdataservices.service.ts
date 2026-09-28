import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmployeeData {
  id: number;
  name: string;
  location: string;
  domain: string;
  status: 'Present' | 'Absent';
  machineStatus: 'ON' | 'OFF';
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BarchartdataservicesService {

  selectedDomain = '';
  selectedArea: string = 'Voltas';
  selectedstatus: 'Present' | 'Absent' = 'Present';
  employees: EmployeeData[] = [];

  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private router: Router, private http: HttpClient) { }

  fetchEmployees(): Observable<EmployeeData[]> {
    return this.http.get<EmployeeData[]>(this.apiUrl).pipe(
      tap((data) => {
        this.employees = data;
      })
    );
  }
}
