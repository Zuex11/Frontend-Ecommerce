import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/env';
import { IProduct, IProductFilters, IProductResponse, IProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'product';

  getActiveProducts(filters?: IProductFilters) {
    let params = new HttpParams();
    if (filters?.category) {
      params = params.set('category', filters.category);
    }
    if (filters?.subcategory) {
      params = params.set('subcategory', filters.subcategory);
    }
    if (filters?.isTopSale) {
      params = params.set('isTopSale', filters.isTopSale);
    }
    if (filters?.isNewArrival) {
      params = params.set('isNewArrival', filters.isNewArrival);
    }
    return this._http.get<IProductsResponse>(this.apiURL, { params });
  }

  getProductBySlug(slug: string) {
    return this._http.get<IProductResponse>(`${this.apiURL}/${slug}`);
  }

  getRelatedProducts(slug: string) {
    return this._http.get<IProductsResponse>(`${this.apiURL}/related/${slug}`);
  }

  getAllProductsAdmin() {
    return this._http.get<IProductsResponse>(`${this.apiURL}/admin`);
  }

  createProduct(formData: FormData) {
    return this._http.post<IProductResponse>(`${this.apiURL}/create`, formData);
  }

  updateProduct(slug: string, body: FormData | Partial<IProduct>) {
    return this._http.patch<IProductResponse>(`${this.apiURL}/${slug}`, body);
  }
}