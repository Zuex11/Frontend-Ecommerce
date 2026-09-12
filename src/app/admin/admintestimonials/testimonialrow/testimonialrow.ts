import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITestimonial } from '../../../core/models/testimonial.model';

@Component({
  imports: [],
  selector: 'app-testimonial-row',
  styleUrl: './testimonialrow.css',
  templateUrl: './testimonialrow.html',
})
export class TestimonialRow {
  @Input() testimonial!: ITestimonial;
  @Output() approve = new EventEmitter<string>();

  onApprove(): void {
    this.approve.emit(this.testimonial._id);
  }
}
