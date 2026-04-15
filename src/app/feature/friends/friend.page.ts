import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";
import { SearchFriendComponent } from "./component/search-friend.component";
import { NavbarOnFriendPageComponent } from "./component/navbarOnFriendPage.component";

@Component({
    standalone: true,
    imports: [HeaderComponent, SearchFriendComponent, NavbarOnFriendPageComponent],
    template: `
        <app-header></app-header>
        <div class="flex justify-center mt-[40px] gap-20">
            <app-navbar-on-friend-page></app-navbar-on-friend-page>
            <app-search-friend></app-search-friend>
        </div>
    `
})
export class FriendPage {}