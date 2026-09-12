import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { CartService } from '../../core/services/cart-service';
import { IGender } from '../../core/models/auth.model';
import { Subscription } from 'rxjs';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-signup',
  styleUrl: './signup.css',
  templateUrl: './signup.html',
})
export class Signup implements OnDestroy {
  constructor(
    private _authService: AuthService,
    private _cartService: CartService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}
  firstName = '';
  lastName = '';
  email = '';
  gender: IGender | '' = '';
  password = '';
  confirmPassword = '';
  myError = '';
  private subscriptions: Subscription = new Subscription();

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.myError = "Passwords don't match";
      this._cdr.detectChanges();
      return;
    }
    const sub = this._authService
      .signup({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        gender: this.gender as IGender,
      })
      .subscribe({
        next: () => {
          const loginSub = this._authService
            .login({ email: this.email, password: this.password })
            .subscribe({
              next: (res) => {
                this._authService.storeToken(res.token);
                this._cartService.mergeGuestCart();
                this._router.navigate(['/']);
              },
              error: (err) => {
                this.myError = err.error?.message || err.error?.error || 'Something went wrong';
                this._cdr.detectChanges();
              },
            });
          this.subscriptions.add(loginSub);
        },
        error: (err) => {
          this.myError = err.error?.message || err.error?.error || 'Something went wrong';
          this._cdr.detectChanges();
        },
      });
    this.subscriptions.add(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
