import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { OrderRow } from './orderrow/orderrow';
import { OrderService } from '../../core/services/order-service';
import { UserService } from '../../core/services/user-service';
import { IOrder, IOrderStatusChange } from '../../core/models/order.model';
import { IUser } from '../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [OrderRow],
  selector: 'app-admin-orders',
  styleUrl: './adminorders.css',
  templateUrl: './adminorders.html',
})
export class AdminOrders implements OnInit, OnDestroy {
  constructor(
    private _orderService: OrderService,
    private _userService: UserService,
    private _cdr: ChangeDetectorRef,
  ) {}
  myOrders: IOrder[] = [];
  users: IUser[] = [];
  selectedUserId = '';
  private subscriptions: Subscription = new Subscription();

  onUserFilterChange(event: Event): void {
    this.selectedUserId = (event.target as HTMLSelectElement).value;
    const request = this.selectedUserId
      ? this._orderService.adminGetUserOrder(this.selectedUserId)
      : this._orderService.getAdminOrders();
    const sub = request.subscribe({
      next: (res) => {
        this.myOrders = res.data ?? [];
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }

  onStatusChange(event: IOrderStatusChange): void {
    const sub = this._orderService.adminUpdateOrderStatus(event.orderId, event.status).subscribe({
      next: () => {
        const refetchSub = this._orderService.getAdminOrders().subscribe({
          next: (res) => {
            this.myOrders = res.data ?? [];
            this._cdr.detectChanges();
          },
          error: (err) => console.log(err),
        });
        this.subscriptions.add(refetchSub);
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  ngOnInit(): void {
    const ordersSub = this._orderService.getAdminOrders().subscribe({
      next: (res) => {
        this.myOrders = res.data ?? [];
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(ordersSub);

    const usersSub = this._userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data.filter((user) => !user.isDeleted);
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(usersSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
