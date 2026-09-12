import { IApiResponse } from "./responses.model";

export interface ICartProduct {
  _id: string;
  name: string;
  imgURL: string[];
  price: number;
  stock: number;
}

export interface ICartItem {
  _id: string;
  productId: ICartProduct;
  quantity: number;
  price: number;
  isPriceChanged: boolean;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
}

export type ICartResponse = IApiResponse<ICart>;
