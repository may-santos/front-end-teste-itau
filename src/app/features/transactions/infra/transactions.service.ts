import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Transaction } from '../domain/transactions.model';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBalance(): Observable<number> {
    return this.http.get<{ balance: number }>(`${this.apiUrl}/balance`).pipe(
      map((response) => response.balance),
      catchError((error) => {
        console.error('Erro ao obter saldo:', error);
        return throwError(
          () => new Error('Não foi possível carregar o saldo. Por favor, tente novamente.')
        );
      })
    );
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response) =>
        response.map(
          (item: any) =>
            ({
              id: item.id,
              createdAt: new Date(item.createdAt),
              amount: item.amount,
              type: item.type,
            } as Transaction)
        )
      ),
      catchError((error) => {
        console.error('Erro ao obter transações:', error);
        return throwError(
          () => new Error('Não foi possível carregar as transações. Por favor, tente novamente.')
        );
      })
    );
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    const transactionData = {
      createdAt: transaction.createdAt.toISOString(),
      amount: transaction.amount,
      type: transaction.type,
    };

    const api = `${this.apiUrl}/${transaction.type === 'DEPOSIT' ? 'deposit' : 'withdraw'}`;
    return this.http.post<Transaction>(api, transactionData).pipe(
      tap((response) => console.log('Transação criada com sucesso:', response)),
      catchError((error) => {
        const backendMessage =
          error?.error?.message ||
          'Não foi possível criar a transação. Por favor, tente novamente.';
        return throwError(() => new Error(backendMessage));
      })
    );
  }
}
