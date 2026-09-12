import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/env';
import { ICartItem } from '../../../core/models/cart.model';

@Component({
  imports: [],
  selector: 'app-cartitem',
  styleUrl: './cartitem.css',
  templateUrl: './cartitem.html',
})
export class Cartitem {
  @Input() item!: ICartItem;
  staticURL = environment.staticURL;
  @Output() increaseQty = new EventEmitter<string>();
  @Output() decreaseQty = new EventEmitter<string>();
  @Output() removeItem = new EventEmitter<string>();
  @Output() confirmPrice = new EventEmitter<string>();

  onIncrease(): void {
    this.increaseQty.emit(this.item.productId._id);
  }
  onDecrease(): void {
    this.decreaseQty.emit(this.item.productId._id);
  }
  onRemove(): void {
    this.removeItem.emit(this.item.productId._id);
  }
  onConfirm(): void {
    this.confirmPrice.emit(this.item.productId._id);
  }
}
