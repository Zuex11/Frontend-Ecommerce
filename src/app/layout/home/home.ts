import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICategory } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category-service';
import { ProductService } from '../../core/services/product-service';
import { IProduct } from '../../core/models/product.model';
import { environment } from '../../../environments/env';
import { Product } from '../productslist/product/product';

@Component({
  imports: [RouterLink, Product],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  constructor(
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _cdr: ChangeDetectorRef,
  ) {}

  categories: ICategory[] = [];
  myArrivals: IProduct[] = [];
  allNewArrivals: IProduct[] = [];
  myTopSales: IProduct [] = [];
  staticURL = environment.staticURL;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const categoriesSub = this._categoryService.getActiveCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.add(categoriesSub);

    const arrivalsSub = this._productService.getActiveProducts({ isNewArrival: true }).subscribe({
      next: (res) => {
        this.myArrivals = res.data.slice(0, 2);
        this.allNewArrivals = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.add(arrivalsSub);

    const topSaleSub = this._productService.getActiveProducts({ isTopSale: true }).subscribe({
      next: (res) => {
        this.myTopSales = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.add(topSaleSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
