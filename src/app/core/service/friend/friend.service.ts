import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";


@Injectable({
    providedIn: 'root'
})
export class FriendService {
    async getFriendsRequest() {
        const connectionURL = viteEnv.VITE_GET_FRIENDS_REQUEST_ENDPOINT;

        const res = await fetch(connectionURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!res.ok) {
            throw new Error('Failed to get friends request');
        }

        const json = await res.json();

        return json.data
    }


    async sendFriendRequest(friendUsername: string) {
        const connectionURL = viteEnv.VITE_SEND_FRIEND_REQUEST_ENDPOINT;
        const body = {
            friendUsername: friendUsername
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
            throw new Error('Failed to send friend request');
        }

        return true;
    }

    async responseFriendRequest(friendshipId: string, action: 'accept' | 'reject') {
        const connectionURL = viteEnv.VITE_RESPONSE_FRIEND_REQUEST_ENDPOINT;
        const body = {
            friendshipId: friendshipId,
            action: action
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
            throw new Error('Failed to respond to friend request');
        }

        return true;
    }
}