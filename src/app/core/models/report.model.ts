import { IApiResponse } from "./responses.model";

export interface ITopProduct {
  name: string;
  sold: number;
}

export interface ITopCustomer {
  name: string;
  totalSpent: number;
}

export interface IRankedItem {
  name: string;
  value: string;
}

export interface IDashboardReport {
  monthRevenue: number;
  pendingOrders: number;
  pendingTestimonials: number;
  topProducts: ITopProduct[];
  topCustomers: ITopCustomer[];
}

export type IReportResponse = IApiResponse<IDashboardReport>;
