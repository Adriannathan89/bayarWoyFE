import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private readonly apiBaseUrl = viteEnv.VITE_API_BASE_URL;

    async getTransactions() {
        const connectionURL = `${this.apiBaseUrl}/transaction`;

        const res = await fetch(connectionURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!res.ok) {
            throw new Error('Failed to get transactions');
        }

        const json = await res.json();

        return json.data;
    }

    async createTransaction(description: string, amount: number, debtorId: string) {
        const connectionURL = `${this.apiBaseUrl}/transaction/create`;
        const body = {
            description: description,
            amount: amount,
            debtorId: debtorId
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
            throw new Error('Failed to create transaction');
        }

        return true;
    }

    async finishTransaction(transactionId: string) {
        const connectionURL = `${this.apiBaseUrl}/transaction/finish`;
        const body = {
            transactionId: transactionId
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
            throw new Error('Failed to finish transaction');
        }

        return true;
    }
}