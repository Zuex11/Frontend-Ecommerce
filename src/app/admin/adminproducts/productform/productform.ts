import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../core/services/product-service';
import { SubcategoryService } from '../../../core/services/subcategory-service';
import { IProduct } from '../../../core/models/product.model';
import { ICategory } from '../../../core/models/category.model';
import { ISubcategory } from '../../../core/models/subcategory.model';
import { environment } from '../../../../environments/env';

@Component({
  imports: [FormsModule],
  selector: 'app-product-form',
  styleUrl: './productform.css',
  templateUrl: './productform.html',
})
export class ProductForm implements OnChanges, OnDestroy {
  constructor(
    private _productService: ProductService,
    private _subcategoryService: SubcategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}
  @Input() categories: ICategory[] = [];
  @Input() editing?: IProduct;
  @Output() saved = new EventEmitter<void>();
  @ViewChild('imageInput') private _imageInput?: ElementRef<HTMLInputElement>;
  staticURL = environment.staticURL;
  private subscriptions: Subscription = new Subscription();


  name = '';
  desc = '';
  price: number | null = null;
  stock: number | null = null;
  slug = '';
  categoryId = '';
  subcategoryId = '';
  isTopSale = false;
  isNewArrival = false;
  isActive = true;
  imageFiles: File[] = [];
  mySubcategories: ISubcategory[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if ('editing' in changes) {
      if (this.editing) {
        this.name = this.editing.name;
        this.desc = this.editing.desc;
        this.price = this.editing.price;
        this.stock = this.editing.stock;
        this.slug = this.editing.slug;
        this.categoryId = this.editing.categoryId._id;
        this.subcategoryId = this.editing.subcategoryId._id;
        this.isTopSale = this.editing.isTopSale;
        this.isNewArrival = this.editing.isNewArrival;
        this.isActive = this.editing.isActive;
        this.loadSubcategories();
      } else {
        this.resetFields();
      }
      this._cdr.detectChanges();
    }
  }
  onCategoryChange(): void {
    this.subcategoryId = '';
    this.loadSubcategories();
  }
  loadSubcategories(): void {
    const category = this.categories.find((c) => c._id === this.categoryId);
    if (!category) {
      this.mySubcategories = [];
      this._cdr.detectChanges();
      return;
    }
    const sub = this._subcategoryService.getAllSubcategories().subscribe({
      next: (res) => {
        this.mySubcategories = res.data.filter((s) => s.categoryId === category._id);
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageFiles = input.files ? Array.from(input.files) : [];
  }
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('desc', this.desc);
    formData.append('price', String(this.price));
    formData.append('stock', String(this.stock));
    formData.append('slug', this.slug);
    formData.append('categoryId', this.categoryId);
    formData.append('subcategoryId', this.subcategoryId);
    formData.append('isTopSale', String(this.isTopSale));
    formData.append('isNewArrival', String(this.isNewArrival));
    formData.append('isActive', String(this.isActive));
    for (const file of this.imageFiles) {
      formData.append('imgURL', file);
    }

    const request = this.editing
      ? this._productService.updateProduct(this.editing.slug, formData)
      : this._productService.createProduct(formData);
    request.subscribe({
      next: (res) => {
        console.log(res.message);
        if (!this.editing) {
          this.resetFields();
          form.resetForm();
        }
        this.saved.emit();
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }
  private resetFields(): void {
    this.name = '';
    this.desc = '';
    this.price = null;
    this.stock = null;
    this.slug = '';
    this.categoryId = '';
    this.subcategoryId = '';
    this.isTopSale = false;
    this.isNewArrival = false;
    this.isActive = true;
    this.imageFiles = [];
    this.mySubcategories = [];
    if (this._imageInput) {
      this._imageInput.nativeElement.value = '';
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
