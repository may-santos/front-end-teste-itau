import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <div class="flex items-center">
        <span class="text-sm mr-3">Olá, {{ (auth.user$ | async)?.name || 'Usuário' }}</span>
        <button 
          (click)="logout()" 
          class="px-4 py-2 rounded-md bg-white text-indigo-800 hover:bg-gray-100 transition-colors font-medium flex items-center shadow-sm border border-transparent">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </ng-container>

    <ng-template #loggedOut>
      <button 
        (click)="login()" 
        class="px-4 py-2 rounded-md bg-white text-indigo-800 hover:bg-gray-100 transition-colors font-medium flex items-center shadow-sm border border-transparent">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Entrar
      </button>
    </ng-template>
  `,
  styles: []
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }
}