import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";

export type RegisterRequest = {
    username: string;
    password: string;
};

@Injectable({
    providedIn: 'root'
})
export class UserRegisterService {
    private connectionURL = viteEnv.VITE_REGISTER_ENDPOINT;

    async register(username: string, password: string) {
        const body: RegisterRequest = {
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