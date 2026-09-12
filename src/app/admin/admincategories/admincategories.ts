import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoryService } from '../../core/services/category-service';
import { SubcategoryService } from '../../core/services/subcategory-service';
import { ICategory } from '../../core/models/category.model';
import { ISubcategory } from '../../core/models/subcategory.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [FormsModule],
  selector: 'app-admincategories',
  styleUrl: './admincategories.css',
  templateUrl: './admincategories.html',
})
export class Admincategories implements OnInit, OnDestroy {
  constructor(
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}
  myCategories: ICategory[] = [];
  mySubcategories: ISubcategory[] = [];
  newCategory = { name: '', slug: '', isActive: true, isDeleted: false };
  newSubcategory = { name: '', slug: '', categoryId: '', isActive: true, isDeleted: false };
  categoryError = '';
  categoryMessage = '';
  subcategoryError = '';
  subcategoryMessage = '';
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchSubcategories();
  }

  fetchCategories(): void {
    const sub = this._categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.myCategories = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }

  fetchSubcategories(): void {
    const sub = this._subcategoryService.getAllSubcategories().subscribe({
      next: (res) => {
        this.mySubcategories = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }

  activeCategories(): ICategory[] {
    return this.myCategories.filter((category) => !category.isDeleted);
  }

  activeSubcategories(): ISubcategory[] {
    return this.mySubcategories.filter((subcategory) => !subcategory.isDeleted);
  }

  categoryName(categoryId: string): string {
    const category = this.myCategories.find((item) => item._id === categoryId);
    return category ? category.name : '—';
  }

  addCategory(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.categoryError = '';
    const sub = this._categoryService.createCategory(this.newCategory).subscribe({
      next: (res) => {
        this.categoryMessage = res.message;
        this.newCategory = { name: '', slug: '', isActive: true, isDeleted: false };
        form.resetForm();
        this.fetchCategories();
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.categoryError = err.error?.message || 'Something went wrong';
        this._cdr.detectChanges();
      },
    });
    this.subscriptions.add(sub);
  }

  deleteCategory(category: ICategory): void {
    const sub = this._categoryService.updateCategory(category.slug, { isDeleted: true }).subscribe({
      next: () => this.fetchCategories(),
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }

  onCategoryToggle(category: ICategory): void {
    const sub = this._categoryService
      .updateCategory(category.slug, { isActive: !category.isActive })
      .subscribe({
        next: () => this.fetchCategories(),
        error: (err) => console.log(err),
      });
    this.subscriptions.add(sub);
  }

  addSubcategory(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.subcategoryError = '';
    const sub = this._subcategoryService.createSubcategory(this.newSubcategory).subscribe({
      next: (res) => {
        this.subcategoryMessage = res.message;
        this.newSubcategory = { name: '', slug: '', categoryId: '', isActive: true, isDeleted: false };
        form.resetForm();
        this.fetchSubcategories();
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.subcategoryError = err.error?.message || 'Something went wrong';
        this._cdr.detectChanges();
      },
    });
    this.subscriptions.add(sub);
  }

  deleteSubcategory(subcategory: ISubcategory): void {
    const sub = this._subcategoryService
      .updateSubcategory(subcategory.slug, { isDeleted: true })
      .subscribe({
        next: () => this.fetchSubcategories(),
        error: (err) => console.log(err),
      });
    this.subscriptions.add(sub);
  }

  onSubcategoryToggle(subcategory: ISubcategory): void {
    const sub = this._subcategoryService
      .updateSubcategory(subcategory.slug, { isActive: !subcategory.isActive })
      .subscribe({
        next: () => this.fetchSubcategories(),
        error: (err) => console.log(err),
      });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
