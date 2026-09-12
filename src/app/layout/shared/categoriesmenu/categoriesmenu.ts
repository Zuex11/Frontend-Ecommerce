import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category-service';
import { SubcategoryService } from '../../../core/services/subcategory-service';
import { ICategory, ICategoryGroup } from '../../../core/models/category.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [RouterLink],
  selector: 'app-categories-menu',
  templateUrl: './categoriesmenu.html',
  styleUrl: './categoriesmenu.css',
})
export class CategoriesMenu implements OnInit, OnDestroy {
  constructor(
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}

  isOpen = false;
  groups: ICategoryGroup[] = [];
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const categoriesSub = this._categoryService.getActiveCategories().subscribe({
      next: (categoriesRes) => {
        const subcategoriesSub = this._subcategoryService.getActiveSubcategories().subscribe({
          next: (subcategoriesRes) => {
            this.groups = categoriesRes.data.map((category) => ({
              category,
              subcategories: subcategoriesRes.data.filter(
                (sub) => sub.categoryId === category._id,
              ),
            }));
            this._cdr.detectChanges();
          },
          error: (err) => {
            console.log(err);
          },
        });
        this.subscriptions.add(subcategoriesSub);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.add(categoriesSub);
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}