import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { TestimonialService } from '../../core/services/testimonial-service';
import { ITestimonial } from '../../core/models/testimonial.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-testimonials',
  styleUrl: './testimonials.css',
  templateUrl: './testimonials.html',
})
export class Testimonials implements OnInit, OnDestroy {
  constructor(
    private _testimonialService: TestimonialService,
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
  ) {}
  myTestimonials: ITestimonial[] = [];
  text = '';
  myError = '';
  myMessage = '';
  isLoggedIn = false;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.isLoggedIn = !!this._authService.checkIfLoginWithRole();
    const sub = this._testimonialService.getApprovedTestimonials().subscribe({
      next: (res) => {
        this.myTestimonials = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const sub = this._testimonialService.upsertTestimonial(this.text).subscribe({
      next: (res) => {
        this.myMessage = res.message;
        this.text = '';
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.myError = err.error?.message || 'Something went wrong';
        this._cdr.detectChanges();
      },
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
