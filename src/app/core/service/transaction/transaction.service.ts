import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    async getTransactions() {
        const connectionURL = viteEnv.VITE_GET_TRANSACTION_ENDPOINT;

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
        const connectionURL = viteEnv.VITE_CREATE_TRANSACTION_ENDPOINT;
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
        const connectionURL = viteEnv.VITE_FINISH_TRANSACTION_ENDPOINT;
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