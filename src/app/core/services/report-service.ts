import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/env';
import { IReportResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'report';

  getDashboardReport() {
    return this._http.get<IReportResponse>(`${this.apiURL}/dashboard`);
  }
}
