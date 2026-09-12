import { IApiResponse } from "./responses.model";

export interface ITestimonialUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface ITestimonial {
  _id: string;
  userId: ITestimonialUser;
  text: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export type ITestimonialResponse = IApiResponse<ITestimonial>;
export type ITestimonialsResponse = IApiResponse<ITestimonial[]>;
