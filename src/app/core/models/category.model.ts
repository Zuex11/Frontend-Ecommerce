import { IApiResponse } from "./responses.model";
import { ISubcategory } from "./subcategory.model";

export interface ICategory {
_id:string,
name:string,
slug:string,
isActive:boolean,
isDeleted:boolean
}
export interface ICategoryGroup {
  category: ICategory;
  subcategories: ISubcategory[];
}
export type ICategoryResponse = IApiResponse<ICategory>;
export type ICategoriesResponse = IApiResponse<ICategory[]>;
