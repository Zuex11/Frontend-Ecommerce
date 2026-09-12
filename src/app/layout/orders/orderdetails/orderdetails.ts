import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../core/services/order-service';
import { IOrder } from '../../../core/models/order.model';
import { environment } from '../../../../environments/env';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-orderdetails',
  styleUrl: './orderdetails.css',
  templateUrl: './orderdetails.html',
})
export class Orderdetails implements OnInit, OnDestroy {
  constructor(
    private _orderService: OrderService,
    private _activeRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
  ) {}

  staticURL = environment.staticURL;
  myOrder?: IOrder;
  notFound = false;
  cancelling = false;
  statusSteps = ['pending', 'in progress', 'shipped', 'received'];
  private subscriptions = new Subscription();

  get isCancellable(): boolean {
    return this.myOrder?.status === 'pending' || this.myOrder?.status === 'in progress';
  }
  get isTerminalStatus(): boolean {
    return !!this.myOrder && !this.statusSteps.includes(this.myOrder.status);
  }
  get currentStepIndex(): number {
    return this.myOrder ? this.statusSteps.indexOf(this.myOrder.status) : -1;
  }

  cancelOrder(): void {
    if (!this.myOrder || this.cancelling) return;
    this.cancelling = true;
    const sub = this._orderService.cancelOrder(this.myOrder._id).subscribe({
      next: (res) => {
        this.myOrder = res.data;
        this.cancelling = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.cancelling = false;
        this._cdr.detectChanges();
      },
    });
    this.subscriptions.add(sub);
  }

  ngOnInit(): void {
    const paramSub = this._activeRoute.paramMap.subscribe((params) => {
      const orderId = params.get('id');
      if (!orderId) return;
      const orderSub = this._orderService.getOrderById(orderId).subscribe({
        next: (res) => {
          this.myOrder = res.data;
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.notFound = true;
          this._cdr.detectChanges();
        },
      });
      this.subscriptions.add(orderSub);
    });
    this.subscriptions.add(paramSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}