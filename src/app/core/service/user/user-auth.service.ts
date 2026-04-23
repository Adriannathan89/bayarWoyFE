import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";


@Injectable({providedIn: 'root'})
export class UserAuthService {
    private readonly apiBaseUrl = viteEnv.VITE_API_BASE_URL;

    async login(username: string, password: string) {
        const body = {
            username: username,
            password: password
        }

        const connectionURL = `${this.apiBaseUrl}/auth/login`;

        const res = await fetch(connectionURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        
        if(!res.ok) {
            throw new Error('Login failed');
        }

        return true;
    }

    async logout() {
        const connectionURL = `${this.apiBaseUrl}/auth/logout`;

        const res = await fetch(connectionURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async refreshToken() {
        const connectionURL = `${this.apiBaseUrl}/auth/refresh`;

        const res = await fetch(connectionURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return res.ok;
    }

    async isAuthenticated() {
        const connectionURL = `${this.apiBaseUrl}/auth/validate-session`;

        const res = await fetch(connectionURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.ok;
    }
}