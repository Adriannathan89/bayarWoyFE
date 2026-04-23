import { Component } from "@angular/core";
import { Friend, FriendService } from "@/core/service/friend/friend.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="w-[800px] p-4">
            <h1 class="text-2xl font-bold mb-4">Friend List</h1>
            <div *ngIf="friends.length === 0" class="text-gray-500">No friends found.</div>
            <ul>
                <li *ngFor="let friend of friends" class="mb-2 p-2 border rounded">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-semibold">{{ friend.username }}</p>
                            <p class="text-sm text-gray-500">Status: {{ friend.status }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    `
})
export class FriendListPage {
    friends: Friend[] = [];

    constructor(
        private friendService: FriendService,
        private snackBar: MatSnackBar
    ) {
        this.friendService.getFriend().then((data) => {
            this.friends = data;
        }).catch((err) => {
            this.snackBar.open('Failed to load friends', 'Close', { duration: 3000 });
        });
    }
}