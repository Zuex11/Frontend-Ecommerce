import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../core/services/order-service';
import { IOrder } from '../../core/models/order.model';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-orders',
  styleUrl: './orders.css',
  templateUrl: './orders.html',
})
export class Orders implements OnInit, OnDestroy {
  constructor(
    private _orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}
  myOrders: IOrder[] = [];
  private subscriptions = new Subscription();

  itemCount(order: IOrder): number {
    return order.products.reduce((sum, p) => sum + p.quantity, 0);
  }
  isTerminalStatus(status: string): boolean {
    return status !== 'pending' && status !== 'in progress' && status !== 'shipped' && status !== 'received';
  }

  ngOnInit(): void {
    const sub = this._orderService.getUserOrders().subscribe({
      next: (res) => {
        this.myOrders = res.data ?? [];
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}