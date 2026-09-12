import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Cartitem } from './cartitem/cartitem';
import { Ordersummary } from './ordersummary/ordersummary';
import { CartService } from '../../core/services/cart-service';
import { ICart, ICartItem } from '../../core/models/cart.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [Cartitem, Ordersummary],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart implements OnInit, OnDestroy {
  constructor(
    private _cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}
  myCart?: ICart;
  readyItems: ICartItem[] = [];
  changedItems: ICartItem[] = [];
  private subscriptions: Subscription = new Subscription();

  increaseQty(productId: string): void {
    const sub = this._cartService.addToCart(productId, 1).subscribe({
      next: (res) => {
        this.myCart = res.data;
        this.splitItems();
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  decreaseQty(productId: string): void {
    const sub = this._cartService.addToCart(productId, -1).subscribe({
      next: (res) => {
        this.myCart = res.data;
        this.splitItems();
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  removeItem(productId: string): void {
    const sub = this._cartService.removeFromCart(productId).subscribe({
      next: (res) => {
        this.myCart = res.data;
        this.splitItems();
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  confirmPrice(productId: string): void {
    const sub = this._cartService.confirmProduct(productId).subscribe({
      next: (res) => {
        this.myCart = res.data;
        this.splitItems();
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  private splitItems(): void {
    const items = this.myCart?.items ?? [];
    this.readyItems = items.filter((item) => !item.isPriceChanged);
    this.changedItems = items.filter((item) => item.isPriceChanged);
  }
  ngOnInit(): void {
    const cartSub = this._cartService.getCart().subscribe({
      next: (res) => {
        this.myCart = res.data;
        this.splitItems();
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(cartSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
