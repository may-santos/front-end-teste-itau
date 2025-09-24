export interface Transaction {
  id: string;
  createdAt: Date;
  amount: number;
  type: 'WITHDRAW' | 'DEPOSIT';
}
