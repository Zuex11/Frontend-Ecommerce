import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/env';
import {
  ISubcategory,
  ISubcategoryResponse,
  ISubcategoriesResponse,
} from '../models/subcategory.model';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'subcategory';

getActiveSubcategories(category?: string) {
  let params = new HttpParams();
  if (category) {
    params = params.set('category', category);
  }
  return this._http.get<ISubcategoriesResponse>(this.apiURL, { params });
}

  getAllSubcategories() {
    return this._http.get<ISubcategoriesResponse>(`${this.apiURL}/admin`);
  }

  getSubcategoryBySlug(slug: string) {
    return this._http.get<ISubcategoryResponse>(`${this.apiURL}/${slug}`);
  }

  createSubcategory(subcategory: Omit<ISubcategory, '_id'>) {
    return this._http.post<ISubcategoryResponse>(`${this.apiURL}/create`, subcategory);
  }

  updateSubcategory(slug: string, updates: Partial<ISubcategory>) {
    return this._http.patch<ISubcategoryResponse>(`${this.apiURL}/${slug}`, updates);
  }
}
