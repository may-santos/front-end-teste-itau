import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth.getAccessToken().pipe(
      switchMap((token) => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(authReq);
      }),
      catchError((err) => {
        return next.handle(req);
      })
    );
  }
}
