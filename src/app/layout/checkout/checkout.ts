import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart-service';
import { UserService } from '../../core/services/user-service';
import { OrderService } from '../../core/services/order-service';
import { ICart, ICartItem } from '../../core/models/cart.model';
import { IAddress } from '../../core/models/user.model';
import { IOrder } from '../../core/models/order.model';
import { environment } from '../../../environments/env';

@Component({
  imports: [RouterLink],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit, OnDestroy {
  constructor(
    private _cartService: CartService,
    private _userService: UserService,
    private _orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}

  staticURL = environment.staticURL;
  myCart?: ICart;
  readyItems: ICartItem[] = [];
  hasChangedItems = false;
  addresses: IAddress[] = [];
  selectedAddressId = '';
  placing = false;
  myError = '';
  placedOrder?: IOrder;

  private subscriptions = new Subscription();

  get subtotal(): number {
    return this.readyItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  ngOnInit(): void {
    const cartSub = this._cartService.getCart().subscribe({
      next: (res) => {
        this.myCart = res.data;
        this.readyItems = this.myCart.items.filter((item) => !item.isPriceChanged);
        this.hasChangedItems = this.myCart.items.some((item) => item.isPriceChanged);
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(cartSub);

    const profileSub = this._userService.getProfile().subscribe({
      next: (res) => {
        this.addresses = res.data.addresses;
        const defaultAddress = this.addresses.find((address) => address.isDefault);
        this.selectedAddressId = defaultAddress?._id ?? this.addresses[0]?._id ?? '';
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(profileSub);
  }

  placeOrder(): void {
    if (!this.selectedAddressId || this.placing) return;
    this.placing = true;
    this.myError = '';
    const sub = this._orderService.createOrder(this.selectedAddressId).subscribe({
      next: (res) => {
        this.placedOrder = res.data;
        this.placing = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.myError = err.error?.message || 'Something went wrong';
        this.placing = false;
        this._cdr.detectChanges();
      },
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}