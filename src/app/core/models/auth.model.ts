import { IApiResponse } from './responses.model';

export interface ILoginData {
  email: string;
  password: string;
}
export interface ILoginResponse {
  message: string;
  token: string;
}
export type IGender = 'male' | 'female';
export type IRole = 'user' | 'admin';
export interface ISignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: IGender;
}
export interface ISafeUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: IRole;
  gender: IGender;
}
export interface ITokenPayload {
  _id: string;
  role: IRole;
  firstName: string;
  lastName: string;
  isBlocked: boolean;
  exp: number;
  gender: IGender;
}
export type ISignupResponse = IApiResponse<ISafeUser>;
