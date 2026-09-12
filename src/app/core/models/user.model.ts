import { IApiResponse } from './responses.model';
import { IGender, IRole } from './auth.model';

export interface IAddress {
  _id: string;
  title: string;
  fullName: string;
  country: string;
  governorate: string;
  phoneNumber: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  isDefault: boolean;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: IRole;
  gender: IGender;
  isBlocked: boolean;
  isDeleted: boolean;
  addresses: IAddress[];
  createdAt: string;
  updatedAt: string;
}

export type IUserResponse = IApiResponse<IUser>;
export type IUsersResponse = IApiResponse<IUser[]>;
export type IAddressPayload = Omit<IAddress, '_id'>;
export interface IEditUserPayload {
  firstName: string;
  lastName: string;
  gender: IGender;
}