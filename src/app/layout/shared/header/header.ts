import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}

  get isLoggedIn(): boolean {
    return this._authService.returnToken() !== null;
  }

  get isAdmin(): boolean {
    return this._authService.checkIfLoginWithRole() === 'admin';
  }

  logout(): void {
    this._authService.removeToken();
    this._router.navigate(['/']);
  }
}
