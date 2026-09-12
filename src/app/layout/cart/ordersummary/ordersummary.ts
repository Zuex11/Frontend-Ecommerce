import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ICartItem } from '../../../core/models/cart.model';

@Component({
  imports: [],
  selector: 'app-ordersummary',
  styleUrl: './ordersummary.css',
  templateUrl: './ordersummary.html',
})
export class Ordersummary {
  @Input() items: ICartItem[] = [];

  constructor(private _router: Router) {}

  get itemCount(): number {
    return this.items.length;
  }
  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  checkout(): void {
    this._router.navigate(['/checkout']);
  }
}