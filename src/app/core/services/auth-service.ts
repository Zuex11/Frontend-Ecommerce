import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/env';
import {
  IGender,
  ILoginData,
  ILoginResponse,
  ISignupData,
  ISignupResponse,
  ITokenPayload,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'auth';
  private signupURL = environment.apiURL + 'user/signup';
  private tokenKey = 'token';

  login(data: ILoginData) {
    return this._http.post<ILoginResponse>(`${this.apiURL}/login`, data);
  }
  signup(data: ISignupData) {
    return this._http.post<ISignupResponse>(this.signupURL, data);
  }
  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }
  returnToken() {
    return localStorage.getItem(this.tokenKey);
  }
  checkIfLoginWithRole() {
    const token = this.returnToken();
    if (token) {
      const decode = this.decodeToken(token);
      if (decode) {
        return decode.role;
      }
    }
    return '';
  }
  returnFirstName() {
    const token = this.returnToken();
    if (token) {
      const decode = this.decodeToken(token);
      return decode?.firstName ?? '';
    }
    return '';
  }
  returnGender(): IGender | '' {
    const token = this.returnToken();
    if (token) {
      const decode = this.decodeToken(token);
      return decode?.gender ?? '';
    }
    return '';
  }
  private decodeToken(token: string): ITokenPayload | null {
    try {
      return jwtDecode<ITokenPayload>(token);
    } catch {
      return null;
    }
  }
}
