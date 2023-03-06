import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { checkToken } from '../interceptors/token.interceptor';
import { ResponseLogin } from '../models/auth.model';
import { User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api_url = environment.API_URL;
  user$ = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.api_url}/api/v1/auth/login`, {
      email,
      password,
    })
    .pipe(
      tap(response =>{
        this.tokenService.saveToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token);
      })
    );
  }

  refreshToken(refreshToken: string) {
    return this.http.post<ResponseLogin>(`${this.api_url}/api/v1/auth/refresh-token`, {refreshToken
    })
    .pipe(
      tap(response =>{
        this.tokenService.saveToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token);
      })
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.api_url}/api/v1/auth/register`, {
      name,
      email,
      password,
    });
  }

  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password).pipe(
      switchMap(() => this.login(email, password))
    );
  }

  isAvailable(email: string) {
    return this.http.post<{ isAvailable: boolean }>(
      `${this.api_url}/api/v1/auth/is-available`,
      {
        email,
      }
    );
  }

  recovery(email: string) {
    return this.http.post(`${this.api_url}/api/v1/auth/recovery`, { email });
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.api_url}/api/v1/auth/change-password`, {
      token,
      newPassword,
    });
  }

  logout(){
    this.tokenService.removeToken();
  }

  getProfile() {
    return this.http.get<User>(`${this.api_url}/api/v1/auth/profile`, { context: checkToken()})
    .pipe(
      tap(user =>{
        this.user$.next(user);
      })
    );;
  }

}
