import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-navbar-on-friend-page",
    standalone: true,
    template: `
        <nav class="w-full h-auto bg-transparent flex flex-col gap-12">
            <button 
            class="w-full text-lg font-semibold text-text-color hover:text-text-color/75 transition-colors duration-200 cursor-pointer flex items-center justify-end" 
            (click)="navigateToFriendList()">
                Friend List
            </button>

            <button 
            class="w-full text-lg font-semibold text-text-color hover:text-text-color/75 transition-colors duration-200 cursor-pointer flex items-center justify-end" 
            (click)="navigateToAddFriend()">
                Add Friend
            </button>

            <button 
            class="w-full text-lg font-semibold text-text-color hover:text-text-color/75 transition-colors duration-200 cursor-pointer flex items-center justify-end" 
            (click)="navigateToFriendRequests()">
                Friend Requests
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
        this.router.navigate(['/friends']);
    }
    navigateToFriendRequests() {
        this.router.navigate(['/friends/requests']);
    }
}