import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";


@Injectable({providedIn: 'root'})
export class UserAuthService {
    async login(username: string, password: string) {
        const body = {
            username: username,
            password: password
        }

        const connectionURL = viteEnv.VITE_LOGIN_ENDPOINT;

        const res = await fetch(connectionURL, {
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
        const connectionURL = viteEnv.VITE_LOGOUT_ENDPOINT;

        const res = await fetch(connectionURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async refreshToken() {
        const connectionURL = viteEnv.VITE_REFRESH_ENDPOINT;

        const res = await fetch(connectionURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}