import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Transaction } from '../../domain/transactions.model';
import { TransactionsService } from '../../infra/transactions.service';
import { TransactionModalComponent } from '../components/transaction-modal/transaction-modal.component';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [CommonModule, TransactionModalComponent],
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.scss'],
})
export class TransactionsPageComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  isModalVisible = false;
  isSaving = false;
  totalBalance = 0;

  constructor(private transactionsService: TransactionsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.transactions$ = this.transactionsService.getTransactions();
    this.transactionsService.getBalance().subscribe({
      next: (total) => {
        this.totalBalance = total;
      },
      error: () => {
        this.totalBalance = 0;
      },
    });
  }

  openModal(): void {
    this.isModalVisible = true;
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  onTransactionSave(transaction: Transaction): void {
    this.isSaving = true;

    this.transactionsService.createTransaction(transaction).subscribe({
      next: () => {
        this.transactions$ = this.transactionsService.getTransactions();
        this.transactionsService.getBalance().subscribe({
          next: (total) => {
            this.totalBalance = total;
          },
          error: () => {
            this.totalBalance = 0;
          },
        });
        this.isSaving = false;
        this.closeModal();
      },
      error: (error) => {
        this.isSaving = false;
        alert(error?.message || 'Erro ao salvar a transação. Por favor, tente novamente.');
      },
    });
  }
}
