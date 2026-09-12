import { IApiResponse } from "./responses.model";

export interface ISubcategory {
_id:string,
categoryId: string,
name:string,
slug:string,
isActive:boolean,
isDeleted:boolean
}
export type ISubcategoryResponse = IApiResponse<ISubcategory>;
export type ISubcategoriesResponse = IApiResponse<ISubcategory[]>;