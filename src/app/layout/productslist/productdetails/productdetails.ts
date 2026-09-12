import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { CartService } from '../../../core/services/cart-service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../../core/models/product.model';
import { ICart, ICartItem } from '../../../core/models/cart.model';
import { environment } from '../../../../environments/env';
import { Subscription } from 'rxjs';
import { Product } from '../product/product';

@Component({
  imports: [Product, RouterLink],
  selector: 'app-productdetails',
  styleUrl: './productdetails.css',
  templateUrl: './productdetails.html',
})
export class Productdetails implements OnInit, OnDestroy {
  constructor(
    private _activeRoute: ActivatedRoute,
    private _productService: ProductService,
    private _cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}
  slug!: string;
  myProduct!: IProduct;
  loadError = false;
  staticURL = environment.staticURL;
  relatedProducts!: IProduct[];
  myCartItems: ICartItem[] = [];
  cartMessage = '';
  cartError = '';
  private subscriptions: Subscription = new Subscription();
  quantity = 1;
  selectedImage = 0;

  get qtyInCart(): number {
    if (!this.myProduct) return 0;
    const line = this.myCartItems.find((item) => item.productId._id === this.myProduct._id);
    return line ? line.quantity : 0;
  }
  get canAddMore(): boolean {
    return !!this.myProduct && this.myProduct.stock > 0 && this.qtyInCart < this.myProduct.stock;
  }

  increaseQty(): void {
    if (this.quantity < this.myProduct.stock - this.qtyInCart) {
      this.quantity++;
    }
  }
  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  addToCart(): void {
    this.cartMessage = '';
    this.cartError = '';
    const sub = this._cartService
      .addToCart(this.myProduct._id, this.quantity, this.myProduct)
      .subscribe({
        next: (res) => {
          this.cartMessage = res.message;
          this.myCartItems = res.data.items;
          this.quantity = 1;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this.cartError = err.error?.message || 'Something went wrong';
          this._cdr.detectChanges();
        },
      });
    this.subscriptions.add(sub);
  }
  ngOnInit(): void {
    const productsSub = this._activeRoute.paramMap.subscribe({
      next: (params) => {
        const slug = params.get('slug');

        if (slug) {
          this.slug = slug;

          const productSub = this._productService.getProductBySlug(this.slug).subscribe({
            next: (res) => {
              this.myProduct = res.data;
              this.selectedImage = 0;
              this._cdr.detectChanges();
              this.quantity = 1;
            },
            error: (err) => {
              console.log(err);
              this.loadError = true;
              this._cdr.detectChanges();
            },
          });

          const relatedSub = this._productService.getRelatedProducts(this.slug).subscribe({
            next: (res) => {
              this.relatedProducts = res.data;
              this._cdr.detectChanges();
            },
            error: (err) => {
              console.log(err);
            },
          });

          this.subscriptions.add(productSub);
          this.subscriptions.add(relatedSub);
        }
      },
    });
    this.subscriptions.add(productsSub);
    const cartSub = this._cartService.getCart().subscribe({
      next: (res) => {
        this.myCartItems = res.data.items;
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
