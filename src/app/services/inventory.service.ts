import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventoryData {
  id: string;
  name: string;
  description: string;
  employee: string;
  role: string;
}
export interface EmployeeData {
  id: number;
  name: string;
  location: string;
  domain: string;
  status: 'Present' | 'Absent';
  machineStatus: 'ON' | 'OFF';
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;
  private empapiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<EmployeeData[]> {
    return this.http.get<EmployeeData[]>(this.empapiUrl)
  }
  addEmployee(item: Partial<EmployeeData>): Observable<EmployeeData> {
    return this.http.post<EmployeeData>(this.empapiUrl, item);
  }

  updateEmployee(id: number | string, item: Partial<EmployeeData>): Observable<EmployeeData> {
    return this.http.put<EmployeeData>(`${this.empapiUrl}/${id}`, item);
  }

  deleteEmployee(id: number | string): Observable<any> {
    return this.http.delete(`${this.empapiUrl}/${id}`);
  }

  getInventory(): Observable<InventoryData[]> {
    return this.http.get<InventoryData[]>(this.apiUrl);
  }
  addInventory(item: Partial<InventoryData>): Observable<InventoryData> {
    return this.http.post<InventoryData>(this.apiUrl, item);
  }

  updateInventory(id: number | string, item: Partial<InventoryData>): Observable<InventoryData> {
    return this.http.put<InventoryData>(`${this.apiUrl}/${id}`, item);
  }

  deleteInventory(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
