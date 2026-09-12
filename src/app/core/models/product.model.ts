import { IApiResponse } from "./responses.model";

export interface INamedRef {
  _id: string;
  name: string;
}
export interface IProduct {
 _id: string;
  name: string;
  desc: string;
  price: number;
  imgURL: string[];
  stock: number;         
  isActive: boolean;
  isDeleted: boolean;
  isTopSale: boolean;
  isNewArrival: boolean;
  slug: string;
  categoryId: INamedRef;
  subcategoryId: INamedRef;
  createdAt: string;
  updatedAt: string;
}
export type IProductResponse = IApiResponse<IProduct>;
export type IProductsResponse = IApiResponse<IProduct[]>;

export interface IProductFilters {
  category?: string;
  subcategory?: string;
  isTopSale?: boolean;
  isNewArrival?: boolean;
}
export type IProductToggleField = 'isActive' | 'isTopSale' | 'isNewArrival';
export interface IProductToggleEvent {
  slug: string;
  field: IProductToggleField;
  value: boolean;
}
