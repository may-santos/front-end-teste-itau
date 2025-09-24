import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/transactions', 
    pathMatch: 'full' 
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/presentation/pages/transactions-page.component').then(m => m.TransactionsPageComponent),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
