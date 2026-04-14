import { Injectable } from "@angular/core";
import { viteEnv } from "../../../../environments/environment.generated";


export type FriendRequest = {
    id: string;
    senderUsername: string;
    receiverUsername: string;
}

@Injectable({
    providedIn: 'root'
})
export class FriendRequestService {
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
        const data: FriendRequest[] = json.data.map((request: any) => ({
            id: request.id,
            senderUsername: request.senderUsername,
            receiverUsername: request.receiverUsername
        }));

        return data;
    }


    async sendFriendRequest(friendId: string) {
        const connectionURL = viteEnv.VITE_SEND_FRIEND_REQUEST_ENDPOINT;
        const body = {
            friendId: friendId
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

    async responseFriendRequest(friendRequestId: string, action: 'accept' | 'reject') {
        const connectionURL = viteEnv.VITE_RESPONSE_FRIEND_REQUEST_ENDPOINT;
        const body = {
            friendRequestId: friendRequestId,
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