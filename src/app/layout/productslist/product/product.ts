import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/env';
import { IProduct } from '../../../core/models/product.model';

@Component({
  imports: [RouterLink],
  selector: 'app-product',
  styleUrl: './product.css',
  templateUrl: './product.html',
})
export class Product {
  @Input() product!: IProduct;
  staticURL = environment.staticURL;
}
