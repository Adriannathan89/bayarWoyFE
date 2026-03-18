import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserRegisterService {
    private connectionURL = import.meta.env.VITE_REGISTER_ENDPOINT

    async register(username: string, password: string) {
        const body = {
            username: username,
            password: password
        }
        const res = await fetch(this.connectionURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        if(!res.ok) {
            throw new Error('Failed to register user');
        }

        return true;
    }
}