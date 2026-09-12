import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { CartService } from '../../core/services/cart-service';
import { Subscription } from 'rxjs';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnDestroy {
  constructor(
    private _authService: AuthService,
    private _cartService: CartService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}
  email = '';
  password = '';
  myError = '';
  private subscriptions: Subscription = new Subscription();

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const sub = this._authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this._authService.storeToken(res.token);
        this._cartService.mergeGuestCart();
        const role = this._authService.checkIfLoginWithRole();
        this._router.navigate([role === 'admin' ? '/admin' : '/']);
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
