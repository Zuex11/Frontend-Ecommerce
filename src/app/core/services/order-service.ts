import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/env';
import { IOrderResponse, IOrdersResponse, IOrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'order';

  getAdminOrders() {
    return this._http.get<IOrdersResponse>(`${this.apiURL}/admin`);
  }

  adminGetOrder(orderId: string) {
    return this._http.get<IOrderResponse>(`${this.apiURL}/admin/order/${orderId}`);
  }

  adminGetUserOrder(userId: string) {
    return this._http.get<IOrdersResponse>(`${this.apiURL}/admin/${userId}`);
  }

  adminUpdateOrderStatus(orderId: string, status: IOrderStatus) {
    return this._http.patch<IOrderResponse>(`${this.apiURL}/admin/${orderId}`, { status });
  }
  createOrder(addressId: string) {
    return this._http.post<IOrderResponse>(this.apiURL, { addressId });
  }
  getUserOrders() {
    return this._http.get<IOrdersResponse>(this.apiURL);
  }

  cancelOrder(orderId: string) {
    return this._http.patch<IOrderResponse>(`${this.apiURL}/${orderId}`, {});
  }
  getOrderById(orderId: string) {
    return this._http.get<IOrderResponse>(`${this.apiURL}/${orderId}`);
  }
}
