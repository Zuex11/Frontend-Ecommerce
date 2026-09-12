import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/env';
import { ICategory, ICategoryResponse, ICategoriesResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'category';

  getActiveCategories() {
    return this._http.get<ICategoriesResponse>(this.apiURL);
  }

  getAllCategories() {
    return this._http.get<ICategoriesResponse>(`${this.apiURL}/admin`);
  }

  getCategoryBySlug(slug: string) {
    return this._http.get<ICategoryResponse>(`${this.apiURL}/${slug}`);
  }

  createCategory(category: Omit<ICategory, '_id'>) {
    return this._http.post<ICategoryResponse>(`${this.apiURL}/create`, category);
  }

  updateCategory(slug: string, updates: Partial<ICategory>) {
    return this._http.patch<ICategoryResponse>(`${this.apiURL}/${slug}`, updates);
  }
}
