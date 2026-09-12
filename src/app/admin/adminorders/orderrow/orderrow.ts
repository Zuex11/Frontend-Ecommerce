import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { adminStatusOptions, IOrder, IOrderStatus, IOrderStatusChange } from '../../../core/models/order.model';

@Component({
  imports: [DatePipe],
  selector: 'app-order-row',
  styleUrl: './orderrow.css',
  templateUrl: './orderrow.html',
})
export class OrderRow {
  @Input() order!: IOrder;
  @Output() statusChange = new EventEmitter<IOrderStatusChange>();
  statusOptions = adminStatusOptions;

  get customerName(): string {
    if (typeof this.order.userId === 'object' && this.order.userId !== null) {
      return `${this.order.userId.firstName} ${this.order.userId.lastName}`.trim();
    }
    return this.order.address.fullName;
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusChange.emit({ orderId: this.order._id, status: select.value as IOrderStatus });
  }
}
