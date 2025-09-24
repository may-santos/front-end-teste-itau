import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';

import { App } from './app/app';
import { routes } from './app/app-routing-module';
import { environment } from './environments/environment';
import { AuthHttpInterceptor } from './app/core/auth/auth-http.interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      AuthModule.forRoot({
        domain: environment.auth.domain,
        clientId: environment.auth.clientId,
        authorizationParams: {
          redirect_uri: environment.auth.redirectUri,
          audience: environment.auth.audience,

          scope: 'openid profile email',
        },
        cacheLocation: 'localstorage',
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
