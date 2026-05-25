import { Injectable } from "@angular/core";
import axiosInstance from "../../lib/axios";
import { Record, UserRecord } from "@/core/model/record.model";

@Injectable({ providedIn: 'root' })
export class UserRecordsService {
  async createRecord(title: string, description: string, amount: number, date: string) {
    await axiosInstance.post('/user/record', { title, description, amount, date });
    return true;
  }

  private mapToUserRecord(data: any): Record {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      amount: data.amount,
      category: data.category ?? '',
      type: data.type,
      createdAt: data.createdAt ?? data.created_at ?? ''
    };
  }

  async getRecords() {
    const res = await axiosInstance.get('/user/records');
    const data = res.data.data;
    console.log(data);
    const mappedData: UserRecord = {
      expenses: data.expenses ? data.expenses.map((r: any) => this.mapToUserRecord(r)) : [],
      incomes: data.incomes ? data.incomes.map((r: any) => this.mapToUserRecord(r)) : [],
      debts: data.debts ? data.debts.map((r: any) => this.mapToUserRecord(r)) : [],
      cash: data.cash,
      debt: data.debt,
      receivable: data.receivable,
      balance: data.balance
    };
    return mappedData;
  }
}