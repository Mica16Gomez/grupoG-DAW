import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthStore } from './auth-store';

export function authInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
    const authStore = inject(AuthStore);
    const authToken = authStore.obtenerToken();

    const request = authToken
        ? req.clone({
              headers: req.headers.set(
                  'Authorization',
                  `Bearer ${authToken}`,
              ),
          })
        : req;

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.includes('/auth')) {
                authStore.cerrarSesion();
            }
            return throwError(() => error);
        }),
    );
}
