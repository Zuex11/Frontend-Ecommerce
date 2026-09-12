import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './product/product';
import { ProductService } from '../../core/services/product-service';
import { IProduct, IProductFilters } from '../../core/models/product.model';
import { Subscription } from 'rxjs';
import { Sidebar } from "../shared/sidebar/sidebar";
import { AuthService } from '../../core/services/auth-service';

@Component({
  imports: [Product, Sidebar],
  selector: 'app-productslist',
  styleUrl: './productslist.css',
  templateUrl: './productslist.html',
})
export class Productslist implements OnInit, OnDestroy {
  constructor(
    private _productService: ProductService,
    private _cdr: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService
  ) {}
  public myProducts: IProduct[] = [];
  public filters: IProductFilters = {};
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const paramsSub = this._route.queryParamMap.subscribe((params) => {
      if (!params.get('category') && this._authService.checkIfLoginWithRole() === 'user') {
        const gender = this._authService.returnGender();
        if (gender === 'male' || gender === 'female') {
          this._router.navigate([], {
            queryParams: { category: gender === 'male' ? 'men' : 'women' },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
          return;
        }
      }

      this.filters = {
        category: params.get('category') ?? undefined,
        subcategory: params.get('subcategory') ?? undefined,
        isTopSale: params.get('isTopSale') === 'true' ? true : undefined,
        isNewArrival: params.get('isNewArrival') === 'true' ? true : undefined,
      };

      const dataSub = this._productService.getActiveProducts(this.filters).subscribe({
        next: (res) => {
          this.myProducts = res.data;
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.myProducts = [];
          this._cdr.detectChanges();
        }
      });
      this.subscriptions.add(dataSub);
    });

    this.subscriptions.add(paramsSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}