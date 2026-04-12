import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";

@Injectable({
    providedIn: 'root'
})
export class UserRecordsService {
    async createExpense(title: string, description: string, amount: number, type: string) {
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

    async getExpenses() {
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

        return json.data;
    }
}