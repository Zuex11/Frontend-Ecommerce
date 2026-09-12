import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { SubcategoryService } from '../../../core/services/subcategory-service';
import { ISubcategory } from '../../../core/models/subcategory.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnChanges, OnInit, OnDestroy {
  constructor(
    private _subcategoryService: SubcategoryService,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
  ) {}

  @Input() categorySlug: string | null = null;
  subcategories: ISubcategory[] = [];
  isNewArrival = false;
  isTopSale = false;
  private sub?: Subscription;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const paramsSub = this._route.queryParamMap.subscribe((params) => {
      this.isNewArrival = params.get('isNewArrival') === 'true';
      this.isTopSale = params.get('isTopSale') === 'true';
      this._cdr.detectChanges();
    });
    this.subscriptions.add(paramsSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('categorySlug' in changes) {
      this.sub?.unsubscribe();

      if (!this.categorySlug) {
        this.subcategories = [];
        return;
      }

      this.sub = this._subcategoryService.getActiveSubcategories(this.categorySlug).subscribe({
        next: (res) => {
          this.subcategories = res.data;
          this._cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    }
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.subscriptions.unsubscribe();
  }
}
