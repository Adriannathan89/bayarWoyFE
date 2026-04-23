import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";


export type Friend = {
    id: string;
    username: string;
    status: string;
}

@Injectable({
    providedIn: "root"
})
export class FriendService {
    private readonly apiBaseUrl = viteEnv.VITE_API_BASE_URL;

    async getFriend() {
        const connectionURL = `${this.apiBaseUrl}/user/friend`;

        const res = await fetch(connectionURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!res.ok) {
            throw new Error('Failed to get friends');
        }

        const json = await res.json();

        if(json.data === null) {
            return [];
        }

        const data: Friend[] = json.data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            status: friend.status
        }));

        return data;
    }

    async searchFriend(keyword: string) {
        const connectionURL = `${this.apiBaseUrl}/user/friend/search`;
        const body = {
            name: keyword
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
            throw new Error('Failed to search friends');
        }

        const json = await res.json();
        
        if(json.data === null) {
            return [];
        }

        const data: Friend[] = json.data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            status: friend.status
        }));

        return data;
    }
}