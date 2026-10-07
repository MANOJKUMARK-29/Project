import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
export interface User {
  id: string;
  email: string;
  password: string;
  uname: string;
  role: string;
  domain: string;
  badge: string;
}
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email.trim()}`);
  }

  updatePassword(userId: string, newPassword: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, {
      password: newPassword,
    });
  }
}
