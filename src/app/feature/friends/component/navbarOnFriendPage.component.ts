import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-navbar-on-friend-page",
    standalone: true,
    template: `
        <nav class="w-full h-16 bg-white shadow-md flex items-center justify-center">
            <button class="text-lg font-semibold text-gray-700 hover:text-gray-900" (click)="navigateToAddFriend()">
                Add Friend
            </button>
            <button class="text-lg font-semibold text-gray-700 hover:text-gray-900 ml-8" (click)="navigateToFriendList()">
                Friend List
            </button>
        </nav>
    `  
})
export class NavbarOnFriendPageComponent {
    constructor(private router: Router) {}

    navigateToAddFriend() {
        this.router.navigate(['/friends/add']);
    }
    navigateToFriendList() {
        this.router.navigate(['/friends/list']);
    }
}