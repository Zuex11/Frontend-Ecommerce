import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/env';
import { IAddressPayload, IEditUserPayload, IUserResponse, IUsersResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'user';

  getAllUsers() {
    return this._http.get<IUsersResponse>(`${this.apiURL}/admin`);
  }

  getProfile() {
    return this._http.get<IUserResponse>(`${this.apiURL}/me`);
  }

  editUser(updates: IEditUserPayload) {
    return this._http.patch<IUserResponse>(`${this.apiURL}/edit`, updates);
  }

  addAddress(address: IAddressPayload) {
    return this._http.post<IUserResponse>(`${this.apiURL}/address`, address);
  }

  editAddress(addressId: string, address: IAddressPayload) {
    return this._http.patch<IUserResponse>(`${this.apiURL}/address/${addressId}`, address);
  }

  deleteAddress(addressId: string) {
    return this._http.delete<IUserResponse>(`${this.apiURL}/address/${addressId}`);
  }

  setDefaultAddress(addressId: string) {
    return this._http.patch<IUserResponse>(`${this.apiURL}/address/${addressId}/default`, {});
  }
}