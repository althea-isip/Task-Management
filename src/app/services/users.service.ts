import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseApiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  
}
