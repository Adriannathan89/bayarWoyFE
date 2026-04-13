import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";
import { UserRecord } from "../types/user_record";
import { Record } from "../types/record";

@Injectable({
    providedIn: 'root'
})
export class UserRecordsService {
    async createRecord(title: string, description: string, amount: number, type: string) {
        const connectionURL = viteEnv.VITE_CREATE_EXPENSE_ENDPOINT;

        const body = {
            title: title,
            description: description,
            amount: amount,
            type: type
        }

        const res = await fetch(connectionURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if(!res.ok) {
            throw new Error('Failed to create expense');
        }

        return true;
    }

    private mapToUserRecord(data: any): Record {
        const mappedRecord: Record = {
            id: data.id,
            title: data.title,
            description: data.description,
            amount: data.amount,
            type: data.type
        };

        return mappedRecord;
    }

    async getRecords() {
        const connectionURL = viteEnv.VITE_GET_EXPENSE_ENDPOINT;

        const res = await fetch(connectionURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!res.ok) {
            throw new Error('Failed to get expenses');
        }

        const json = await res.json();
        const mappedData: UserRecord = {
            expenses: json.data.expenses ? json.data.expenses.map((record: any) => this.mapToUserRecord(record)) : [],
            incomes: json.data.incomes ? json.data.incomes.map((record: any) => this.mapToUserRecord(record)) : [],
            debts: json.data.debts ? json.data.debts.map((record: any) => this.mapToUserRecord(record)) : [],
            cash: json.data.cash,
            debt: json.data.debt,
            receivable: json.data.receivable
        } 

        return mappedData;
    }
}