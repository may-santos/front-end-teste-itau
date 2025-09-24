import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing-module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from './core/auth/auth-http.interceptor';
import { TransactionModalComponent } from './features/transactions/presentation/components/transaction-modal/transaction-modal.component';
import { App } from './app';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule.forRoot({
      ...environment.auth,
    }),
    TransactionModalComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
