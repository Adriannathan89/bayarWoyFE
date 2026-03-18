import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserAuthService {
    private connectionURL = import.meta.env.VITE_LOGIN_ENDPOINT

    async login(username: string, password: string) {
        const body = {
            username: username,
            password: password
        }
        const res = await fetch(this.connectionURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        
        if(!res.ok) {
            return false;
        }

        return true;
    }

    async logout() {
        const res = await fetch(import.meta.env.VITE_LOGOUT_ENDPOINT, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async refreshToken() {
        const res = await fetch(import.meta.env.VITE_REFRESH_ENDPOINT, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}