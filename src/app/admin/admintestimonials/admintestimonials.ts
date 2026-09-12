import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TestimonialRow } from './testimonialrow/testimonialrow';
import { TestimonialService } from '../../core/services/testimonial-service';
import { ITestimonial } from '../../core/models/testimonial.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [TestimonialRow],
  selector: 'app-admin-testimonials',
  styleUrl: './admintestimonials.css',
  templateUrl: './admintestimonials.html',
})
export class AdminTestimonials implements OnInit, OnDestroy {
  constructor(
    private _testimonialService: TestimonialService,
    private _cdr: ChangeDetectorRef,
  ) {}
  myPending: ITestimonial[] = [];
  private subscriptions: Subscription = new Subscription();

  onApprove(testimonialId: string): void {
    const sub = this._testimonialService.approveTestimonial(testimonialId).subscribe({
      next: () => {
        const refetchSub = this._testimonialService.getPendingTestimonials().subscribe({
          next: (res) => {
            this.myPending = res.data ?? [];
            this._cdr.detectChanges();
          },
          error: (err) => console.log(err),
        });
        this.subscriptions.add(refetchSub);
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  ngOnInit(): void {
    const pendingSub = this._testimonialService.getPendingTestimonials().subscribe({
      next: (res) => {
        this.myPending = res.data ?? [];
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(pendingSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
