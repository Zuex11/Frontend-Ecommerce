import { IApiResponse } from './responses.model';
import { IAddressPayload } from './user.model';

export type IOrderStatus =
  | 'pending'
  | 'in progress'
  | 'shipped'
  | 'received'
  | 'cancelled by user'
  | 'cancelled by admin'
  | 'rejected'
  | 'refunded';

export const adminStatusOptions: IOrderStatus[] = [
  'pending',
  'in progress',
  'shipped',
  'received',
  'cancelled by user',
  'cancelled by admin',
  'rejected',
  'refunded',
];

export interface IOrderProductRef {
  _id: string;
  name: string;
  imgURL: string[];
}

export interface IOrderProduct {
  productId: IOrderProductRef;
  quantity: number;
  priceAtOrderTime: number;
}

export type IOrderAddress = IAddressPayload;

export interface IOrderUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface IOrder {
  _id: string;
  userId: string | IOrderUser;
  products: IOrderProduct[];
  totalPrice: number;
  status: IOrderStatus;
  address: IOrderAddress;
  orderedAt: string;
}

export type IOrderResponse = IApiResponse<IOrder>;
export type IOrdersResponse = IApiResponse<IOrder[]>;
export interface IOrderStatusChange {
  orderId: string;
  status: IOrderStatus;
}
