import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { lastValueFrom } from "rxjs";

export interface InventoryData {
  id: string;
  name: string;
  description: string;
  employee: string;
  role: string;
  clientId?: number | string;
}
export interface EmployeeData {
  id: number;
  name: string;
  location: string;
  domain: string;
  status: "Present" | "Absent";
  machineStatus: "ON" | "OFF";
  role: string;
  clientId?: number | string;
}

@Injectable({
  providedIn: "root",
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;
  private empapiUrl = `${environment.apiUrl}/employees`;

  getHttpResponse(url: any) {
    return lastValueFrom(this.http.get(url));
  }

  constructor(private http: HttpClient) {}

  getEmployees(clientId: any) {
    const url = `${this.apiUrl}? clientId = ${clientId}`;
    return this.getHttpResponse(url);
  }
  addEmployee(item: Partial<EmployeeData>): Observable<EmployeeData> {
    return this.http.post<EmployeeData>(this.empapiUrl, item);
  }

  updateEmployee(
    id: number | string,
    item: Partial<EmployeeData>,
  ): Observable<EmployeeData> {
    return this.http.put<EmployeeData>(`${this.empapiUrl}/${id}`, item);
  }

  deleteEmployee(id: number | string): Observable<any> {
    return this.http.delete(`${this.empapiUrl}/${id}`);
  }

  getInventory(clientId: any) {
    const url = `${this.apiUrl}?clientId=${clientId}`;
    console.log("This the api url", url);
    return this.getHttpResponse(url);
  }
  addInventory(item: Partial<InventoryData>): Observable<InventoryData> {
    return this.http.post<InventoryData>(this.apiUrl, item);
  }

  updateInventory(
    id: number | string,
    item: Partial<InventoryData>,
  ): Observable<InventoryData> {
    return this.http.put<InventoryData>(`${this.apiUrl}/${id}`, item);
  }

  deleteInventory(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
