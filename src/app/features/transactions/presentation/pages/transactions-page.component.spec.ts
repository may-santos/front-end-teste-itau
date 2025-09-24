import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsPageComponent } from './transactions-page.component';
import { TransactionsService } from '../../infra/transactions.service';
import { of } from 'rxjs';
import { Transaction } from '../../domain/transactions.model';
import { TransactionModalComponent } from '../components/transaction-modal/transaction-modal.component';
import { CommonModule } from '@angular/common';

describe('TransactionsPageComponent', () => {
  let component: TransactionsPageComponent;
  let fixture: ComponentFixture<TransactionsPageComponent>;
  let transactionsServiceMock: jasmine.SpyObj<TransactionsService>;
  
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      createdAt: new Date(),
      amount: 100,
      type: 'DEPOSIT'
    },
    {
      id: '2',
      createdAt: new Date(),
      amount: 50,
      type: 'WITHDRAW'
    }
  ];
  
  beforeEach(() => {
    transactionsServiceMock = jasmine.createSpyObj('TransactionsService', ['getTransactions']);
    transactionsServiceMock.getTransactions.and.returnValue(of(mockTransactions));
    
    TestBed.configureTestingModule({
      imports: [CommonModule, TransactionsPageComponent, TransactionModalComponent],
      providers: [
        { provide: TransactionsService, useValue: transactionsServiceMock }
      ]
    });
    
    fixture = TestBed.createComponent(TransactionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load transactions on init', () => {
    expect(transactionsServiceMock.getTransactions).toHaveBeenCalled();
    component.transactions$.subscribe(transactions => {
      expect(transactions).toEqual(mockTransactions);
    });
  });
  
  it('should toggle modal visibility', () => {
    expect(component.isModalVisible).toBeFalse();
    
    component.openModal();
    expect(component.isModalVisible).toBeTrue();
    
    component.closeModal();
    expect(component.isModalVisible).toBeFalse();
  });
  
  it('should handle transaction save and close modal', () => {
    spyOn(console, 'log');
    spyOn(component, 'closeModal');
    
    const newTransaction: Transaction = {
      id: '3',
      createdAt: new Date(),
      amount: 25,
      type: 'WITHDRAW'
    };
    
    component.onTransactionSave(newTransaction);
    expect(console.log).toHaveBeenCalledWith('Nova transação salva:', newTransaction);
    expect(component.closeModal).toHaveBeenCalled();
  });
});
