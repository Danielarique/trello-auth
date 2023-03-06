import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { checkToken } from '../interceptors/token.interceptor';
import { User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  api_url = environment.API_URL;

  constructor(private http: HttpClient) { }

  getUsers(){
    return this.http.get<User[]>(`${this.api_url}/api/v1/users`,{ context: checkToken()});
  }

}
