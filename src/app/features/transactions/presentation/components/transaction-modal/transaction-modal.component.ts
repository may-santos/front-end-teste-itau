import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../../domain/transactions.model';

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss'],
})
export class TransactionModalComponent {
  _isVisible = false;

  @Input()
  set isVisible(value: boolean) {
    this._isVisible = value;
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  @Input() isSaving = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Transaction>();

  newTransaction: Transaction = {
    createdAt: new Date(),
    amount: 0,
    type: 'WITHDRAW',
  };

  onSave() {
    if (this.isSaving) return
    this.save.emit(this.newTransaction);
    this.onClose();
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  resetForm() {
    this.newTransaction = {
      id: '',
      createdAt: new Date(),
      amount: 0,
      type: 'WITHDRAW',
    };
  }
}
