import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, from, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

interface User {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  private apiUrl = 'http://localhost:3000/clients';

  constructor(private auth0: Auth0Service, private http: HttpClient) {
    this.user$ = this.auth0.user$;
    this.isAuthenticated$ = this.auth0.isAuthenticated$;

    this.isAuthenticated$
      .pipe(
        switchMap((isAuthenticated) => {
          if (isAuthenticated) {
            return this.createUserAfterLogin();
          }
          return of(null);
        })
      )
      .subscribe();
  }

  login() {
    this.auth0.loginWithRedirect();
  }

  logout() {
    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  getAccessToken(): Observable<string> {
    return from(this.auth0.getAccessTokenSilently());
  }

  createUserAfterLogin(): Observable<any> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user || !user.email) {
          alert('Usuário ou e-mail não disponível');
          return of(null);
        }

        return this.getAccessToken().pipe(
          switchMap((token) => {
            console.log('Token obtido (primeiros 20 caracteres):', token.substring(0, 20) + '...');
            const headers = {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            };

            const newUser: User = {
              name: user.name || user.nickname || 'User',
              email: user.email,
            };

            return this.http.get(`${this.apiUrl}?email=${user.email}`, { headers }).pipe(
              switchMap((existingUser) => {
                return of(existingUser);
              }),
              catchError((error: HttpErrorResponse) => {
                if (error.status === 404) {
                  return this.http.post(this.apiUrl, newUser, { headers }).pipe(
                    tap((response) => console.log('Usuário criado com sucesso:', response)),
                    catchError((postError) => {
                      return of(null);
                    })
                  );
                }
                return throwError(() => error);
              })
            );
          })
        );
      })
    );
  }
}
