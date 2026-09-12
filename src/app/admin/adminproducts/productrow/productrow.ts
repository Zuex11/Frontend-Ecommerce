import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct, IProductToggleEvent, IProductToggleField } from '../../../core/models/product.model';

@Component({
  imports: [],
  selector: 'app-product-row',
  styleUrl: './productrow.css',
  templateUrl: './productrow.html',
})
export class ProductRow {
  @Input() product!: IProduct;
  @Output() edit = new EventEmitter<IProduct>();
  @Output() toggle = new EventEmitter<IProductToggleEvent>();

  onToggle(field: IProductToggleField): void {
    this.toggle.emit({ slug: this.product.slug, field, value: !this.product[field] });
  }
  onEdit(): void {
    this.edit.emit(this.product);
  }
}
