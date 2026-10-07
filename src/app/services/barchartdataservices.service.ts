import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { lastValueFrom } from "rxjs";

export interface EmployeeData {
  id: number;
  name: string;
  location: string;
  domain: string;
  status: "Present" | "Absent";
  machineStatus: "ON" | "OFF";
  role?: string;
  clientId?: number | string;
}

@Injectable({
  providedIn: "root",
})
export class BarchartdataservicesService {
  selectedDomain = "";
  selectedArea: string = "Voltas";
  selectedstatus: "Present" | "Absent" = "Present";
  employees: EmployeeData[] = [];
  getHttpResponse(url: any) {
    return lastValueFrom(this.http.get(url));
  }

  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  getEmployees(clientId: any) {
    const url = `${this.apiUrl}?clientId=${clientId}`;
    console.log("This the employee data url", url);
    return this.getHttpResponse(url);
  }
}
