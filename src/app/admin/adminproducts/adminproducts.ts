import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ProductRow } from './productrow/productrow';
import { ProductForm } from './productform/productform';
import { ProductService } from '../../core/services/product-service';
import { CategoryService } from '../../core/services/category-service';
import { IProduct } from '../../core/models/product.model';
import { IProductToggleEvent } from '../../core/models/product.model';
import { ICategory } from '../../core/models/category.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [ProductRow, ProductForm],
  selector: 'app-admin-products',
  styleUrl: './adminproducts.css',
  templateUrl: './adminproducts.html',
})
export class AdminProducts implements OnInit, OnDestroy {
  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}
  myProducts: IProduct[] = [];
  categories: ICategory[] = [];
  editing?: IProduct;
  private subscriptions: Subscription = new Subscription();

  onEdit(product: IProduct): void {
    this.editing = product;
    this._cdr.detectChanges();
  }
  resetForm(): void {
    this.editing = undefined;
    this._cdr.detectChanges();
  }
  onToggle(event: {
    slug: string;
    field: 'isActive' | 'isTopSale' | 'isNewArrival';
    value: boolean;
  }): void {
    const sub = this._productService
      .updateProduct(event.slug, { [event.field]: event.value })
      .subscribe({
        next: () => {
          const refetchSub = this._productService.getAllProductsAdmin().subscribe({
            next: (res) => {
              this.myProducts = res.data ?? [];
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
  onSaved(): void {
    this.editing = undefined;
    const sub = this._productService.getAllProductsAdmin().subscribe({
      next: (res) => {
        this.myProducts = res.data ?? [];
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
    this._cdr.detectChanges();
  }
  ngOnInit(): void {
    const productsSub = this._productService.getAllProductsAdmin().subscribe({
      next: (res) => {
        this.myProducts = res.data ?? [];
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(productsSub);

    const categoriesSub = this._categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(categoriesSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
