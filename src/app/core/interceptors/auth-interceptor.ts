import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  const token = _authService.returnToken();
  const authRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;
  return next(authRequest).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !authRequest.url.includes('/auth/login')) {
        _authService.removeToken();
        _router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
