import { Component, ChangeDetectorRef } from "@angular/core";
import { Friend, FriendService } from "../../../core/service/friend/friend.service";
import { FriendRequestService } from "../../../core/service/friend/friend-request.service";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-search-friend',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="relative w-[800px] h-[400px] bg-secondary-color rounded-2xl p-8 shadow-md mt-4 mx-auto">
            <div class="mb-[20px]">
                <p class="text-xl font-bold text-text-color">Search Friend</p>
            </div>
            <form [formGroup]="queryForm" (ngSubmit)="searchFriend()">
            <div class="w-full flex justify-center">
                <input type="text"
                formControlName="query" 
                class="bg-primary-color w-[680px] h-[40px] rounded-xl 
                shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 py-1 px-3"  />
            </div>

            <button 
            type="submit"
            class="cursor-pointer">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 absolute right-18 top-25 transform -translate-y-1/2 text-secondary-color"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
            </svg>
            </button>
            </form>

            <div class="mt-4 p-4 overflow-y-auto h-[240px]">
                @if (!hasSearched) {
                    <p class="text-text-color text-xl font-medium">Find and connect with your friends!</p>
                } @else {
                @if (loading) {
                    <p class="text-text-color">Loading...</p>
                } @else {
                    <p class="text-lg font-semibold text-text-color mb-2">Results:</p>
                    @if (!friendResponse || friendResponse.length === 0) {
                        <p class="text-text-color">No friends found.</p>
                    } @else {
                        @for (friend of friendResponse; track friend.id) {
                            <div class="flex justify-between p-4 bg-primary-color rounded-lg mb-2">
                                <p class="flex items-center text-text-color font-medium">{{ friend.username }}</p>
                                @if(friend.status === 'not_friend') {
                                    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer" 
                                    (click)="addFriend(friend.id)">
                                        Add Friend
                                    </button>
                                }
                            </div>
                        }
                    }
                }
                }
            </div>
        </div>
    `
})
export class SearchFriendComponent {
    friendResponse: Friend[] = [];
    error: string | null = null;
    loading = false;
    hasSearched = false;
    queryForm;

    constructor(private friendService: FriendService, 
        private friendRequestService: FriendRequestService, 
        private fb: FormBuilder, 
        private cdr: ChangeDetectorRef,
        private snackBar: MatSnackBar) {
        this.queryForm = this.fb.nonNullable.group({
            query: ['', [Validators.required]]
        });
    }

    searchFriend() {
        const query = String(this.queryForm.value.query);
        this.loading = true;
        this.error = null;

        this.friendService.searchFriend(query)
            .then((res: any) => {
                const data: Friend[] = res.map((friend: any) => ({
                    id: friend.id,
                    username: friend.username,
                    status: friend.status
                }));
                this.friendResponse = data;
            })
            .catch((err: any) => {
                this.loading = false;
                this.error = err.message;
                this.friendResponse = [];
            }).finally(() => {
                this.loading = false;
                this.hasSearched = true;
                this.cdr.markForCheck();
            });
    }

    addFriend(friendId: string) {
        this.friendRequestService.sendFriendRequest(friendId)
            .then(() => {
                this.friendResponse = this.friendResponse.map(friend => {
                    if (friend.id === friendId) {
                        return { ...friend, status: 'pending' };
                    }
                    return friend;
                });
                this.cdr.detectChanges();
                this.snackBar.open('Friend request sent successfully.', 'Close', {
                    duration: 3000
                });
            })
            .catch((err: any) => {
                this.error = err.message;
                this.snackBar.open('Failed to send friend request.', 'Close', {
                    duration: 3000
                });
            });

    }
}