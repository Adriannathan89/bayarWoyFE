import { Injectable } from "@angular/core";
import axiosInstance from "../../lib/axios";

export type FriendRequest = {
  id: string;
  senderUsername: string;
  receiverUsername: string;
}

@Injectable({ providedIn: 'root' })
export class FriendRequestService {
  async getFriendsRequest() {
    const res = await axiosInstance.get('/user/friend');
    return res.data.data.map((request: any) => ({
      id: request.id,
      senderUsername: request.senderUsername,
      receiverUsername: request.receiverUsername
    })) as FriendRequest[];
  }

  async sendFriendRequest(friendId: string) {
    await axiosInstance.post('/user/friend/add', { friendId });
    return true;
  }

  async responseFriendRequest(friendRequestId: string, action: 'accept' | 'reject') {
    await axiosInstance.post('/user/friend/response', { friendRequestId, action });
    return true;
  }
}