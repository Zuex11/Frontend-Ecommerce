import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/env';
import { AuthService } from './auth-service';
import { ICart, ICartProduct, ICartResponse } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
  ) {}
  private apiURL = environment.apiURL + 'cart';
  private guestCartKey = 'guestCart';

  getCart(): Observable<ICartResponse> {
    if (!this._authService.returnToken()) {
      return of({ message: 'Guest cart', data: this.getGuestCart() });
    }
    return this._http.get<ICartResponse>(this.apiURL);
  }

  addToCart(productId: string, quantity: number, product?: ICartProduct): Observable<ICartResponse> {
    if (!this._authService.returnToken()) {
      return this.addToGuestCart(productId, quantity, product);
    }
    return this._http.post<ICartResponse>(this.apiURL, { productId, quantity });
  }

  removeFromCart(productId: string): Observable<ICartResponse> {
    if (!this._authService.returnToken()) {
      const cart = this.getGuestCart();
      cart.items = cart.items.filter((item) => item.productId._id !== productId);
      this.saveGuestCart(cart);
      return of({ message: 'Item removed', data: cart });
    }
    return this._http.delete<ICartResponse>(`${this.apiURL}/${productId}`);
  }

  confirmProduct(productId: string): Observable<ICartResponse> {
    if (!this._authService.returnToken()) {
      return of({ message: 'Nothing to confirm in guest cart', data: this.getGuestCart() });
    }
    return this._http.put<ICartResponse>(`${this.apiURL}/confirm`, { productId });
  }

  mergeGuestCart(): void {
    const cart = this.getGuestCart();
    if (cart.items.length === 0) {
      return;
    }
    this._http
      .post<ICartResponse>(`${this.apiURL}/import`, {
        items: cart.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price,
        })),
      })
      .subscribe({
        next: () => localStorage.removeItem(this.guestCartKey),
        error: (err) => console.log(err),
      });
  }

  private getGuestCart(): ICart {
    const stored = localStorage.getItem(this.guestCartKey);
    if (stored) {
      return JSON.parse(stored) as ICart;
    }
    return { _id: 'guest', userId: 'guest', items: [] };
  }
  private saveGuestCart(cart: ICart): void {
    localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
  }
  private addToGuestCart(
    productId: string,
    quantity: number,
    product?: ICartProduct,
  ): Observable<ICartResponse> {
    const cart = this.getGuestCart();
    const line = cart.items.find((item) => item.productId._id === productId);
    if (line) {
      const newQty = line.quantity + quantity;
      if (newQty > line.productId.stock) {
        return throwError(() => ({
          status: 400,
          error: { status: 400, message: `Not enough stock for ${line.productId.name}` },
        }));
      }
      if (newQty < 1) {
        return throwError(() => ({
          status: 400,
          error: { status: 400, message: `Quantity can't go below 1` },
        }));
      }
      line.quantity = newQty;
    } else {
      if (!product) {
        return throwError(() => ({
          status: 400,
          error: { status: 400, message: 'Product data missing' },
        }));
      }
      if (quantity > product.stock) {
        return throwError(() => ({
          status: 400,
          error: { status: 400, message: `Not enough stock for ${product.name}` },
        }));
      }
      cart.items.push({
        _id: productId,
        productId: product,
        quantity,
        price: product.price,
        isPriceChanged: false,
      });
    }
    this.saveGuestCart(cart);
    return of({ message: 'Guest cart updated', data: cart });
  }
}
