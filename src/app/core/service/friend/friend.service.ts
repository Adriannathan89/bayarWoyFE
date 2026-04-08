import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";
import { HttpClient } from "@angular/common/http";


export type Friend = {
    id: string;
    username: string;
    status: string;
}

@Injectable({
    providedIn: "root"
})
export class FriendService {
    constructor(private http: HttpClient) {}

    async getFriend() {
        const connectionURL = viteEnv.VITE_GET_FRIENDS_ENDPOINT;

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
        const data: Friend[] = json.data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            status: friend.status
        }));

        return data;
    }

    async searchFriend(keyword: string) {
        const connectionURL = viteEnv.VITE_SEARCH_FRIEND_ENDPOINT;
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
        const data: Friend[] = json.data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            status: friend.status
        }));

        return data;
    }
}