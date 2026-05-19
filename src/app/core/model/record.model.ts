export type Record = {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: string;
  createdAt: string;
}

export type UserRecord = {
  expenses: Record[];
  incomes: Record[];
  debts: Record[];
  cash: number;
  debt: number;
  receivable: number;
  balance: number;
}