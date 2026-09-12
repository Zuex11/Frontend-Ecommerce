import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/env';
import { ITestimonialResponse, ITestimonialsResponse } from '../models/testimonial.model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'testimonials';

  getApprovedTestimonials() {
    return this._http.get<ITestimonialsResponse>(`${this.apiURL}`);
  }

  upsertTestimonial(text: string) {
    return this._http.put<ITestimonialResponse>(`${this.apiURL}`, { text });
  }

  getPendingTestimonials() {
    return this._http.get<ITestimonialsResponse>(`${this.apiURL}/admin/pending`);
  }

  approveTestimonial(testimonialId: string) {
    return this._http.patch<ITestimonialResponse>(
      `${this.apiURL}/admin/${testimonialId}/approve`,
      {},
    );
  }
}
