import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseApiUrl: string = environment.apiUrl;
  private apiUrl = this.baseApiUrl+'Auth/login';
  private tokenKey = 'authToken';

  constructor(private http:HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.baseApiUrl + '/api/Auth/login', credentials);
  }

  setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
}
